import { useEffect, useState } from "react";
import { getPatientAppointmentCounts } from "../../services/PatientService";

const DashboardHome = () => {
  const patientId = localStorage.getItem("patientId");
  const patientName = localStorage.getItem("patientName") || "Patient";

  const [counts, setCounts] = useState({
    upcoming: 0,
    prescriptions: 0,
    pendingRecords: 0,
  });
  const [tipIndex, setTipIndex] = useState(0);

  const healthTips = [
    "Stay hydrated aim for 8 glasses today",
    "Take a 10-minute walk to boost circulation.",
    "Remember to take deep breaths as it reduces stress.",
    "Eat something green today spinach, broccoli, or peas.",
    "Sleep well your body heals best during rest."
  ];

  useEffect(() => {
    if (patientId) {
      getPatientAppointmentCounts(patientId)
        .then((res) => {
          const data = res.data || {};
          setCounts({
            upcoming: data.completedAppointments || 0,
            prescriptions: data.withPrescription || 0,
            pendingRecords: (data.totalAppointments || 0) - (data.withMedicalRecord || 0)
          });
        })
        .catch((err) => console.error("Error fetching appointment counts", err));
    }

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(tipTimer);
  }, [patientId]);

  const summaryCards = [
    { title: "Upcoming Appointments", value: counts.upcoming, color: "#b28dff" },
    { title: "Prescriptions", value: counts.prescriptions, color: "#6cc3d5" },
    { title: "Pending Records", value: counts.pendingRecords, color: "#f4b860" }
  ];

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: "#5a2d7f" }}>
          Welcome, {patientName}
        </h3>
        <p className="text-muted">{healthTips[tipIndex]}</p>
      </div>

      <div className="row g-4 mb-4">
        {summaryCards.map((card, idx) => (
          <div className="col-md-4" key={idx}>
            <div
              className="card text-center shadow-sm rounded-4 p-4"
              style={{
                backgroundColor: "#fdf9ff",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <h6 className="text-muted">{card.title}</h6>
              <h3 className="fw-bold" style={{ color: card.color }}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card rounded-4 p-4 mb-5">
        <h5 className="fw-bold" style={{ color: "#5a2d7f" }}>Follow</h5>
        <ul className="list-unstyled text-muted fs-6 mt-3">
          <li>You have {counts.upcoming} upcoming appointments.</li>
          <li>{counts.prescriptions > 0 ? `${counts.prescriptions} active prescriptions.` : "No pending prescriptions — you're on track!"}</li>
          <li>{counts.pendingRecords > 0 ? `${counts.pendingRecords} records pending.` : "Medical records are up to date."}</li>
          <li>Tip: {healthTips[tipIndex]}</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
