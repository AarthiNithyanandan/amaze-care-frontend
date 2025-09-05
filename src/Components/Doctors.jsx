import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctors/all")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">All Doctors</h2>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-12 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="row">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc.doctorId} className="col-md-4 mb-4 d-flex">
              <div className="card shadow-sm h-100 w-100 d-flex flex-column">
                <div className="card-body text-center d-flex flex-column">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#9b7bbd",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0 auto 15px auto",
                    }}
                  >
                    {doc.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <h4 className="text-primary">{doc.name}</h4>
                  <p><strong>Specialization:</strong> {doc.speciality}</p>
                  <p><strong>Qualification:</strong> {doc.qualification}</p>
                  <p><strong>Experience:</strong> {doc.experience} years</p>
                  <p><strong>Designation:</strong> {doc.designation}</p>
                  <p><strong>Contact:</strong> {doc.contactNumber}</p>

                  <div className="mt-auto">
                    <Link to="/login" className="btn btn-primary w-100 mt-3">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
