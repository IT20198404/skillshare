// File: src/pages/NotificationsPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notifications", { withCredentials: true })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to load notifications", err));
  }, []);

  return (
    <div className="container">
      <h2>🔔 Notifications</h2>
      <ul>
        {notifications.map((note) => (
          <li key={note.id}>
            {note.message} —{" "}
            <span style={{ fontSize: "0.8rem", color: "#555" }}>
              {new Date(note.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
