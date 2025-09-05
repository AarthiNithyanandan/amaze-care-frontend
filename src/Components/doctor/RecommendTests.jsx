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
  const [existingTests, setExistingTests] = useState([]);

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
    setErrorMsg("Failed to check existing recommended tests.");
  }
};

    fetchExistingTests();
  }, [appointmentId]);

  const handleChange = (e) => {
    setErrorMsg(""); 
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId) return;

    if (existingTests.length > 0) {
      setErrorMsg("Tests already added for this appointment!");
      return;
    }

    try {
      const payload = { ...form, appointmentId: parseInt(appointmentId), doctorId: parseInt(doctorId) };
      await addRecommendedTest(payload);
      alert("Recommended test added successfully!");
      setForm({ testName: "", description: "", preparationInstructions: "", cost: "", duration: "" });
      setExistingTests([payload]); // mark as added
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

          {!appointmentId ? (
            <p className="text-danger text-center">Select an appointment first to recommend tests.</p>
          ) : existingTests.length > 0 ? (
            <p className="text-success text-center">Tests already added for this appointment.</p>
          ) : (
            <form onSubmit={handleSubmit}>
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
          )}
        </div>
      </div>
    </div>
  );
}
