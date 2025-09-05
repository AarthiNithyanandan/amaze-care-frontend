import { useState } from "react";
import axios from "axios";

const BookAppointment = () => {
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patientId");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
    visitType: "",
  });

  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const payload = {
        doctorId: parseInt(form.doctorId),
        patientId: parseInt(patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime, // Added time
        symptoms: form.symptoms,
        visitType: form.visitType,
        status: "SCHEDULED",
      };

      const res = await axios.post(
        "http://localhost:8080/api/appointments/add",
        payload,
        config
      );

      setMessage(`Appointment booked successfully! ID: ${res.data.appointmentId}`);
      setIsError(false);

      setForm({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        symptoms: "",
        visitType: "",
      });
    } catch (err) {
      console.error("Error booking appointment", err);

      if (err.response && err.response.data && typeof err.response.data === "object") {
        const errors = Object.values(err.response.data).join(" | ");
        setMessage(errors);
      } else if (err.response && err.response.data && typeof err.response.data === "string") {
        setMessage(err.response.data);
      } else {
        setMessage("Failed to book appointment. Please check your inputs.");
      }

      setIsError(true);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg rounded-4 p-5 mx-auto" style={{ maxWidth: "700px" }}>
        <h3 className="fw-bold text-primary mb-4 text-center">Book an Appointment</h3>

        {message && (
          <div className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Doctor ID</label>
            <input
              name="doctorId"
              className="form-control form-control-lg"
              placeholder="Enter Doctor ID"
              value={form.doctorId}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              className="form-control form-control-lg"
              value={form.appointmentDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              className="form-control form-control-lg"
              value={form.appointmentTime}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Symptoms</label>
            <textarea
              name="symptoms"
              className="form-control form-control-lg"
              rows="3"
              placeholder="Describe your symptoms"
              value={form.symptoms}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Visit Type</label>
            <select
              name="visitType"
              className="form-select form-select-lg"
              value={form.visitType}
              onChange={handleChange}
            >
              <option value="">Select Visit Type</option>
              <option value="IN_PERSON">In Person</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
