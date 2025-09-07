import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicalRecordByAppointment } from "../../services/PatientService";

const MyMedicalRecords = () => {
  const appointmentId = localStorage.getItem("appointmentId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientId = localStorage.getItem("patientId") || "N/A";
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState(null);

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const res = await getMedicalRecordByAppointment(appointmentId);
        setMedicalRecord(res.data);
      } catch (err) {
        console.error("Error fetching medical record", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [appointmentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!appointmentId) {
    return (
      <div className="text-center py-5 text-danger">
        <h5>No appointment selected.</h5>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/patient/dashboard/appointments")}
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e0cfe6",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
        style={{ borderColor: "#b38cb4", color: "#b38cb4", fontWeight: 500 }}
        onClick={() => navigate("/patient/dashboard/appointments")}
      >
        <i className="bi bi-arrow-left"></i> Back to Appointments
      </button>

      {medicalRecord ? (
        <div style={cardStyle}>
          <h5 className="fw-bold text-primary mb-3">Medical Record</h5>
          <p><strong>Patient:</strong> {patientName} (ID: {patientId})</p>
          <p><strong>Doctor:</strong> Dr. {doctorName}</p>
          <div className="row mb-2">
            <div className="col-md-6">
              <strong>Record ID:</strong> {medicalRecord.recordId}
            </div>
            <div className="col-md-6">
              <strong>Date:</strong> {formatDate(medicalRecord.recordDate)}
            </div>
          </div>
          <p><strong>Diagnosis:</strong> {medicalRecord.diagnosis}</p>
          <p><strong>Notes:</strong> {medicalRecord.notes}</p>
        </div>
      ) : (
        <p className="text-center text-muted">No medical record available.</p>
      )}
    </div>
  );
};

export default MyMedicalRecords;
