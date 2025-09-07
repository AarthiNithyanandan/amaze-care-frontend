import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPrescriptionByMedicalRecord } from "../../services/PatientService";

const MyPrescriptions = () => {
  const navigate = useNavigate();
  const recordId = localStorage.getItem("recordId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientId = localStorage.getItem("patientId") || "N/A";
  const doctorName = localStorage.getItem("doctorName") || "Doctor Name";

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  const randomContact = `+91-${Math.floor(6000000000 + Math.random() * 3999999999)}`;

  useEffect(() => {
    if (!recordId) {
      setLoading(false);
      return;
    }

    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const res = await getPrescriptionByMedicalRecord(recordId);
        setPrescription(res.data || null);
      } catch (err) {
        console.error("Error fetching prescription", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [recordId]);

  const handleDownload = () => {
    if (!prescription) return;

    const text = `
AmazeCare Hospital
Doctor: Dr. ${doctorName}
Patient: ${patientName} (ID: ${patientId})
Prescription ID: ${prescription.prescriptionId}

S.No  Medicine           Dosage       Timing                Instructions
1     ${prescription.medicineName}   ${prescription.dosage}   ${prescription.timing}   ${prescription.instructions}

Signed,
Dr. ${doctorName}
Contact: ${randomContact}
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Prescription_${prescription.prescriptionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>

      <div
        className="card shadow-sm p-4 mx-auto"
        style={{
          maxWidth: "750px",
          backgroundColor: "#fff",
          border: "1px solid #e0cfe6",
          borderRadius: "12px",
        }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#5a2d7f" }}>AmazeCare Hospital</h3>
          <p className="mb-1">Dr. {doctorName}</p>
          <hr />
          <p>
            <strong>Patient:</strong> {patientName} (ID: {patientId})<br />
            <strong>Prescription ID:</strong> {prescription?.prescriptionId || "N/A"}
          </p>
        </div>

        {prescription ? (
          <table className="table table-bordered">
            <thead style={{ backgroundColor: "#fdf9ff" }}>
              <tr>
                <th style={{ width: "60px" }}>S.No</th>
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
        ) : (
          <p className="text-center text-muted">No prescription available</p>
        )}

        <div className="mt-4 text-end">
          <p className="mb-0"><em>Digitally signed by Dr. {doctorName}</em></p>
          <small className="text-muted">Contact: {randomContact}</small>
        </div>

        {prescription && (
          <div className="text-center mt-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#6f42c1",
                color: "#fff",
                fontWeight: "500",
                borderRadius: "6px",
                padding: "0.5rem 1.5rem"
              }}
              onClick={handleDownload}
            >
              Download Prescription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;
