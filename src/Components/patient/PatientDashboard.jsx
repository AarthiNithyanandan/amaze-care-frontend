import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import axios from "axios";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications only for dashboard home
  useEffect(() => {
    if (location.pathname === "/patient/home") {
      axios
        .get("http://localhost:8080/api/patients/appointments/notifications")
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const showTopNotifications = location.pathname === "/patient/home";

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div
        className={`sidebar text-white p-4 ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <h4 className="text-center fw-bold mb-4">EliteCare</h4>
        <ul className="nav flex-column gap-2">
          <li><Link to="home" className="btn btn-light w-100 text-start">Dashboard</Link></li>
          <li><Link to="appointments" className="btn btn-outline-light w-100 text-start">My Appointments</Link></li>
          <li><Link to="prescriptions" className="btn btn-outline-light w-100 text-start">Prescriptions</Link></li>
          <li><Link to="tests" className="btn btn-outline-light w-100 text-start">Recommended Tests</Link></li>
          <li><Link to="records" className="btn btn-outline-light w-100 text-start">Medical Records</Link></li>
          <li><Link to="doctors" className="btn btn-outline-light w-100 text-start">Find a Doctor</Link></li>
          <li><Link to="book" className="btn btn-outline-light w-100 text-start">Book Appointment</Link></li>
          <li><button onClick={handleLogout} className="btn btn-danger w-100 text-start">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>

          {showTopNotifications && (
            <div className="position-relative">
              <button
                className="btn btn-outline-secondary position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-panel shadow-sm bg-white p-3">
                  <h6 className="fw-bold">Notifications</h6>
                  <ul className="list-unstyled mb-0">
                    {notifications.length > 0 ? (
                      notifications.map((n, idx) => (
                        <li key={idx} className="border-bottom py-2">
                          {n.message}
                          <br />
                          <small className="text-muted">{n.date}</small>
                        </li>
                      ))
                    ) : (
                      <li>No new notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default PatientDashboard;
