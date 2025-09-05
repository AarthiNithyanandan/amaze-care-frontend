import React, { createContext, useState, useEffect } from "react";

export const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  // doctorId comes from localStorage (set on login)
  const [doctorId, setDoctorId] = useState(null);

  // appointmentId and recordId stored in context instead of localStorage
  const [appointmentId, setAppointmentId] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    }
  }, []);

  return (
    <DoctorContext.Provider
      value={{
        doctorId,
        appointmentId,
        setAppointmentId,
        recordId,
        setRecordId,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};
