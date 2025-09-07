import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultDoctor from "../assets/default-doctor.png"; // adjust path if needed

// Get doctor image from localStorage or fallback to default
const getDoctorImage = (doctorId) => {
  const storedImages = JSON.parse(localStorage.getItem("doctorImages") || "{}");
  return storedImages[doctorId.toString()] || defaultDoctor;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors from backend
    axios
      .get("http://localhost:8080/api/doctors/all")
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    // Filter doctors on search
    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [search, doctors]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#6f42c1" }}>Our Doctors</h2>
      </div>

      <div className="row mb-4 justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: "#9b7bbd" }}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div
              key={doc.doctorId}
              style={{
                border: "1px solid #e6d9f3",
                borderRadius: "12px",
                padding: "20px",
                width: "300px",
                backgroundColor: "#fdf9ff",
                boxShadow: "0 4px 12px rgba(155, 123, 189, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <img
                src={getDoctorImage(doc.doctorId)}
                alt={doc.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "15px",
                }}
              />
              <h5 style={{ color: "#6f42c1", fontWeight: "600", marginBottom: "10px" }}>{doc.name}</h5>
              <div style={{ fontSize: "14px", lineHeight: "1.6", width: "100%" }}>
                <p><strong>Doctor ID:</strong> {doc.doctorId}</p>
                <p><strong>Specialization:</strong> {doc.speciality}</p>
                <p><strong>Qualification:</strong> {doc.qualification}</p>
                <p><strong>Experience:</strong> {doc.experience} years</p>
                <p><strong>Designation:</strong> {doc.designation}</p>
                <p><strong>Contact:</strong> {doc.contactNumber}</p>
              </div>
              <Link
                to="/login"
                className="btn mt-3 w-100"
                style={{
                  backgroundColor: "#6f42c1",
                  color: "#fff",
                  borderRadius: "6px",
                  fontWeight: "500",
                }}
              >
                Book Appointment
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
