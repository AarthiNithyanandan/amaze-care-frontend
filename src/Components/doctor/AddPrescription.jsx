import React, { useState, useEffect } from "react";
import { getPrescriptionByMedicalRecord, addPrescription } from "../../services/DoctorService";

export default function AddPrescriptions() {
  const doctorId = localStorage.getItem("doctorId");
  const recordId = localStorage.getItem("recordId");

  const [form, setForm] = useState({ medicineName: "", dosage: "", timing: "", instructions: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    if (!recordId) return setErrorMsg("Please add a medical record first!");

    const checkExistingPrescription = async () => {
      try {
        const res = await getPrescriptionByMedicalRecord(recordId);
        if (res.data) {
          setAlreadyExists(true);
          setErrorMsg("Prescription already exists for this medical record.");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setAlreadyExists(false);
          setErrorMsg("");
        } else {
          setErrorMsg("Failed to check existing prescription.");
        }
      }
    };

    checkExistingPrescription();
  }, [recordId]);

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recordId) return setErrorMsg("Medical record is missing.");
    if (alreadyExists) return setErrorMsg("Prescription already exists. Cannot add another.");

    try {
      const payload = { ...form, doctorId: parseInt(doctorId), recordId: parseInt(recordId) };
      await addPrescription(payload);
      alert("Prescription added successfully!");
      setForm({ medicineName: "", dosage: "", timing: "", instructions: "" });
      setAlreadyExists(true);
      setErrorMsg("Prescription already exists for this medical record.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add prescription.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center mt-4">
        <div className="w-100" style={{ maxWidth: "700px", backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h2 className="mb-4 text-center">Add Prescription</h2>
          {errorMsg && <div className="alert alert-danger text-center mb-3">{errorMsg}</div>}
          {!recordId || alreadyExists ? null : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input className="form-control" name="medicineName" placeholder="Medicine Name" value={form.medicineName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <input className="form-control" name="dosage" placeholder="Dosage (e.g. 500 mg)" value={form.dosage} onChange={handleChange} required />
                <small className="text-muted">Format: number + unit (e.g. 500 mg, 1 pill)</small>
              </div>
              <div className="mb-3">
                <input className="form-control" name="timing" placeholder="Timing (e.g. 0-0-1 AF)" value={form.timing} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <textarea className="form-control" name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Save Prescription</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
