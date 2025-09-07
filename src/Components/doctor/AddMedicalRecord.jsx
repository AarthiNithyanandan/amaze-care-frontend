import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentById, addMedicalRecord, updateAppointmentStatus } from "../../services/DoctorService";
import { getDoctorId, getAppointmentId, setRecordId } from "../../utils/auth";

export default function AddMedicalRecords() {
  const doctorId = getDoctorId();
  const appointmentId = getAppointmentId();
  const navigate = useNavigate();

  const [form, setForm] = useState({ diagnosis: "", notes: "", recordDate: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
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
        const message = err.response?.data?.message || err.message || "Failed to fetch appointment status.";
        setErrorMsg(message);
      }
    };

    fetchStatus();
  }, [appointmentId]);

  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || appointmentStatus === "COMPLETED") return;

    try {
     
      const payload = { ...form, appointmentId: parseInt(appointmentId), doctorId: parseInt(doctorId) };
      const res = await addMedicalRecord(payload);
      setRecordId(res.data.recordId);

      await updateAppointmentStatus(appointmentId, "COMPLETED");

      setSuccessMsg("Medical record added successfully! Appointment marked as COMPLETED.");
      setAppointmentStatus("COMPLETED");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to add medical record.";
      setErrorMsg(message);
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Medical Record</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Diagnosis</label>
          <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange} className="form-control" placeholder="Enter diagnosis"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="form-control" rows="5" placeholder="Enter notes"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Record Date</label>
          <input type="date" name="recordDate" value={form.recordDate} onChange={handleChange} className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Record & Complete Appointment
        </button>
      </form>
    </div>
  );
}
