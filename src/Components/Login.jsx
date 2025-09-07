import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken, setRole, setPatientId, setDoctorId } from "../utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState("PATIENT");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg("");
    const url = `http://localhost:8080/api/auth/${role.toLowerCase()}/login`;

    try {
      const res = await axios.post(url, { email, password });
      setToken(res.data.token);
      setRole(res.data.role);

      if (res.data.role === "PATIENT" && res.data.user?.patientId) {
        setPatientId(res.data.user.patientId);
        localStorage.setItem("patientName", res.data.user.name);
        navigate("/patient/dashboard");
      } else if (res.data.role === "DOCTOR" && res.data.user?.doctorId) {
        setDoctorId(res.data.user.doctorId);
        localStorage.setItem("doctorName", res.data.user.name);
        navigate("/doctor/dashboard");
      } else if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="p-4"
        style={{ minWidth: "350px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Password with eye */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
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
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">Role</label>
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

        {/* Submit */}
        <button
          type="submit"
          className="btn w-100 mb-2"
          style={{ backgroundColor: "#9b7bbd", color: "#fff" }}
        >
          Login
        </button>

        <div className="text-center">
          <span>New user? </span>
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </form>
    </div>
  );
}
