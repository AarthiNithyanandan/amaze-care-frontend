import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("doctorName");
    if (!localStorage.getItem("token") || !localStorage.getItem("doctorId")) {
      navigate("/login");
    } else {
      setDoctorName(name || "Doctor");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="sidebar bg-primary text-white p-4" style={{ width: "250px" }}>
        <h4 className="text-center fw-bold mb-4">AmazeCare</h4>
        <ul className="nav flex-column gap-2">
          <li><Link to="home" className="btn btn-light w-100 text-start">Dashboard</Link></li>
          <li><Link to="appointments" className="btn btn-outline-light w-100 text-start">My Appointments</Link></li>
          <li><Link to="records" className="btn btn-outline-light w-100 text-start">Medical Records</Link></li>
          <li><Link to="prescriptions" className="btn btn-outline-light w-100 text-start">Prescriptions</Link></li>
          <li><Link to="tests" className="btn btn-outline-light w-100 text-start">Recommended Tests</Link></li>
          <li><Link to="view-records" className="btn btn-outline-light w-100 text-start">View Records</Link></li>
          <li><button onClick={handleLogout} className="btn btn-danger w-100 text-start">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <header className="mb-4">
          <h3 className="fw-bold">Welcome, Dr. {doctorName}</h3>
          <span className="text-muted">{today}</span>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
