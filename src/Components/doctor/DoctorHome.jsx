import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentsByDoctor, getAppointmentById, updateAppointmentStatus } from "../../services/DoctorService";
import { FaUser, FaCalendarAlt, FaClock, FaAngleDown, FaAngleUp } from "react-icons/fa";

export default function DoctorHome() {
  const doctorId = localStorage.getItem("doctorId");
  const doctorName = localStorage.getItem("doctorName");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedIds, setExpandedIds] = useState([]);
  const [modalAppointment, setModalAppointment] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const res = await getAppointmentsByDoctor(doctorId);
        setAppointments(res.data);
      } catch {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      setAppointments((prev) =>
        prev.map((app) =>
          app.appointmentId === appointmentId ? { ...app, status } : app
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const toggleExpand = (appointmentId) => {
    setExpandedIds((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const startConsultation = (appointmentId) => {
    localStorage.setItem("appointmentId", appointmentId);
    navigate("/doctor/dashboard/records");
  };

  const openAppointmentModal = async (appointmentId, patientName) => {
    try {
      const res = await getAppointmentById(appointmentId);
      setModalAppointment({ ...res.data, patientName });
    } catch {
      alert("Failed to fetch appointment details");
    }
  };

  const closeModal = () => setModalAppointment(null);

  const filteredAppointments = appointments.filter((app) => {
    const status = app.status.toUpperCase();
    return activeTab === "upcoming"
      ? ["SCHEDULED", "CONFIRMED"].includes(status)
      : status === "COMPLETED";
  });

  return (
    <div className="container-fluid" style={{ marginLeft: "100px", paddingTop: "20px" }}>
      <h3 className="fw-bold mb-3">Welcome, Dr. {doctorName}</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
            style={{ cursor: "pointer" }}
          >
            Upcoming
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
            style={{ cursor: "pointer" }}
          >
            Completed
          </a>
        </li>
      </ul>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-center text-muted">No {activeTab} appointments</p>
      ) : (
        filteredAppointments.map((app) => {
          const status = app.status.toUpperCase();
          // Combine date + time from backend into a JS Date for display
          const dateTime = new Date(`${app.appointmentDate}T${app.appointmentTime}`);
          const isExpanded = expandedIds.includes(app.appointmentId);

          return (
            <div
              className="border rounded p-3 mb-2 shadow-sm"
              key={app.appointmentId}
            >
              {/* Small Tab View */}
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(app.appointmentId)}
              >
                <div className="d-flex gap-3 align-items-center">
                  <FaUser />
                  <span>{app.patientName}</span>
                  <FaCalendarAlt />
                  <span>{dateTime.toLocaleDateString()}</span>
                  <FaClock />
                  <span>{dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className={`badge ${status === "CONFIRMED" ? "bg-success" : status === "SCHEDULED" ? "bg-warning text-dark" : "bg-secondary"}`}>
                    {status}
                  </span>
                </div>
                <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
              </div>

              {/* Expanded View */}
              {isExpanded && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openAppointmentModal(app.appointmentId, app.patientName)}
                  >
                    View Appointment Details
                  </button>

                  {status === "SCHEDULED" && (
                    <>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleUpdateStatus(app.appointmentId, "CONFIRMED")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleUpdateStatus(app.appointmentId, "CANCELLED")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {status === "CONFIRMED" && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => startConsultation(app.appointmentId)}
                    >
                      Start Consultation
                    </button>
                  )}

                  {status === "COMPLETED" && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        localStorage.setItem("appointmentId", app.appointmentId);
                        navigate("/doctor/dashboard/view-records");
                      }}
                    >
                      View Record
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal */}
      {modalAppointment && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient Name:</strong> {modalAppointment.patientName}</p>
                <p><strong>Appointment Id:</strong> {modalAppointment.appointmentId}</p>
                <p><strong>Date:</strong> {modalAppointment.appointmentDate}</p>
                <p><strong>Time:</strong> {modalAppointment.appointmentTime}</p>
                <p><strong>Status:</strong> {modalAppointment.status}</p>
                <p><strong>Symptoms:</strong> {modalAppointment.symptoms}</p>
                <p><strong>Visit Type:</strong> {modalAppointment.visitType}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
