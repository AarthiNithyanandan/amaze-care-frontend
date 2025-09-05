import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MedicalRecords = () => {
  const token = localStorage.getItem("token");
  const recordId = localStorage.getItem("recordId");
  const appointmentId = localStorage.getItem("appointmentId");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("record");
  const [loading, setLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!recordId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/medical-records/${recordId}`, config)
      .then((res) => {
        setMedicalRecord(res.data);
        setPrescription(res.data.prescription || null);
      })
      .catch((err) => console.error("Error fetching medical record", err))
      .finally(() => setLoading(false));
  }, [recordId]);

  useEffect(() => {
    if (!appointmentId) return;
    axios
      .get(`http://localhost:8080/api/recommend-tests/appointment/${appointmentId}`, config)
      .then((res) => setTests(res.data))
      .catch((err) => console.error("Error fetching tests", err));
  }, [appointmentId]);

  const handleProceedToPay = () => {
    navigate("/payment", { state: { tests, appointmentId } });
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
        style={{ borderColor: "#b38cb4", color: "#b38cb4", fontWeight: 500 }}
        onClick={() => navigate("/patient/dashboard/appointments")}
      >
        <i className="bi bi-arrow-left"></i> Back to Appointments
      </button>

      {/* Justified Tabs */}
      <ul className="nav nav-tabs nav-justified mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "record" ? "active" : ""}`}
            onClick={() => setActiveTab("record")}
          >
            Medical Record
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "prescription" ? "active" : ""}`}
            onClick={() => setActiveTab("prescription")}
          >
            Prescription
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            Recommended Tests
          </button>
        </li>
      </ul>

      {/* Card */}
      <div
        className="card shadow-sm p-4 mx-auto"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e0cfe6",
          borderRadius: "12px",
          maxWidth: "900px",
        }}
      >
        {/* Medical Record */}
        {activeTab === "record" && medicalRecord && (
          <>
            <h5 className="fw-bold text-primary mb-3">Medical Record</h5>
            <div className="row mb-2">
              <div className="col-md-6"><strong>Record ID:</strong> {medicalRecord.recordId}</div>
              <div className="col-md-6"><strong>Date:</strong> {medicalRecord.recordDate}</div>
            </div>
            <div className="mb-2"><strong>Diagnosis:</strong> {medicalRecord.diagnosis}</div>
            <div className="mb-2"><strong>Notes:</strong> {medicalRecord.notes}</div>
          </>
        )}

        {/* Prescription */}
        {activeTab === "prescription" && (
          <>
            <h5 className="fw-bold text-primary mb-3">My Prescription</h5>
            {prescription ? (
              <ul className="list-group">
                {[
                  { label: "Medicine", value: prescription.medicineName },
                  { label: "Dosage", value: prescription.dosage },
                  { label: "Timing", value: prescription.timing },
                  { label: "Instructions", value: prescription.instructions },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="list-group-item"
                    style={{ borderLeft: "4px solid #b38cb4" }}
                  >
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No prescription available</p>
            )}
          </>
        )}

        {/* Recommended Tests */}
        {activeTab === "tests" && (
          <>
            <h5 className="fw-bold text-primary mb-3">Recommended Tests</h5>
            {tests.length > 0 ? (
              <>
                <ul className="list-group mb-3">
                  {tests.map((t) => (
                    <li key={t.testId} className="list-group-item">
                      <strong>{t.testName}</strong>
                      <p className="mb-1"><small>{t.description}</small></p>
                      <p className="mb-0 text-muted">
                        Prep: {t.preparationInstructions} | Duration: {t.duration} | Cost: ₹{t.cost}
                      </p>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-success w-100 fw-bold" onClick={handleProceedToPay}>
                  Proceed to Pay
                </button>
              </>
            ) : (
              <p>No tests available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
