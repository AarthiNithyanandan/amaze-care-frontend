import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import doctorBg from "../assets/doctor-side.jpg";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctors/all")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div className="bg-white min-vh-100">
      {/* Hero Section */}
      <section className="container-fluid py-5 d-flex flex-wrap align-items-center justify-content-between" style={{ background: "linear-gradient(135deg, #f3e9ff 50%, #ffffff 50%)" }}>
        <div className="col-md-6 mb-4">
          <h1 className="display-3 fw-bold text-lilac" style={{ color: "#5a2d7f" }}>Welcome to AmazeCare</h1>
          <Link to="/login" className="btn btn-lg mt-3" style={{ backgroundColor: "#6f42c1", color: "#fff" }}>
            Book Appointment
          </Link>
        </div>
        <div className="col-md-6 text-center">
          <img src={doctorBg} alt="Doctor consultation" className="img-fluid rounded-3" />
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4 text-lilac" style={{ color: "#5a2d7f" }}>Our Doctors</h2>
          {doctors.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {doctors.map((doc) => (
                <div key={doc.doctorId} className="card p-3 text-start" style={{ minWidth: "260px", maxWidth: "300px", backgroundColor: "#fdf9ff" }}>
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px", fontWeight: "bold" }}>
                    {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <h5 className="text-lilac fw-semibold mb-2" style={{ color: "#6f42c1" }}>{doc.name}</h5>
                  <p className="mb-1"><strong>Specialization:</strong> {doc.speciality}</p>
                  <p className="mb-1"><strong>Qualification:</strong> {doc.qualification}</p>
                  <p className="mb-1"><strong>Experience:</strong> {doc.experience} yrs</p>
                  <p className="mb-2"><strong>Contact:</strong> {doc.contactNumber}</p>
                  <Link to="/login" className="btn w-100" style={{ backgroundColor: "#6f42c1", color: "#fff" }}>
                    Book Appointment
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Loading doctors...</p>
          )}
          <Link to="/doctors" className="btn btn-light btn-lg mt-3">View All Doctors</Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-lilac" style={{ color: "#5a2d7f" }}>Contact Us</h2>
          <div className="mx-auto text-start" style={{ maxWidth: "500px" }}>
            <p><strong>Address:</strong> 123 Health St, Potheri, SRM Nagar, Kattankulathur, Tamil Nadu 603 203</p>
            <p><strong>Phone:</strong> +91 96444 96444, +91 89258 56353</p>
            <p><strong>Email:</strong> info@amazecare.com</p>
            <p className="mt-3"><strong>Connect With Us:</strong></p>
            <div className="d-flex gap-2 mt-2">
              <Link to="#" className="btn btn-primary btn-sm rounded-circle"><FaFacebookF /></Link>
              <Link to="#" className="btn btn-danger btn-sm rounded-circle"><FaInstagram /></Link>
              <Link to="#" className="btn btn-info btn-sm rounded-circle text-white"><FaLinkedinIn /></Link>
              <Link to="#" className="btn btn-danger btn-sm rounded-circle"><FaYoutube /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
