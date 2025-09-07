import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Payments= () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tests, appointmentId } = location.state || {};
  const totalCost = tests?.reduce((sum, t) => sum + (t.cost || 0), 0) || 0;

  const [paid, setPaid] = useState(false);

  if (!tests || tests.length === 0) {
    return <p>No tests selected for payment.</p>;
  }

  const handlePayment = () => {
    setPaid(true); 
  };

  return (
    <div className="container py-4" style={{ maxWidth: "600px", margin: "auto" }}>
      <h3 className="mb-3">Payment Summary</h3>

      <ul className="list-group mb-3">
        {tests.map((t) => (
          <li className="list-group-item d-flex justify-content-between" key={t.testId}>
            <span>{t.testName}</span>
            <span>₹{t.cost}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₹{totalCost}</span>
        </li>
      </ul>

      {paid ? (
        <div className="alert alert-success text-center">
          Payment Successful! ✅
        </div>
      ) : (
        <button
          className="btn btn-success w-100"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      )}

      <button
        className="btn btn-outline-secondary w-100 mt-2"
        onClick={() => navigate("/patient/dashboard/appointments")}
      >
        Back to Appointments
      </button>
    </div>
  );
};

export default Payments;
