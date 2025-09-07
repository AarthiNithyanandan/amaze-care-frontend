import React, { useState, useEffect } from "react";
import {
  fetchDoctors,
  addDoctorAPI,
  updateDoctorAPI,
  deleteDoctorAPI
} from "../../services/AdminService";

const setDoctorImage = (doctorId, file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const storedImages = JSON.parse(localStorage.getItem("doctorImages") || "{}");
    storedImages[doctorId] = reader.result;
    localStorage.setItem("doctorImages", JSON.stringify(storedImages));
  };
  reader.readAsDataURL(file);
};

const getDoctorImage = (doctorId) => {
  const storedImages = JSON.parse(localStorage.getItem("doctorImages") || "{}");
  return storedImages[doctorId] || "/assets/default-doctor.png";
};

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
  const [newDoctorImage, setNewDoctorImage] = useState(null);
  const [updateDoctorImage, setUpdateDoctorImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => { loadDoctors(); }, []);

  const handleError = (err) => {
    if (err.response) {
      const data = err.response.data;
      setErrorMsg(typeof data === "object" ? Object.values(data).join(", ") : data);
    } else setErrorMsg(err.message);
  };

  const loadDoctors = async () => {
    try {
      const res = await fetchDoctors();
      setDoctors(res.data);
    } catch (err) { console.error(err); }
  };

  const handleInputChange = (form, field, value) => {
    form === "new"
      ? setNewDoctor(prev => ({ ...prev, [field]: value }))
      : setUpdateDoctorForm(prev => ({ ...prev, [field]: value }));
  };

  const addDoctor = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      const res = await addDoctorAPI(newDoctor);
      if (newDoctorImage) setDoctorImage(res.data.doctorId, newDoctorImage);

      setSuccessMsg("Doctor added successfully!");
      setNewDoctor({
        name: "", speciality: "", experience: "", qualification: "",
        designation: "", email: "", passwordDoctor: "", contactNumber: ""
      });
      setNewDoctorImage(null);
      loadDoctors();
    } catch (err) { handleError(err); }
  };

  const updateDoctor = async () => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await updateDoctorAPI(updateDoctorForm);
      if (updateDoctorImage) setDoctorImage(updateDoctorForm.doctorId, updateDoctorImage);

      setSuccessMsg("Doctor updated successfully!");
      setUpdateDoctorImage(null);
      loadDoctors();
    } catch (err) { handleError(err); }
  };

  const deleteDoctor = async (id) => {
    setSuccessMsg(""); setErrorMsg("");
    try {
      await deleteDoctorAPI(id);

      const storedImages = JSON.parse(localStorage.getItem("doctorImages") || "{}");
      delete storedImages[id];
      localStorage.setItem("doctorImages", JSON.stringify(storedImages));

      setSuccessMsg("Doctor deleted successfully!");
      loadDoctors();
    } catch (err) { handleError(err); }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-secondary mb-4">Manage Doctors</h3>

      {successMsg && <div className="alert alert-success rounded-4">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger rounded-4">{errorMsg}</div>}

 
      <div className="card shadow-lg rounded-4 p-4 mb-4 border-0">
        <h5 className="fw-bold text-primary mb-3">Add Doctor</h5>
        <div className="row g-3">
          {Object.keys(newDoctor).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={newDoctor[field]}
                onChange={(e) => handleInputChange("new", field, e.target.value)}
              />
            </div>
          ))}
          <div className="col-md-4">
            <input type="file" accept="image/*" className="form-control rounded-3"
              onChange={(e) => setNewDoctorImage(e.target.files[0])} />
          </div>
        </div>
        <button className="btn btn-success mt-3 w-100 rounded-4" onClick={addDoctor}>Add Doctor</button>
      </div>

      {/* Update Doctor */}
      <div className="card shadow-lg rounded-4 p-4 mb-4 border-0">
        <h5 className="fw-bold text-primary mb-3">Update Doctor</h5>
        <div className="row g-3">
          {Object.keys(updateDoctorForm).map((field) => (
            <div className="col-md-4" key={field}>
              <input
                className="form-control rounded-3"
                placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                value={updateDoctorForm[field]}
                onChange={(e) => handleInputChange("update", field, e.target.value)}
              />
            </div>
          ))}
          <div className="col-md-4">
            <input type="file" accept="image/*" className="form-control rounded-3"
              onChange={(e) => setUpdateDoctorImage(e.target.files[0])} />
          </div>
        </div>
        <button className="btn btn-warning mt-3 w-100 rounded-4" onClick={updateDoctor}>Update Doctor</button>
      </div>

      {/* Doctors Table */}
      <div className="card shadow-lg rounded-4 p-3 border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
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
                    <td>
                      <img
                        src={getDoctorImage(d.doctorId)}
                        alt={d.name}
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    </td>
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
                  <td colSpan="6" className="text-center py-4 text-muted">No doctors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
