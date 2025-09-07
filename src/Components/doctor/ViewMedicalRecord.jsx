import React, { useEffect, useState } from "react";
import {
  getMedicalRecordByAppointment,
  getRecommendedTestsByAppointment,
  updateRecommendedTest,
  updatePrescription,
} from "../../services/DoctorService";
import axios from "axios";
import { FaNotesMedical, FaPrescriptionBottleAlt, FaVials } from "react-icons/fa";

export default function ViewMedicalRecord() {
  const appointmentId = localStorage.getItem("appointmentId");
  const doctorId = localStorage.getItem("doctorId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientId = localStorage.getItem("patientId") || "N/A";
  const doctorName = localStorage.getItem("doctorName") || "Doctor Name";
  const token = localStorage.getItem("token");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [recommendedTests, setRecommendedTests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("record");

  const [editingPrescription, setEditingPrescription] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineName: "",
    dosage: "",
    timing: "",
    instructions: "",
  });

  useEffect(() => {
    if (!appointmentId) {
      setErrorMsg("Select an appointment first!");
      return;
    }

    const fetchData = async () => {
      try {

        const resRecord = await getMedicalRecordByAppointment(appointmentId);
        setMedicalRecord(resRecord.data);

        const recordId = resRecord.data.recordId;
        const resPrescription = await axios.get(
          `http://localhost:8080/api/prescriptions/medical-record/${recordId}`,
          config
        );
        setPrescription(resPrescription.data || null);

        const resTests = await getRecommendedTestsByAppointment(appointmentId);
        setRecommendedTests(Array.isArray(resTests.data) ? resTests.data : []);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || "Failed to load data");
      }
    };

    fetchData();
  }, [appointmentId]);

 
  const startPrescriptionEdit = () => {
    if (!prescription) return;
    setPrescriptionForm({ ...prescription });
    setEditingPrescription(true);
  };

  const handlePrescriptionChange = (e) => {
    setPrescriptionForm({ ...prescriptionForm, [e.target.name]: e.target.value });
  };

  const handlePrescriptionUpdate = async (e) => {
    e.preventDefault();
    if (!prescription) return;
    try {
      const payload = {
        prescriptionId: prescription.prescriptionId,
        recordId: medicalRecord.recordId,
        doctorId: parseInt(doctorId),
        ...prescriptionForm,
      };
      const res = await updatePrescription(prescription.prescriptionId, payload);
      setPrescription(res.data);
      setEditingPrescription(false);
    } catch {
      alert("Failed to update prescription.");
    }
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  if (errorMsg) return <div className="alert alert-danger">{errorMsg}</div>;
  if (!medicalRecord) return <p>Loading medical record...</p>;

  return (
    <div className="container-fluid mt-4">

      <div className="mb-4 text-center">
        <h4 className="fw-bold" style={{ color: "#5a2d7f" }}>Medical Record View</h4>
        <p><strong>Patient:</strong> {patientName} (ID: {patientId})</p>
        <p><strong>Doctor:</strong> Dr. {doctorName}</p>
        <p className="text-muted"><small>Appointment ID: {appointmentId}</small></p>
      </div>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "record" ? "active" : ""}`}
            onClick={() => setActiveTab("record")}
          >
            <FaNotesMedical className="me-2" /> Medical Record
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "prescription" ? "active" : ""}`}
            onClick={() => setActiveTab("prescription")}
          >
            <FaPrescriptionBottleAlt className="me-2" /> Prescription
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            <FaVials className="me-2" /> Recommended Tests
          </button>
        </li>
      </ul>

      {activeTab === "record" && (
        <div className="card p-4 mb-3 w-100">
          <p><strong>Diagnosis:</strong> {medicalRecord.diagnosis}</p>
          <p><strong>Notes:</strong> {medicalRecord.notes}</p>
          <p><strong>Record Date:</strong> {formatDate(medicalRecord.recordDate)}</p>
        </div>
      )}

      {activeTab === "prescription" && (
        <div className="card p-4 mb-3 w-100">
          {prescription ? (
            editingPrescription ? (
              <form onSubmit={handlePrescriptionUpdate}>
                {["medicineName", "dosage", "timing", "instructions"].map((field) => (
                  <div className="mb-2" key={field}>
                    <input
                      className="form-control"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={prescriptionForm[field]}
                      onChange={handlePrescriptionChange}
                      required={field !== "instructions"}
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-success me-2">Update</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPrescription(false)}>Cancel</button>
              </form>
            ) : (
              <>
                <table className="table table-bordered">
                  <thead style={{ backgroundColor: "#fdf9ff" }}>
                    <tr>
                      <th>S.No</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Timing</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{prescription.medicineName}</td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.timing}</td>
                      <td>{prescription.instructions}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 text-end">
                  <em>Digitally signed by Dr. {doctorName}</em><br />
                  <small className="text-muted">Contact: +91-{Math.floor(6000000000 + Math.random() * 3999999999)}</small>
                </div>
                <button className="btn btn-primary btn-sm mt-3" onClick={startPrescriptionEdit}>
                  Edit Prescription
                </button>
              </>
            )
          ) : (
            <p>No prescription added yet.</p>
          )}
        </div>
      )}

      {activeTab === "tests" && (
        <div className="card p-4 mb-3 w-100">
          {recommendedTests.length > 0 ? (
            <table className="table table-bordered">
              <thead style={{ backgroundColor: "#fdf9ff" }}>
                <tr>
                  <th>S.No</th>
                  <th>Test Name</th>
                  <th>Preparation</th>
                  <th>Duration</th>
                  <th>Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {recommendedTests.map((t, idx) => (
                  <tr key={t.testId}>
                    <td>{idx + 1}</td>
                    <td>{t.testName}</td>
                    <td>{t.preparationInstructions}</td>
                    <td>{t.duration}</td>
                    <td>{t.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recommended tests yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
