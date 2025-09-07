import React, { useState, useEffect } from "react";
import { getPrescriptionByMedicalRecord, addPrescription } from "../../services/DoctorService";
import { getDoctorId, getRecordId } from "../../utils/auth";

export default function AddPrescriptions() {
  const doctorId = getDoctorId();
  const recordId = getRecordId();

  const [form, setForm] = useState({ medicineName: "", dosage: "", timing: "", instructions: "" });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    if (!recordId) {
      setErrorMsg("Please add a medical record first!");
      return;
    }

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
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.medicineName.trim()) newErrors.medicineName = "Medicine Name is required.";
    if (!form.dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!form.timing.trim()) newErrors.timing = "Timing is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!recordId) return setErrorMsg("Medical record is missing.");
    if (alreadyExists) return setErrorMsg("Prescription already exists. Cannot add another.");

    try {
      const payload = { ...form, doctorId: parseInt(doctorId), recordId: parseInt(recordId) };
      await addPrescription(payload);
      setSuccessMsg("Prescription added successfully!");
      setForm({ medicineName: "", dosage: "", timing: "", instructions: "" });
      setAlreadyExists(true);
      setErrorMsg("Prescription already exists for this medical record.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add prescription.");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h3 className="fw-bold text-center mb-4" style={{ color: "#6f42c1" }}>Add Prescription</h3>

      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="medicineName"
            className={`form-control ${errors.medicineName ? "is-invalid" : ""}`}
            placeholder="Medicine Name"
            value={form.medicineName}
            onChange={handleChange}
            disabled={alreadyExists || !recordId}
          />
          {errors.medicineName && <div className="invalid-feedback">{errors.medicineName}</div>}
        </div>

        <div className="mb-3">
          <input
            name="dosage"
            className={`form-control ${errors.dosage ? "is-invalid" : ""}`}
            placeholder="Dosage (e.g. 500 mg)"
            value={form.dosage}
            onChange={handleChange}
            disabled={alreadyExists || !recordId}
          />
          {errors.dosage && <div className="invalid-feedback">{errors.dosage}</div>}
        </div>

        <div className="mb-3">
          <input
            name="timing"
            className={`form-control ${errors.timing ? "is-invalid" : ""}`}
            placeholder="Timing (e.g. 0-0-1 AF)"
            value={form.timing}
            onChange={handleChange}
            disabled={alreadyExists || !recordId}
          />
          {errors.timing && <div className="invalid-feedback">{errors.timing}</div>}
        </div>

        <div className="mb-3">
          <textarea
            name="instructions"
            className="form-control"
            placeholder="Instructions"
            value={form.instructions}
            onChange={handleChange}
            disabled={alreadyExists || !recordId}
          />
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{ backgroundColor: "#6f42c1", color: "#fff" }}
          disabled={alreadyExists || !recordId}
        >
          Save Prescription
        </button>
      </form>
    </div>
  );
}
