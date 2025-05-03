import React, { useState } from "react";
import axios from "axios";

export default function MyActivityPage() {
  // Skill Post States
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState([]);

  // Progress Update States
  const [progress, setProgress] = useState("");

  // Learning Plan States
  const [plan, setPlan] = useState({ topic: "", resources: "", deadline: "" });

  // Skill Upload Handlers
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    files.forEach((file) => data.append("media", file));
    data.append("description", description);

    try {
      await axios.post("http://localhost:8080/api/posts", data, {
        withCredentials: true,
      });
      alert("✅ Skill post uploaded!");
      setFiles([]);
      setDescription("");
      setPreview([]);
    } catch (err) {
      alert("❌ Upload failed");
      console.error(err);
    }
  };

  // Progress Submit
  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/progress",
        { message: progress },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("✅ Progress submitted!");
      setProgress("");
    } catch (err) {
      alert("❌ Progress submission failed");
    }
  };

  // Plan Submit
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/plans", plan, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Learning plan submitted!");
      setPlan({ topic: "", resources: "", deadline: "" });
    } catch (err) {
      alert("❌ Plan submission failed");
    }
  };

  const handlePlanChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2>My Activity</h2>

      {/* Skill Post */}
      <section>
        <h3>Share a Skill</h3>
        <form onSubmit={handleSkillSubmit}>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="preview" style={{ marginTop: "10px" }}>
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                width={100}
                height={100}
                style={{ marginRight: "5px" }}
              />
            ))}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your skill..."
            rows="4"
            style={{ width: "100%", marginTop: "10px" }}
          />
          <button type="submit">Upload Post</button>
        </form>
      </section>

      <hr />

      {/* Progress Update */}
      <section>
        <h3>Update Learning Progress</h3>
        <form onSubmit={handleProgressSubmit}>
          <textarea
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="E.g., Completed React tutorial, learned useEffect"
            rows="4"
            style={{ width: "100%" }}
          />
          <button type="submit">Submit Progress</button>
        </form>
      </section>

      <hr />

      {/* Learning Plan */}
      <section>
        <h3>Create Learning Plan</h3>
        <form onSubmit={handlePlanSubmit}>
          <input
            type="text"
            name="topic"
            placeholder="Topic (e.g., React JS)"
            value={plan.topic}
            onChange={handlePlanChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="resources"
            placeholder="Resources (e.g., YouTube)"
            value={plan.resources}
            onChange={handlePlanChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <input
            type="date"
            name="deadline"
            value={plan.deadline}
            onChange={handlePlanChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button type="submit">Save Plan</button>
        </form>
      </section>
    </div>
  );
}
