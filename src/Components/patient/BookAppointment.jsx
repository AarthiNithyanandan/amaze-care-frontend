import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, bookAppointment } from "../../services/PatientService";

const BookAppointment = () => {
  const patientId = localStorage.getItem("patientId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
    visitType: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors();
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setMessage("Failed to load doctors.");
        setIsError(true);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchDoctor.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchDoctor, doctors]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const errors = [];
    const today = new Date().toISOString().split("T")[0];

    if (!form.doctorId) errors.push("Please select a doctor.");
    if (!form.appointmentDate) errors.push("Appointment date is required.");
    else if (form.appointmentDate < today) errors.push("Appointment date cannot be in the past.");
    if (!form.appointmentTime) errors.push("Appointment time is required.");
    else {
      const [hour] = form.appointmentTime.split(":").map(Number);
      if (hour < 9 || hour > 21) errors.push("Appointment time must be between 09:00 and 21:00.");
    }
    if (!form.visitType) errors.push("Please select a visit type.");
    if (!["IN PERSON", "ONLINE"].includes(form.visitType)) errors.push("Visit type must be IN PERSON or ONLINE.");

    if (errors.length > 0) {
      setMessage(errors.join(" | "));
      setIsError(true);
      return;
    }

    try {
      const payload = {
        doctorId: parseInt(form.doctorId),
        patientId: parseInt(patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        symptoms: form.symptoms,
        visitType: form.visitType,
        status: "SCHEDULED",
      };

      const res = await bookAppointment(payload);

      setMessage(`Appointment booked successfully! ID: ${res.data.appointmentId}`);
      setIsError(false);
      setForm({ doctorId: "", appointmentDate: "", appointmentTime: "", symptoms: "", visitType: "" });
      setSearchDoctor("");
    } catch (err) {
      console.error(err);
      let errorMsg = "";
      if (err.response?.data) {
        errorMsg = typeof err.response.data === "object"
          ? Object.values(err.response.data).join(" | ")
          : err.response.data;
      } else {
        errorMsg = "Failed to book appointment. Please check your inputs.";
      }
      setMessage(errorMsg);
      setIsError(true);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "700px" }}>
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/patient/dashboard/appointments")}>
         Back to My Appointments
      </button>

      <h3 className="fw-bold text-center mb-4" style={{ color: "#6f42c1" }}>Book an Appointment</h3>

      {message && <div className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Search Doctor</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Type name or specialization"
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
          />
          <select name="doctorId" className="form-select" value={form.doctorId} onChange={handleChange}>
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                {doc.name} ({doc.speciality})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Appointment Date</label>
          <input type="date" name="appointmentDate" className="form-control" value={form.appointmentDate} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Appointment Time</label>
          <input type="time" name="appointmentTime" className="form-control" value={form.appointmentTime} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Symptoms</label>
          <textarea name="symptoms" className="form-control" rows="3" placeholder="Describe your symptoms" value={form.symptoms} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Visit Type</label>
          <select name="visitType" className="form-select" value={form.visitType} onChange={handleChange}>
            <option value="">Select Visit Type</option>
            <option value="IN PERSON">In Person</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>

        <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: "#b38cb4", color: "#fff" }}>
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
