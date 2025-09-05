import React, { useEffect, useState } from "react";
import {
  getMedicalRecordByAppointment,
  updatePrescription,
  updateRecommendedTest,
  getRecommendedTestsByAppointment,
} from "../../services/DoctorService";

export default function ViewMedicalRecord() {
  const appointmentId = localStorage.getItem("appointmentId");
  const doctorId = localStorage.getItem("doctorId");

  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [recommendedTests, setRecommendedTests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("record");

  const [editingPrescription, setEditingPrescription] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineName: "",
    dosage: "",
    timing: "",
    instructions: "",
  });

  const [editingTestId, setEditingTestId] = useState(null);
  const [testForm, setTestForm] = useState({
    testName: "",
    description: "",
    preparationInstructions: "",
    cost: "",
    duration: "",
  });

  useEffect(() => {
    if (!appointmentId) {
      setErrorMsg("Select an appointment first!");
      return;
    }

    const fetchData = async () => {
      try {
        const resRecord = await getMedicalRecordByAppointment(appointmentId);
        setMedicalRecord(resRecord.data);
        setPrescription(resRecord.data.prescription || null);

        const resTests = await getRecommendedTestsByAppointment(appointmentId);
        setRecommendedTests(Array.isArray(resTests.data) ? resTests.data : []);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Failed to load medical record");
      }
    };

    fetchData();
  }, [appointmentId]);

  // Prescription handlers
  const startPrescriptionEdit = () => {
    if (!prescription) return;
    setPrescriptionForm({ ...prescription });
    setEditingPrescription(true);
  };

  const handlePrescriptionChange = (e) => {
    setPrescriptionForm({ ...prescriptionForm, [e.target.name]: e.target.value });
  };

  const handlePrescriptionUpdate = async (e) => {
    e.preventDefault();
    if (!prescription) return;
    try {
      const payload = {
        prescriptionId: prescription.prescriptionId,
        recordId: medicalRecord.recordId,
        doctorId: parseInt(doctorId),
        ...prescriptionForm,
      };
      const res = await updatePrescription(prescription.prescriptionId, payload);
      setPrescription(res.data);
      setEditingPrescription(false);
    } catch {
      alert("Failed to update prescription.");
    }
  };

  // Test handlers
  const startTestEdit = (test) => {
    setEditingTestId(test.testId);
 
    setTestForm({ ...test });
  };

  const handleTestChange = (e) => {
    setTestForm({ ...testForm, [e.target.name]: e.target.value });
  };

  const handleTestUpdate = async (e) => {
    e.preventDefault();
    if (!editingTestId) return;
    try {
      const payload = { ...testForm, appointmentId: parseInt(appointmentId) };
      const res = await updateRecommendedTest(testForm.testId, payload);
      setRecommendedTests((prev) =>
        prev.map((t) => (t.testId === testForm.testId ? res.data : t))
      );
      setEditingTestId(null);
    } catch {
      alert("Failed to update test.");
    }
  };

  if (errorMsg) return <div className="alert alert-danger">{errorMsg}</div>;
  if (!medicalRecord) return <p>Loading medical record...</p>;

  return (
    <div className="container-fluid mt-4">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "record" ? "active" : ""}`}
            onClick={() => setActiveTab("record")}
          >
            Medical Record
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "prescription" ? "active" : ""}`}
            onClick={() => setActiveTab("prescription")}
          >
            Prescription
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            Recommended Tests
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === "record" && (
            <div className="card p-4 mb-3 w-100">
              <div className="row mb-2">
                <div className="col-3 fw-bold">Diagnosis:</div>
                <div className="col">{medicalRecord.diagnosis}</div>
              </div>
              <div className="row mb-2">
                <div className="col-3 fw-bold">Notes:</div>
                <div className="col">{medicalRecord.notes}</div>
              </div>
              <div className="row">
                <div className="col-3 fw-bold">Record Date:</div>
                <div className="col">
                  {new Date(medicalRecord.recordDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {activeTab === "prescription" && (
            <div className="card p-4 mb-3 w-100">
              {prescription ? (
                editingPrescription ? (
                  <form onSubmit={handlePrescriptionUpdate}>
                    {["medicineName", "dosage", "timing", "instructions"].map((field) => (
                      <div className="mb-2" key={field}>
                        <input
                          className="form-control"
                          name={field}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={prescriptionForm[field]}
                          onChange={handlePrescriptionChange}
                          required={field !== "instructions"}
                        />
                      </div>
                    ))}
                    <button type="submit" className="btn btn-success me-2">Update</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingPrescription(false)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    {[
                      ["Medicine", "medicineName"],
                      ["Dosage", "dosage"],
                      ["Timing", "timing"],
                      ["Instructions", "instructions"],
                    ].map(([label, key]) => (
                      <div className="row mb-2" key={key}>
                        <div className="col-3 fw-bold">{label}:</div>
                        <div className="col">{prescription[key]}</div>
                      </div>
                    ))}
                    <button className="btn btn-primary btn-sm" onClick={startPrescriptionEdit}>Edit Prescription</button>
                  </>
                )
              ) : (
                <p>No prescription added yet.</p>
              )}
            </div>
          )}

          {activeTab === "tests" && (
            <div className="card p-4 mb-3 w-100">
              {recommendedTests.length > 0 ? (
                recommendedTests.map((t) => (
                  <div className="mb-3 border-bottom pb-2" key={t.testId}>
                    {editingTestId === t.testId ? (
                      <form onSubmit={handleTestUpdate}>
                        {["testName", "description", "preparationInstructions", "cost", "duration"].map((field) => (
                          <div className="mb-2" key={field}>
                            <input
                              className="form-control"
                              name={field}
                              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                              value={testForm[field]}
                              onChange={handleTestChange}
                            />
                          </div>
                        ))}
                        <button type="submit" className="btn btn-success me-2">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingTestId(null)}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        {[
                          ["Test Name", "testName"],
                          ["Description", "description"],
                          ["Preparation", "preparationInstructions"],
                          ["Cost", "cost"],
                          ["Duration", "duration"],
                        ].map(([label, key]) => (
                          <div className="row mb-2" key={key}>
                            <div className="col-3 fw-bold">{label}:</div>
                            <div className="col">{t[key]}</div>
                          </div>
                        ))}
                        <button className="btn btn-primary btn-sm" onClick={() => startTestEdit(t)}>Edit Test</button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No recommended tests yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
