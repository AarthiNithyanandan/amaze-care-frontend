import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaAngleDown, FaAngleUp } from "react-icons/fa";

const MyAppointments = () => {
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patientId");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/patient/${patientId}`,
          config
        );
        const data = Array.isArray(res.data) ? res.data : res.data.appointments || [res.data];
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId, token]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleViewRecord = (recordId, appointmentId) => {
    if (recordId) {
      localStorage.setItem("recordId", recordId);
      localStorage.setItem("appointmentId", appointmentId);
      navigate("/patient/dashboard/records");
    } else {
      alert("No medical record available for this appointment.");
    }
  };

  const handleViewPrescription = (recordId) => {
    if (recordId) {
      localStorage.setItem("recordId", recordId);
      navigate("/patient/dashboard/prescriptions");
    } else {
      alert("No prescription available for this appointment.");
    }
  };

  const handleViewTests = (appointmentId) => {
    localStorage.setItem("appointmentId", appointmentId);
    navigate("/patient/dashboard/tests");
  };

  const filteredAppointments = appointments.filter((app) => {
    const status = app.status?.toUpperCase();
    return activeTab === "upcoming"
      ? ["SCHEDULED", "CONFIRMED", "ACCEPTED"].includes(status)
      : ["COMPLETED", "CANCELLED", "REJECTED"].includes(status);
  });

  return (
    <div className="container-fluid px-3" style={{ paddingTop: "20px" }}>
      <h3 className="fw-bold mb-3">My Appointments</h3>

      {/* Improved Tab Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
        <button
          className={`btn ${activeTab === "upcoming" ? "btn-primary" : "btn-outline-primary"}`}
          style={{
            minWidth: "140px",
            borderRadius: "8px",
            fontWeight: "500",
            backgroundColor: activeTab === "upcoming" ? "#6f42c1" : "#fff",
            color: activeTab === "upcoming" ? "#fff" : "#6f42c1",
            borderColor: "#6f42c1"
          }}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>

        <button
          className={`btn ${activeTab === "past" ? "btn-primary" : "btn-outline-primary"}`}
          style={{
            minWidth: "140px",
            borderRadius: "8px",
            fontWeight: "500",
            backgroundColor: activeTab === "past" ? "#6f42c1" : "#fff",
            color: activeTab === "past" ? "#fff" : "#6f42c1",
            borderColor: "#6f42c1"
          }}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-center text-muted">No {activeTab} appointments</p>
      ) : (
        filteredAppointments.map((app) => {
          const status = app.status?.toUpperCase();
          const dateTime = new Date(`${app.appointmentDate}T${app.appointmentTime || "00:00"}`);
          const isExpanded = expandedIds.includes(app.appointmentId);

          return (
            <div className="border rounded p-3 mb-2 shadow-sm" key={app.appointmentId}>
              {/* Header */}
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(app.appointmentId)}
              >
                <div className="d-flex gap-3 align-items-center">
                  <FaCalendarAlt />
                  <span>{dateTime.toLocaleDateString()}</span>
                  <FaClock />
                  <span>{dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span
                    className={`badge ${
                      status === "CONFIRMED"
                        ? "bg-success"
                        : status === "SCHEDULED"
                        ? "bg-warning text-dark"
                        : status === "CANCELLED"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
              </div>

              {/* Expanded Actions */}
              {isExpanded && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleViewRecord(app.medicalRecord?.recordId, app.appointmentId)}
                  >
                    View Medical Record
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleViewPrescription(app.medicalRecord?.recordId)}
                  >
                    View Prescription
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => handleViewTests(app.appointmentId)}
                  >
                    View Recommended Tests
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyAppointments;
