// Store JWT
export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function setRole(role) {
  localStorage.setItem("role", role);
}

export function getRole() {
  return localStorage.getItem("role");
}

export function removeRole() {
  localStorage.removeItem("role");
}

export function setPatientId(id) {
  localStorage.setItem("patientId", id);
}

export function getPatientId() {
  return localStorage.getItem("patientId");
}

export function removePatientId() {
  localStorage.removeItem("patientId");
}


export function setDoctorId(id) {
  localStorage.setItem("doctorId", id);
}

export function getDoctorId() {
  return localStorage.getItem("doctorId");
}

export function removeDoctorId() {
  localStorage.removeItem("doctorId");
}

export function clearAuth() {
  removeToken();
  removeRole();
  removePatientId();
  removeDoctorId();

}
