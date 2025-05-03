// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import SkillPostPage from "./pages/SkillPostPage";
import LearningProgressPage from "./pages/LearningProgressPage";
import LearningPlanPage from "./pages/LearningPlanPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import MyActivityPage from "./pages/MyActivityPage";
import axios from "axios";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileSet, setIsProfileSet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(true);
        setIsProfileSet(res.data.profileSet === true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsProfileSet(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    window.location.href = "http://localhost:8080/logout";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <nav className="nav">
        {isAuthenticated && isProfileSet && (
          <>
            <Link to="/">Home</Link>
            <Link to="/activity">My Activity</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/notifications">Notifications</Link>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
        {!isAuthenticated && <Link to="/login">Login</Link>}
      </nav>

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : !isProfileSet ? (
          <>
            <Route path="/setup" element={<ProfileSetupPage />} />
            <Route path="*" element={<Navigate to="/setup" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/activity" element={<MyActivityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
