import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecommendedTests = () => {
  const token = localStorage.getItem("token");
  const appointmentId = localStorage.getItem("appointmentId");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentId) return;

    axios
      .get(`http://localhost:8080/api/recommend-tests/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTests(res.data))
      .catch((err) => console.error("Error fetching tests", err))
      .finally(() => setLoading(false));
  }, [appointmentId, token]);

  if (!appointmentId) return <p>No appointment selected.</p>;
  if (loading) return <p>Loading tests...</p>;

  const handleProceedToPay = () => {
    navigate("/payment", { state: { tests, appointmentId } });
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary">Recommended Tests</h4>
      {tests.length > 0 ? (
        <>
          <ul className="list-group mb-3">
            {tests.map((t) => (
              <li key={t.testId} className="list-group-item">
                <strong>{t.testName}</strong> <br />
                <small>{t.description}</small> <br />
                <span className="text-muted">
                  Prep: {t.preparationInstructions} | Duration: {t.duration} | Cost: ₹{t.cost}
                </span>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-success w-100 fw-bold"
            onClick={handleProceedToPay}
          >
            Proceed to Pay
          </button>
        </>
      ) : (
        <p>No tests available.</p>
      )}
    </div>
  );
};

export default RecommendedTests;
