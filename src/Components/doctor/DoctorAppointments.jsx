import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointments() {
  const doctorId = localStorage.getItem("doctorId");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState("upcoming"); // "upcoming" or "completed"
  const [expandedId, setExpandedId] = useState(null); // which appointment is expanded

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchAppointments();
  }, [doctorId]);

  const handleStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/status?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app.appointmentId === appointmentId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRecord = (appointmentId) => {
    localStorage.setItem("appointmentId", appointmentId);
    window.location.href = "/doctor/dashboard/records";
  };

  const today = new Date();

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.appointmentDate);
    return activeTopTab === "upcoming" ? apptDate >= today : apptDate < today;
  });

  return (
    <div className="container-fluid px-4 mt-4">
      <h2>My Appointments</h2>

      {/* Top-level tabs */}
      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTopTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTopTab("upcoming")}
          >
            Upcoming
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTopTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTopTab("completed")}
          >
            Completed
          </button>
        </li>
      </ul>

      {/* Appointment cards as tabs */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-center mt-4 text-muted">No {activeTopTab} appointments found.</p>
      ) : (
        <div className="mt-3">
          {filteredAppointments.map((appt) => {
            const isExpanded = expandedId === appt.appointmentId;
            const statusClass =
              appt.status?.toLowerCase() === "cancelled"
                ? "bg-danger"
                : appt.status?.toLowerCase() === "accepted"
                ? "bg-success"
                : "bg-secondary";

            return (
              <div key={appt.appointmentId} className="card mb-2 shadow-sm">
                {/* Card Header */}
                <div
                  className={`card-header d-flex justify-content-between align-items-center ${
                    isExpanded ? "bg-primary text-white" : "bg-light"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedId(isExpanded ? null : appt.appointmentId)}
                >
                  <span>
                    #{appt.appointmentId} — {new Date(appt.appointmentDate).toLocaleString()} —{" "}
                    <span className={`badge ${statusClass} ms-2`}>{appt.status}</span>
                  </span>
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {/* Card Body */}
                {isExpanded && (
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-md-3 fw-bold">Symptoms:</div>
                      <div className="col">{appt.symptoms}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-3 fw-bold">Visit Type:</div>
                      <div className="col">{appt.visitType}</div>
                    </div>

                    {appt.status === "SCHEDULED" && (
                      <div className="d-flex gap-2 mb-2">
                        <button
                          className="btn btn-success"
                          onClick={() => handleStatus(appt.appointmentId, "ACCEPTED")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleStatus(appt.appointmentId, "REJECTED")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleAddRecord(appt.appointmentId)}
                    >
                      Add Medical Record
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
