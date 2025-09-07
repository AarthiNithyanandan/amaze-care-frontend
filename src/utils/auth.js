// JWT
export function setToken(token) { localStorage.setItem("token", token); }
export function getToken() { return localStorage.getItem("token"); }
export function removeToken() { localStorage.removeItem("token"); }

// Role
export function setRole(role) { localStorage.setItem("role", role); }
export function getRole() { return localStorage.getItem("role"); }
export function removeRole() { localStorage.removeItem("role"); }

// Patient ID
export function setPatientId(id) { localStorage.setItem("patientId", id); }
export function getPatientId() { return localStorage.getItem("patientId"); }
export function removePatientId() { localStorage.removeItem("patientId"); }

// Doctor ID
export function setDoctorId(id) { localStorage.setItem("doctorId", id); }
export function getDoctorId() { return localStorage.getItem("doctorId"); }
export function removeDoctorId() { localStorage.removeItem("doctorId"); }

// Appointment ID
export function setAppointmentId(id) { localStorage.setItem("appointmentId", id); }
export function getAppointmentId() { return localStorage.getItem("appointmentId"); }
export function removeAppointmentId() { localStorage.removeItem("appointmentId"); }

// Medical Record ID
export function setRecordId(id) { localStorage.setItem("recordId", id); }
export function getRecordId() { return localStorage.getItem("recordId"); }
export function removeRecordId() { localStorage.removeItem("recordId"); }

// Clear everything
export function clearAuth() {
  removeToken();
  removeRole();
  removePatientId();
  removeDoctorId();
  removeAppointmentId();
  removeRecordId();
}
