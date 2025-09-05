import { useEffect, useState } from "react";
import axios from "axios";

const DashboardHome = () => {
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patientId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [appointments, setAppointments] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);

  const healthTips = [
    "Stay hydrated — aim for 8 glasses today!",
    "Take a 10-minute walk to boost circulation.",
    "Remember to take deep breaths — it reduces stress.",
    "Eat something green today — spinach, broccoli, or peas.",
    "Sleep well — your body heals best during rest."
  ];

  useEffect(() => {
    axios.get(`/api/appointments/patient/${patientId}`, config)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments", err));

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(tipTimer);
  }, []);

  const summaryCards = [
    {
      title: "Upcoming Appointments",
      value: appointments.length,
      color: "#b28dff"
      
    },
    {
      title: "Prescriptions",
      value: "--",
      color: "#6cc3d5"
      
    },
    {
      title: "Pending Records",
      value: "--",
      color: "#f4b860"
     
    }
  ];

  return (
    <div className="container fluid">
   
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-primary">Welcome, {patientName}</h3>
          <p className="text-muted">{healthTips[tipIndex]}</p>
        </div>
        <img src="/profile.jpg" alt="Profile" className="rounded-circle" width="60" />
      </div>

   
      <div className="row g-4 mb-4">
        {summaryCards.map((card, idx) => (
          <div className="col-md-4" key={idx}>
            <div
              className="card text-center shadow-sm rounded-4 p-4"
              style={{
                backgroundColor: "#f3e8ff",
                borderLeft: `6px solid ${card.color}`,
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}
            >
              <h6 className="text-muted">{card.icon} {card.title}</h6>
              <h3 className="fw-bold" style={{ color: card.color }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>


      <div className="card shadow-sm rounded-4 p-4 mb-5" style={{ backgroundColor: "#f3e8ff" }}>
        <h5 className="fw-bold text-primary mb-3"> Wellness Overview</h5>
        <ul className="list-unstyled text-muted fs-6">
          <li> You have {appointments.length} upcoming appointments.</li>
          <li> No pending prescriptions — you're on track!</li>
          <li> Medical records are up to date.</li>
          <li> Tip: {healthTips[tipIndex]}</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
