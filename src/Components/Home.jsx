import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctors/all")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
<section
  className="d-flex flex-column justify-content-center align-items-center text-center"
  style={{ height: "50vh", padding: "0 20px" }} 
>
  <h1 className="display-4 fw-bold" style={{ color: "#5a2d7f" }}>Welcome to AmazeCare</h1>
  <p className="lead mx-auto mt-2" style={{ maxWidth: "600px", color: "#5a2d7f" }}>
  </p>
  <Link to="/login" className="btn btn-primary btn-lg mt-3">Book Appointment</Link> 
</section>

      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ color: "#5a2d7f" }}>Our Doctors</h2>
          {doctors.length > 0 ? (
            <div className="d-flex overflow-auto gap-3 px-2">
              {doctors.map((doc) => (
                <div key={doc.doctorId} className="card p-3 flex-shrink-0 shadow-sm" style={{ minWidth: "250px" }}>
                  <div className="bg-secondary mb-3" style={{ height: "120px", borderRadius: "8px" }}></div>
                  <h5 className="mt-2">{doc.name}</h5>
                  <p className="mb-1"><strong>Specialization:</strong> {doc.speciality}</p>
                  <p className="mb-1"><strong>Qualification:</strong> {doc.qualification}</p>
                  <p className="mb-1"><strong>Experience:</strong> {doc.experience} yrs</p>
                  <p className="mb-1"><strong>Contact:</strong> {doc.contactNumber}</p>
                  <Link to="/login" className="btn btn-primary w-100 mt-3">Book Appointment</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Loading doctors...</p>
          )}
          <Link to="/doctors" className="btn btn-light btn-lg mt-4">View All Doctors</Link>
        </div>
      </section>

      <section className="py-5 text-center" >
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ color: "#5a2d7f" }}>Contact Us</h2>
          
          <Link
            to="/contact"
            className="btn btn-primary btn-lg"
            style={{ backgroundColor: "#9b7bbd", border: "none" }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
