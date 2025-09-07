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
      } catch (err) {
        setError("Failed to load appointments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {     
      const res = await updateAppointmentStatus(appointmentId, newStatus.toLowerCase());
      const updatedStatus = res.data?.status || newStatus.toLowerCase();
      setAppointments((prev) =>
        prev.map((app) =>
          app.appointmentId === appointmentId ? { ...app, status: updatedStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err.response?.data || err.message);
      alert("Failed to update status. Please try again.");
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
    } catch (err) {
      console.error("Failed to fetch appointment details:", err.response?.data || err.message);
      alert("Failed to fetch appointment details");
    }
  };

  const closeModal = () => setModalAppointment(null);

  const filteredAppointments = appointments.filter((app) => {
    const status = app.status?.toLowerCase() || "";
    return activeTab === "upcoming"
      ? ["scheduled", "confirmed"].includes(status)
      : status === "completed";
  });

  return (
    <div className="container-fluid" style={{ marginLeft: "100px", paddingTop: "20px" }}>
      
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
          const status = app.status?.toLowerCase() || "";
          const dateTime = new Date(`${app.appointmentDate}T${app.appointmentTime}`);
          const isExpanded = expandedIds.includes(app.appointmentId);

          return (
            <div
              className="border rounded p-3 mb-2 shadow-sm"
              key={app.appointmentId}
            >
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(app.appointmentId)}
              >
                <div className="d-flex gap-3 align-items-center flex-wrap">
                  <FaUser />
                  <span>{app.patientName}</span>
                  <FaCalendarAlt />
                  <span>{dateTime.toLocaleDateString()}</span>
                  <FaClock />
                  <span>{dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className={`badge ${
                    status === "confirmed" ? "bg-success" :
                    status === "scheduled" ? "bg-warning text-dark" :
                    status === "cancelled" ? "bg-danger" :
                    "bg-secondary"
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="fw-semibold ms-2">ID: {app.appointmentId}</span>
                </div>
                <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
              </div>

              {isExpanded && (
                <div className="mt-3 d-flex flex-wrap gap-2">                                 
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openAppointmentModal(app.appointmentId, app.patientName)}
                  >
                    View Appointment Details
                  </button>

                  {status === "scheduled" && (
                    <>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleUpdateStatus(app.appointmentId, "confirmed")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleUpdateStatus(app.appointmentId, "cancelled")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {status === "confirmed" && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => startConsultation(app.appointmentId)}
                    >
                      Start Consultation
                    </button>
                  )}

                  {status === "completed" && (
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
      
      {modalAppointment && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details (ID: {modalAppointment.appointmentId})</h5>
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


