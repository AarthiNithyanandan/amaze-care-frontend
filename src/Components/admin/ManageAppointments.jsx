
import  { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/admin";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "", doctorId: "", appointmentDate: "",
    status: "", symptoms: "", visitType: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => { loadAppointments(); }, []);

  const handleError = (err) => {
    if (err.response) {
      const data = err.response.data;
      setErrorMsg(typeof data === "object" ? Object.values(data).join(", ") : data);
    } else setErrorMsg(err.message);
  };

  const loadAppointments = async () => {
    try {
      const res = await axios.get(`${API}/appointments`, getAuthHeaders());
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  const addAppointment = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.post(`${API}/appointments`, newAppointment, getAuthHeaders());
      setSuccessMsg("Appointment added successfully!");
      loadAppointments();
      setNewAppointment({ patientId: "", doctorId: "", appointmentDate: "", status: "", symptoms: "", visitType: "" });
    } catch (err) { handleError(err); }
  };

  const updateAppointmentStatus = async (id, status) => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.put(`${API}/appointments/${id}/status/${status}`, {}, getAuthHeaders());
      setSuccessMsg("Appointment status updated!");
      loadAppointments();
    } catch (err) { handleError(err); }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-secondary mb-4">Manage Appointments</h3>

      {successMsg && <div className="alert alert-success rounded-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger rounded-4">{errorMsg}</div>}

      <div className="card shadow-lg rounded-4 p-4 mb-5" style={{ border: "none" }}>
        <h5 className="fw-bold text-primary mb-3">Add Appointment</h5>
        <div className="row g-3">
          {Object.keys(newAppointment).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={newAppointment[field]}
                onChange={(e) => setNewAppointment({ ...newAppointment, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3 w-100 rounded-4" onClick={addAppointment}>
          Add Appointment
        </button>
      </div>

      <div className="card shadow-lg rounded-4 p-3" style={{ border: "none" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((a) => (
                  <tr key={a.appointmentId} className={a.status === "SCHEDULED" ? "table-success" : ""}>
                    <td>{a.appointmentId}</td>
                    <td className="fw-semibold">{a.patient?.name}</td>
                    <td>{a.doctor?.name}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.status}</td>
                    <td>
                      <select
                        className="form-select form-select-sm rounded-3"
                        defaultValue=""
                        onChange={(e) => updateAppointmentStatus(a.appointmentId, e.target.value)}
                      >
                        <option value="" disabled>
                          Change Status
                        </option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
