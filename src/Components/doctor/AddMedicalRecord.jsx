import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentById, addMedicalRecord, completeAppointment } from "../../services/DoctorService";

export default function AddMedicalRecords() {
  const doctorId = localStorage.getItem("doctorId");
  const appointmentId = localStorage.getItem("appointmentId");
  const navigate = useNavigate();

  const [form, setForm] = useState({ diagnosis: "", notes: "", recordDate: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");

  useEffect(() => {
    if (!appointmentId) return setErrorMsg("Select an appointment first!");

    const fetchStatus = async () => {
      try {
        const res = await getAppointmentById(appointmentId);
        setAppointmentStatus(res.data.status);
        if (res.data.status === "COMPLETED") {
          setErrorMsg("This appointment is already completed.");
        }
      } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || err.message || "Failed to fetch appointment status.";
        setErrorMsg(message);
      }
    };

    fetchStatus();
  }, [appointmentId]);

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || appointmentStatus === "COMPLETED") return;

    try {
      const payload = { ...form, appointmentId: parseInt(appointmentId), doctorId: parseInt(doctorId) };
      const res = await addMedicalRecord(payload);

      try {
        await completeAppointment(appointmentId);
      } catch (err) {
        console.error(err);
        alert("Medical record added, but failed to mark appointment as completed.");
        return;
      }

      localStorage.setItem("recordId", res.data.recordId);
      console.log("Medical record added successfully. Appointment marked as COMPLETED.");
      navigate("/doctor/dashboard/prescribe");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Failed to add medical record.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="p-4 bg-white shadow rounded w-100" style={{ maxWidth: "900px" }}>
        <h2 className="text-center mb-4">Add Medical Record</h2>
        {errorMsg && <div className="alert alert-danger text-center mb-3">{errorMsg}</div>}

        {appointmentStatus !== "COMPLETED" && (
          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-3">
              <label className="form-label">Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter diagnosis"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-control"
                rows="5"
                placeholder="Enter notes"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Record Date</label>
              <input
                type="date"
                name="recordDate"
                value={form.recordDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Save Record & Complete Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
