import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken, setRole, setPatientId, setDoctorId } from "../utils/auth";
import { FaEnvelope, FaLock, FaUserTag, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState("PATIENT");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  setErrorMsg("");
  let url = `http://localhost:8080/api/auth/${role.toLowerCase()}/login`;

  try {
    const res = await axios.post(url, { email, password });

    setToken(res.data.token);
    setRole(res.data.role);

    if (res.data.role === "PATIENT" && res.data.user?.patientId) {
      setPatientId(res.data.user.patientId);
      localStorage.setItem("patientName", res.data.user.name); 
      navigate("/patient/dashboard");
    } else if (res.data.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (res.data.role === "DOCTOR" && res.data.user?.doctorId) {
      setDoctorId(res.data.user.doctorId);
      localStorage.setItem("doctorName", res.data.user.name); 
      navigate("/doctor/dashboard");
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.response?.data || error.message;
    setErrorMsg(message);
  }
};

  return (
<div
  className="d-flex align-items-center justify-content-center vh-100"
  // style={{
  //   background: "linear-gradient(90deg, #9b7bbd, #a884c6, #c3a1db)",
  //   padding: "1rem",
  // }}
>
  <div
    className="card shadow-lg p-4"
    style={{
      maxWidth: "400px", 
      width: "100%",
      borderRadius: "12px",
    }}
  >
    <h2
      className="mb-3 text-center fw-bold"
      style={{ color: "#3e2f42", fontSize: "1.8rem" }}
    >
      Login
    </h2>

    {errorMsg && <div className="alert alert-danger py-1">{errorMsg}</div>}

    <div className="mb-3">
      <label className="form-label fw-semibold">Email</label>
      <div className="input-group input-group-sm">
        <span className="input-group-text"><FaEnvelope /></span>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label fw-semibold">Password</label>
      <div className="input-group input-group-sm">
        <span className="input-group-text"><FaLock /></span>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: showPassword ? "#9b7bbd" : "transparent",
            color: showPassword ? "#fff" : "#6c757d",
            border: `1px solid ${showPassword ? "#9b7bbd" : "#ced4da"}`,
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label fw-semibold">Role</label>
      <div className="input-group input-group-sm">
        <span className="input-group-text"><FaUserTag /></span>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRoleState(e.target.value)}
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
    </div>

    <div className="d-grid mt-3">
      <button
        className="btn btn-sm"
        style={{ backgroundColor: "#9b7bbd", color: "#fff" }}
        onClick={handleLogin}
      >
        Login
      </button>

      <div className="text-center mt-2">
        <span className="text-muted me-1">New user?</span>
        <button
          className="btn btn-link p-0"
          style={{ color: "#9b7bbd", textDecoration: "underline" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
