import { Outlet, useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { path: "home", label: "Dashboard" },
    { path: "appointments", label: "My Appointments" },
    { path: "prescriptions", label: "Prescriptions" },
    { path: "tests", label: "Recommended Tests" },
    { path: "records", label: "Medical Records" },
    { path: "doctors", label: "Find a Doctor" },
    { path: "book", label: "Book Appointment" },
    
  ];

  return (
<div className="d-flex" style={{ minHeight: "100vh" }}>
 
  <div
    className="sidebar sidebar-open"
    style={{ paddingTop: "70px" }} 
  >
    <ul className="nav flex-column mb-auto" style={{ gap: "0.5rem" }}>
      {menuItems.map((item) => (
        <li key={item.path}>
          <button
            onClick={() => navigate(item.path)}
            className="btn btn-outline-light w-100"
          >
            {item.label}
          </button>
        </li>
      ))}
      <li>
        <button onClick={handleLogout} className="btn btn-danger w-100 mt-auto">
          Logout
        </button>
      </li>
    </ul>
  </div>

  <div
    className="flex-grow-1 p-3 d-flex flex-column"
    style={{ marginTop: "60px" }} 
  >
    <div className="flex-grow-1">
      <Outlet />
    </div>
  </div>
</div>
  )
}
export default PatientDashboard;
