import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  getAppointmentsByPatient,
  cancelAppointment,
  getMedicalRecordByAppointment
} from "../../services/PatientService";

const MyAppointments = () => {
  const patientId = localStorage.getItem("patientId");
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      try {
        const res = await getAppointmentsByPatient(patientId);
        const data = Array.isArray(res.data) ? res.data : res.data.appointments || [res.data];
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleViewRecord = (appointmentId) => {
    localStorage.setItem("appointmentId", appointmentId);
    navigate("/patient/dashboard/records");
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      const res = await getMedicalRecordByAppointment(appointmentId);
      if (res.data?.recordId) {
        localStorage.setItem("recordId", res.data.recordId);
        navigate("/patient/dashboard/prescriptions");
      } else {
        alert("No prescription available for this appointment.");
      }
    } catch (err) {
      console.error("Error fetching medical record", err);
      alert("No prescription available for this appointment.");
    }
  };

  const handleViewTests = (appointmentId) => {
    localStorage.setItem("appointmentId", appointmentId);
    navigate("/patient/dashboard/tests");
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelAppointment(appointmentId);
      alert("Appointment cancelled successfully");
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentId ? { ...a, status: "CANCELLED" } : a
        )
      );
      setExpandedIds((prev) => prev.filter((id) => id !== appointmentId));
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      alert("Failed to cancel appointment");
    }
  };

  const upcomingAppointments = appointments.filter((app) =>
    ["SCHEDULED", "CONFIRMED", "ACCEPTED"].includes(app.status?.toUpperCase())
  );
  const pastAppointments = appointments.filter((app) =>
    ["COMPLETED", "CANCELLED", "REJECTED"].includes(app.status?.toUpperCase())
  );

  const displayedAppointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <div className="container-fluid px-3" style={{ paddingTop: "20px" }}>
      <h3 className="fw-bold mb-3">My Appointments</h3>

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn ${activeTab === "upcoming" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`btn ${activeTab === "past" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : displayedAppointments.length === 0 ? (
        <p className="text-center text-muted">No {activeTab} appointments</p>
      ) : (
        displayedAppointments.map((app) => {
          const status = app.status?.toUpperCase();
          const dateTime = new Date(`${app.appointmentDate}T${app.appointmentTime || "00:00"}`);
          const isExpanded = expandedIds.includes(app.appointmentId);

          return (
            <div className="border rounded p-3 mb-2 shadow-sm" key={app.appointmentId}>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(app.appointmentId)}
              >
                <div className="d-flex gap-3 align-items-center flex-wrap">
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
                  <span className="ms-2 fw-semibold">Doctor: {app.doctorName}</span>
                  <span className="ms-2 text-muted">ID: {app.appointmentId}</span>
                </div>
                <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
              </div>

              {isExpanded && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleViewRecord(app.appointmentId)}
                  >
                    View Medical Record
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleViewPrescription(app.appointmentId)}
                  >
                    View Prescription
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => handleViewTests(app.appointmentId)}
                  >
                    View Recommended Tests
                  </button>

                  {activeTab === "upcoming" && ["SCHEDULED", "CONFIRMED"].includes(status) && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancel(app.appointmentId)}
                    >
                      Cancel Appointment
                    </button>
                  )}
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
