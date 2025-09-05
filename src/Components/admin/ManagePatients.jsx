
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/admin";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [updatePatientForm, setUpdatePatientForm] = useState({
    patientId: "", name: "", gender: "", contactNumber: "",
    email: "", age: "", address: "", passwordPatient: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => { loadPatients(); }, []);

  const handleError = (err) => {
    if (err.response) {
      const data = err.response.data;
      setErrorMsg(typeof data === "object" ? Object.values(data).join(", ") : data);
    } else setErrorMsg(err.message);
  };

  const loadPatients = async () => {
    try {
      const res = await axios.get(`${API}/patients`, getAuthHeaders());
      setPatients(res.data);
    } catch (err) { console.error(err); }
  };

  const updatePatient = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.put(`${API}/patients`, updatePatientForm, getAuthHeaders());
      setSuccessMsg("Patient updated successfully!");
      loadPatients();
    } catch (err) { handleError(err); }
  };

  const deletePatient = async (id) => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await axios.delete(`${API}/patients/${id}`, getAuthHeaders());
      setSuccessMsg("Patient deleted successfully!");
      loadPatients();
    } catch (err) { handleError(err); }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-secondary mb-4">Manage Patients</h3>

      {successMsg && <div className="alert alert-success rounded-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger rounded-4">{errorMsg}</div>}

      <div className="card shadow-lg rounded-4 p-4 mb-5" style={{ border: "none" }}>
        <h5 className="fw-bold text-primary mb-3">Update Patient</h5>
        <div className="row g-3">
          {Object.keys(updatePatientForm).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={updatePatientForm[field]}
                onChange={(e) => setUpdatePatientForm({ ...updatePatientForm, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-warning mt-3 w-100 rounded-4" onClick={updatePatient}>
          Update Patient
        </button>
      </div>

      <div className="card shadow-lg rounded-4 p-3" style={{ border: "none" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p.patientId}>
                    <td>{p.patientId}</td>
                    <td className="fw-semibold">{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.contactNumber}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm rounded-3"
                        onClick={() => deletePatient(p.patientId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No patients found
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
