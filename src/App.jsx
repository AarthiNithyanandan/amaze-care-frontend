import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Registration from './Components/Registration';
import AdminDashboard from './Components/admin/AdminDashboard';
import ManageAppointments from './Components/admin/ManageAppointments';
import ManageDoctors from './Components/admin/ManageDoctors';
import ManagePatients from './Components/admin/ManagePatients';
// import AddDoctor from './Components/AddDoctor';
// import UpdateDoctor from './Components/UpdateDoctor';
// import DoctorDashboard from './Components/doctor/DoctorDashboard';
import PatientDashboard from './Components/patient/PatientDashboard';
import Home from './Components/Home';
import DashboardHome from './Components/patient/DashboardHome';
import DoctorAppointments from './Components/doctor/DoctorAppointments';
import Prescriptions from './Components/patient/Prescriptions';
import MedicalRecords from './Components/patient/MedicalRecords';
import RecommendedTests from './Components/patient/RecommendedTests';
import DoctorSearch from './Components/patient/DoctorSearch';
import BookAppointment from './Components/patient/BookAppointment';
import MyAppointments from './Components/patient/MyAppointments';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/NavBar';
import AddMedicalRecords from './Components/doctor/AddMedicalRecord';
import AddPrescription from './Components/doctor/AddPrescription';
import DoctorDashboard from './Components/doctor/DoctorDashboard';
import DoctorHome from './Components/doctor/DoctorHome';
import RecommendTests from './Components/doctor/RecommendTests';
import Doctors from './Components/doctors';
import ViewMedicalRecord from './Components/doctor/ViewMedicalRecord';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/doctors" element={<Doctors/>}/>

        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>}
        >
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<ManageAppointments />} />
        </Route>

       <Route
  path="/patient/dashboard"
  element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>}
>
  <Route path="home" element={<DashboardHome />} />
  <Route path="appointments" element={<MyAppointments />} />
  <Route path="prescriptions" element={<Prescriptions />} />
  <Route path="tests" element={<RecommendedTests />} />
  <Route path="records" element={<MedicalRecords />} />
  <Route path="doctors" element={<DoctorSearch />} />
  <Route path="book" element={<BookAppointment />} />
</Route>

 <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorHome />} /> 
        <Route path="home" element={<DoctorHome />} />
        <Route path="appointments" element={<DoctorAppointments />} />
         <Route path="records" element={<AddMedicalRecords />} />
         <Route path="prescriptions" element={<AddPrescription />} />
         <Route path="tests" element={<RecommendTests />} />
       
        <Route path="view-records" element={<ViewMedicalRecord />} /> 
      </Route>
      
</Routes>
      
    </BrowserRouter>
  );
}
  

export default App;
