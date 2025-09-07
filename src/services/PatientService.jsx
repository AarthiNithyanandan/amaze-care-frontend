import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const tokenHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAllDoctors = () =>
  axios.get(`${API_BASE}/doctors/all`, tokenHeader());

export const bookAppointment = (payload) =>
  axios.post(`${API_BASE}/appointments/add`, payload, tokenHeader());


export const getPatientAppointmentCounts = (patientId) =>
  axios.get(`${API_BASE}/appointments/patient/${patientId}/counts`, tokenHeader());

export const getAppointmentsByPatient = (patientId) =>
  axios.get(`${API_BASE}/appointments/patient/${patientId}`, tokenHeader());

export const cancelAppointment = (appointmentId) =>
  axios.put(`${API_BASE}/appointments/${appointmentId}/CANCELLED`, {}, tokenHeader());

export const getMedicalRecordByAppointment = (appointmentId) =>
  axios.get(`${API_BASE}/medical-records/appointment/${appointmentId}`, tokenHeader());

export const getPrescriptionByMedicalRecord = (recordId) =>
  axios.get(`${API_BASE}/prescriptions/medical-record/${recordId}`, tokenHeader());


export const getRecommendedTestsByAppointment = (appointmentId) =>
  axios.get(`${API_BASE}/recommend-tests/appointment/${appointmentId}`, tokenHeader());