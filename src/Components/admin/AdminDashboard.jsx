import { useNavigate, NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getRole, removeToken, removeRole } from "../../utils/auth";
import { FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt, FaHome } from "react-icons/fa";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const role = getRole();

  const logout = () => {
    removeToken();
    removeRole();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link text-purple fw-bold bg-white rounded mb-2 d-flex align-items-center justify-content-start"
      : "nav-link text-white mb-2 d-flex align-items-center justify-content-start";

  return (
    <div
      className="admin-dashboard d-flex"
      style={{ paddingTop: "50px", minHeight: "100vh" }} 
    >
 
      <div
        className="sidebar d-flex flex-column p-4"
        style={{
          backgroundColor: "#a963ffff",
          width: "250px",
          position: "fixed",
          top: "50px", 
          bottom: 0,
        }}
      >
        <div className="d-flex flex-column align-items-center flex-grow-1 justify-content-center">
       
          <ul className="nav nav-pills flex-column mb-auto w-100">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/admin/dashboard">
                <FaHome className="me-2" /> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/admin/dashboard/doctors">
                <FaUserMd className="me-2" /> Doctors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/admin/dashboard/patients">
                <FaUsers className="me-2" /> Patients
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/admin/dashboard/appointments">
                <FaCalendarAlt className="me-2" /> Appointments
              </NavLink>
            </li>
          </ul>
        </div>

        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center mt-4"
          onClick={logout}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>

      <div
        className="main-content flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", marginLeft: "250px" }}
      >
        
        <nav className="navbar navbar-light bg-white shadow-sm mb-4 rounded p-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="fw-bold mb-0">Admin Dashboard</h5>
            <span className="fw-bold text-primary">Role: {role}</span>
          </div>
        </nav>

       
        <div className="content-area bg-white rounded p-4 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
