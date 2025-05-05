import React, { useState } from "react";
import axios from "axios";

export default function SkillPostPage() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    files.forEach((file) => data.append("media", file));
    data.append("description", description);

    try {
      await axios.post("http://localhost:8080/api/posts", data, {
        withCredentials: true, // Important for OAuth2 session
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post uploaded successfully.");
      setFiles([]);
      setDescription("");
      setPreview([]);
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Share a Skill</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleChange}
        />
        <div className="preview">
          {preview.map((src, i) => (
            <div key={i}>
              {src.includes("video") ? (
                <video src={src} controls width={100} height={100} />
              ) : (
                <img src={src} alt="preview" width={100} height={100} />
              )}
            </div>
          ))}
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your skill..."
          rows="4"
        />
        <button type="submit">Upload Post</button>
      </form>
    </div>
  );
}
