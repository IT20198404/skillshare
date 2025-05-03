import React, { useState } from "react";
import axios from "axios";

export default function ProfileSetupPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstName", form.firstName);
    data.append("lastName", form.lastName);
    data.append("profilePic", file);

    try {
      await axios.post("http://localhost:8080/api/user/profile", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload(); // refresh to load new state
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container">
      <h2>Set Up Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
