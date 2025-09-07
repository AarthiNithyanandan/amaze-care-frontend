import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRole, clearAuth } from "../utils/auth";

export default function NavBar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getRole());
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };
   const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(90deg, #9b7bbd, #a884c6, #c3a1db)", 
    color: "#2e1f33",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    zIndex: 1000,
  };

  const brandStyle = {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
    letterSpacing: "1px",
  };

  const linkStyle = {
    color: "#fff",
    fontWeight: 500,
    padding: "0.5rem 1rem",
    textDecoration: "none",
    transition: "all 0.25s ease",
    borderRadius: "0.3rem",
  };

  const linkHover = (e) => {
    e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
    e.target.style.transform = "scale(1.05)";
  };

  const linkUnhover = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.transform = "scale(1)";
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={brandStyle}>
        AmazeCare
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link to="/doctors" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkUnhover}>
        Our doctors
        </Link>
      
        <Link to="/login" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkUnhover}>
          Book Appointment
        </Link>

        {!role && (
          <>
            <Link to="/register" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkUnhover}>
              Register
            </Link>
            <Link to="/login" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkUnhover}>
              Login
            </Link>
          </>
        )}

        {role && (
          <button
            style={{
              ...linkStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
            onMouseEnter={linkHover}
            onMouseLeave={linkUnhover}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
