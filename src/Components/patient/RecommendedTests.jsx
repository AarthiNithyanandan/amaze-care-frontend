import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaVials, FaArrowLeft } from "react-icons/fa";
import { getRecommendedTestsByAppointment } from "../../services/PatientService";

const RecommendedTests = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const appointmentId = localStorage.getItem("appointmentId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientId = localStorage.getItem("patientId") || "N/A";
  const doctorName = localStorage.getItem("doctorName") || "Doctor Name";

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await getRecommendedTestsByAppointment(appointmentId);
        setTests(res.data || []);
      } catch (err) {
        console.error("Error fetching tests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [appointmentId]);

  const handleProceedToPay = () => {
    navigate("/patient/dashboard/payments", { state: { tests, appointmentId } });
  };

  const handleBack = () => {
    navigate("/patient/dashboard/appointments"); // fixed back path
  };

  const totalCost = tests.reduce((sum, t) => sum + (t.cost || 0), 0);

  if (!appointmentId) return <p className="text-center py-5 text-danger">No appointment selected.</p>;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          <FaArrowLeft className="me-1" /> Back to Appointments
        </button>
      </div>

      <div className="mb-4 text-center">
        <h4 className="fw-bold" style={{ color: "#5a2d7f" }}>
          <FaVials className="me-2" />
          Recommended Tests
        </h4>
        <p className="mb-1"><strong>Patient:</strong> {patientName} (ID: {patientId})</p>
        <p className="mb-1"><strong>Doctor:</strong> Dr. {doctorName}</p>
        <p className="text-muted"><small>Appointment ID: {appointmentId}</small></p>
      </div>

      {tests.length > 0 ? (
        <div className="card shadow-sm p-4" style={{ borderRadius: "12px" }}>
          <table className="table table-bordered">
            <thead style={{ backgroundColor: "#fdf9ff" }}>
              <tr>
                <th style={{ width: "60px" }}>S.No</th>
                <th>Test Name</th>
                <th>Preparation</th>
                <th>Duration</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, idx) => (
                <tr key={t.testId}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{t.testName}</strong>
                    <br />
                    <small className="text-muted">{t.description}</small>
                  </td>
                  <td>{t.preparationInstructions}</td>
                  <td>{t.duration}</td>
                  <td>{t.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between fw-bold mt-3">
            <span>Total Tests: {tests.length}</span>
            <span>Total Cost: ₹{totalCost}</span>
          </div>

          <button
            className="btn w-100 fw-bold mt-3"
            style={{ backgroundColor: "#6f42c1", color: "#fff" }}
            onClick={handleProceedToPay}
          >
            Proceed to Pay
          </button>
        </div>
      ) : (
        <p className="text-center text-muted">No tests available.</p>
      )}
    </div>
  );
};

export default RecommendedTests;
