import React, { useState } from "react";
import axios from "axios";

export default function LearningPlanPage() {
  const [plan, setPlan] = useState({ topic: "", resources: "", deadline: "" });

  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/plans", plan, {
        withCredentials: true, // Send session cookie for OAuth2
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Learning Plan Submitted Successfully");
      setPlan({ topic: "", resources: "", deadline: "" });
    } catch (error) {
      console.error("Error submitting plan:", error);
      alert("Failed to submit plan");
    }
  };

  return (
    <div className="container">
      <h2>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Topic (e.g., React JS)"
          value={plan.topic}
          onChange={handleChange}
        />
        <input
          type="text"
          name="resources"
          placeholder="Resources (e.g., YouTube playlist)"
          value={plan.resources}
          onChange={handleChange}
        />
        <input
          type="date"
          name="deadline"
          value={plan.deadline}
          onChange={handleChange}
        />
        <button type="submit">Save Plan</button>
      </form>
    </div>
  );
}
