import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    contactNumber: "",
    email: "",
    age: "",
    address: "",
    passwordPatient: ""
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(""); // clear previous messages
    setIsError(false);

    try {
      const response = await fetch("http://localhost:8080/api/patients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: parseInt(form.age)
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || "Registration failed. Please try again.");
        setIsError(true);
      } else {
        setMessage("Registration successful! login now");
        alert("Registration")
         navigate("/login");
        setIsError(false);
      }
    } catch (err) {
      setMessage(`Network error: ${err.message}`);
      setIsError(true);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Patient Registration</h2>
      <div className="card shadow-sm rounded-4 p-4 mx-auto bg-light" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="password" name="passwordPatient" placeholder="Password" value={form.passwordPatient} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <select name="gender" value={form.gender} onChange={handleChange} required className="form-select">
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>

          {message && (
            <div className={`alert ${isError ? "alert-danger" : "alert-success"} mt-3 text-center`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
