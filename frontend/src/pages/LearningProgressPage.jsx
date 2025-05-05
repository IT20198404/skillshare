//LikeController.java
import React, { useState } from "react";
import axios from "axios";

export default function LearningProgressPage() {
  const [progress, setProgress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/progress",
        { message: progress },
        {
          withCredentials: true, // IMPORTANT: Send session cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Progress submitted!");
      setProgress("");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Please log in first via Google.");
    }
  };

  return (
    <div className="container">
      <h2>Learning Progress Update</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          placeholder="E.g., Completed React tutorial, learned useEffect"
          rows="4"
        />
        <button type="submit">Submit Progress</button>
      </form>
    </div>
  );
}
