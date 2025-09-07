import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const tokenHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAppointmentsByDoctor = (doctorId) =>
  axios.get(`${API_BASE}/appointments/doctor/${doctorId}`, tokenHeader());

export const updateAppointmentStatus = (appointmentId, status) =>
  axios.put(`${API_BASE}/appointments/${appointmentId}/${status}`, null, tokenHeader());

export const completeAppointment = (appointmentId) =>
  axios.patch(`${API_BASE}/appointments/${appointmentId}/completed`, {}, tokenHeader());

export const getAppointmentById = (appointmentId) =>
  axios.get(`${API_BASE}/appointments/${appointmentId}`, tokenHeader());


export const addMedicalRecord = (payload) =>
  axios.post(`${API_BASE}/medical-records/add`, payload, tokenHeader());

export const getMedicalRecordByAppointment = (appointmentId) =>
  axios.get(`${API_BASE}/medical-records/appointment/${appointmentId}`, tokenHeader());

export const addPrescription = (payload) =>
  axios.post(`${API_BASE}/prescriptions/addPrescription`, payload, {
    ...tokenHeader(),
    headers: { ...tokenHeader().headers, "Content-Type": "application/json" },
  });

export const getPrescriptionByMedicalRecord = (recordId) =>
  axios.get(`${API_BASE}/prescriptions/medical-record/${recordId}`, tokenHeader());

export const updatePrescription = (prescriptionId, payload) =>
  axios.put(`${API_BASE}/prescriptions/${prescriptionId}`, payload, tokenHeader());

export const addRecommendedTest = (payload) =>
  axios.post(`${API_BASE}/recommend-tests/add`, payload, tokenHeader());

export const getRecommendedTestsByAppointment = (appointmentId) =>
  axios.get(`${API_BASE}/recommend-tests/appointment/${appointmentId}`, tokenHeader());

export const updateRecommendedTest = (testId, payload) =>
  axios.put(`${API_BASE}/recommend-tests/${testId}`, payload, tokenHeader());
