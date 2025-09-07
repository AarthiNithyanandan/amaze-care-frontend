import React, { useState, useEffect } from "react";
import { addRecommendedTest, getRecommendedTestsByAppointment } from "../../services/DoctorService";

export default function RecommendTests() {
  const appointmentId = localStorage.getItem("appointmentId");
  const doctorId = localStorage.getItem("doctorId");

  const [form, setForm] = useState({
    testName: "",
    description: "",
    preparationInstructions: "",
    cost: "",
    duration: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [existingTests, setExistingTests] = useState([]);

  const availableTests = [
    { name: "Blood Test", description: "Checks general blood health", duration: "1 day", cost: 500 },
    { name: "X-Ray", description: "Imaging test for bones/lungs", duration: "Same day", cost: 1200 },
    { name: "MRI", description: "Detailed body scan", duration: "2 days", cost: 5000 },
    { name: "CT Scan", description: "Cross-sectional imaging", duration: "1 day", cost: 4000 },
    { name: "ECG", description: "Heart rhythm test", duration: "Same day", cost: 800 }
  ];

  useEffect(() => {
    if (!appointmentId) {
      setErrorMsg("Please select an appointment first!");
      return;
    }

    const fetchExistingTests = async () => {
      try {
        const res = await getRecommendedTestsByAppointment(appointmentId);
        const tests = res.data?.recommendedTests || [];
        setExistingTests(Array.isArray(tests) ? tests : []);
      } catch (err) {
        console.error("Failed to fetch existing tests", err);
        // setErrorMsg("Failed to check existing recommended tests.");
      }
    };

    fetchExistingTests();
  }, [appointmentId]);

  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestSelect = (e) => {
    const selectedTest = availableTests.find(t => t.name === e.target.value);
    if (selectedTest) {
      setForm({
        ...form,
        testName: selectedTest.name,
        description: selectedTest.description,
        duration: selectedTest.duration,
        cost: selectedTest.cost,
        preparationInstructions: ""
      });
    } else {
      setForm({ ...form, testName: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId) {
      setErrorMsg("Please select an appointment first!");
      return;
    }

    try {
      const payload = { ...form, appointmentId: parseInt(appointmentId), doctorId: parseInt(doctorId) };
      await addRecommendedTest(payload);
      setSuccessMsg("Recommended test added successfully!");
      setForm({ testName: "", description: "", preparationInstructions: "", cost: "", duration: "" });
      setExistingTests([payload]);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to add recommended test.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center mt-4">
        <div className="w-100" style={{ maxWidth: "700px", backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h2 className="mb-4 text-center">Recommend Test</h2>

          {errorMsg && <div className="alert alert-danger text-center mb-3">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success text-center mb-3">{successMsg}</div>}
          {existingTests.length > 0 && <div className="alert alert-warning text-center mb-3">Tests already added for this appointment.</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <select className="form-control" onChange={handleTestSelect} defaultValue="">
                <option value="">-- Select a Test --</option>
                {availableTests.map((test, index) => (
                  <option key={index} value={test.name}>{test.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <input className="form-control" name="testName" placeholder="Test Name" value={form.testName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <textarea className="form-control" name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>
            </div>
            <div className="mb-3">
              <textarea className="form-control" name="preparationInstructions" placeholder="Preparation Instructions" value={form.preparationInstructions} onChange={handleChange}></textarea>
            </div>
            <div className="mb-3">
              <input className="form-control" type="number" name="cost" placeholder="Cost" value={form.cost} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <input className="form-control" name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Save Test</button>
          </form>
        </div>
      </div>
    </div>
  );
}
