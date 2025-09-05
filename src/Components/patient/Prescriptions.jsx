import { useState, useEffect } from "react";
import axios from "axios";

const Prescriptions = () => {
  const token = localStorage.getItem("token");
  const recordId = localStorage.getItem("recordId"); 
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recordId) return;

    axios
      .get(`http://localhost:8080/api/medical-records/${recordId}`, config)
      .then((res) => {
        setPrescription(res.data.prescription || null);
      })
      .catch((err) => console.error("Error fetching prescription", err))
      .finally(() => setLoading(false));
  }, [recordId]);

  if (loading) return <p>Loading prescription...</p>;

  return (
    <div
      className="card shadow-sm p-4"
      style={{
        backgroundColor: "#f8f4fa",
        border: "1px solid #e0cfe6",
        borderRadius: "12px",
      }}
    >
      <h5 className="fw-bold text-primary mb-3">My Prescription</h5>

      {prescription ? (
        <div className="prescription-details">
          <p><strong>Medicine:</strong> {prescription.medicineName}</p>
          <p><strong>Dosage:</strong> {prescription.dosage}</p>
          <p><strong>Timing:</strong> {prescription.timing}</p>
          <p><strong>Instructions:</strong> {prescription.instructions}</p>
        </div>
      ) : (
        <p>No prescription available</p>
      )}
    </div>
  );
};

export default Prescriptions;
