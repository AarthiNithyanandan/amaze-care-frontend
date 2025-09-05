import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/admin";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "", speciality: "", experience: "", qualification: "",
    designation: "", email: "", passwordDoctor: "", contactNumber: ""
  });
  const [updateDoctorForm, setUpdateDoctorForm] = useState({
    doctorId: "", name: "", speciality: "", experience: "",
    qualification: "", designation: "", email: "", passwordDoctor: "", contactNumber: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => { loadDoctors(); }, []);

  const handleError = (err) => {
    if (err.response) {
      const data = err.response.data;
      setErrorMsg(typeof data === "object" ? Object.values(data).join(", ") : data);
    } else setErrorMsg(err.message);
  };

  const loadDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctors`, getAuthHeaders());
      setDoctors(res.data);
    } catch (err) { console.error(err); }
  };

  const addDoctor = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.post(`${API}/doctors`, newDoctor, getAuthHeaders());
      setSuccessMsg("Doctor added successfully!");
      loadDoctors();
      setNewDoctor({ name: "", speciality: "", experience: "", qualification: "", designation: "", email: "", passwordDoctor: "", contactNumber: "" });
    } catch (err) { handleError(err); }
  };

  const updateDoctor = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.put(`${API}/doctors`, updateDoctorForm, getAuthHeaders());
      setSuccessMsg("Doctor updated successfully!");
      loadDoctors();
    } catch (err) { handleError(err); }
  };

  const deleteDoctor = async (id) => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.delete(`${API}/doctors/${id}`, getAuthHeaders());
      setSuccessMsg("Doctor deleted successfully!");
      loadDoctors();
    } catch (err) { handleError(err); }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-secondary mb-4">Manage Doctors</h3>

      {successMsg && <div className="alert alert-success rounded-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger rounded-4">{errorMsg}</div>}

      <div className="card shadow-lg rounded-4 p-4 mb-4" style={{ border: "none" }}>
        <h5 className="fw-bold text-primary mb-3">Add Doctor</h5>
        <div className="row g-3">
          {Object.keys(newDoctor).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={newDoctor[field]}
                onChange={(e) => setNewDoctor({ ...newDoctor, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-success mt-3 w-100 rounded-4" onClick={addDoctor}>
          Add Doctor
        </button>
      </div>

 
      <div className="card shadow-lg rounded-4 p-4 mb-4" style={{ border: "none" }}>
        <h5 className="fw-bold text-primary mb-3">Update Doctor</h5>
        <div className="row g-3">
          {Object.keys(updateDoctorForm).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={updateDoctorForm[field]}
                onChange={(e) => setUpdateDoctorForm({ ...updateDoctorForm, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-warning mt-3 w-100 rounded-4" onClick={updateDoctor}>
          Update Doctor
        </button>
      </div>

      <div className="card shadow-lg rounded-4 p-3" style={{ border: "none" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Speciality</th>
                <th>Experience</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((d) => (
                  <tr key={d.doctorId}>
                    <td>{d.doctorId}</td>
                    <td className="fw-semibold">{d.name}</td>
                    <td>{d.speciality}</td>
                    <td>{d.experience}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm rounded-3"
                        onClick={() => deleteDoctor(d.doctorId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
