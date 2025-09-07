import axios from "axios";

const API = "http://localhost:8080/api/admin";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const fetchAppointments = () => axios.get(`${API}/appointments`, getAuthHeaders());
export const addAppointmentAPI = (appointment) =>
  axios.post(`${API}/appointments`, appointment, getAuthHeaders());
export const updateAppointmentStatusAPI = (id, status) =>
  axios.put(`${API}/appointments/${id}/status/${status}`, {}, getAuthHeaders());


export const fetchDoctors = () => axios.get(`${API}/doctors`, getAuthHeaders());
export const addDoctorAPI = (doctor) => axios.post(`${API}/doctors`, doctor, getAuthHeaders());
export const updateDoctorAPI = (doctor) => axios.put(`${API}/doctors`, doctor, getAuthHeaders());
export const deleteDoctorAPI = (id) => axios.delete(`${API}/doctors/${id}`, getAuthHeaders());



export const fetchPatients = () => axios.get(`${API}/patients`, getAuthHeaders());
export const updatePatientAPI = (patient) => axios.put(`${API}/patients`, patient, getAuthHeaders());
export const deletePatientAPI = (id) => axios.delete(`${API}/patients/${id}`, getAuthHeaders());