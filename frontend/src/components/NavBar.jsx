// File: src/components/NavBar.jsx
import React from "react";
import "../App.css"; // Ensure CSS is imported for styling

const NavBar = () => {
  return (
    <div className="nav">
      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/activity">My Activity</a>
        <a href="/profile">Profile</a>
        <a href="/notifications">Notifications</a>
      </div>
      <button className="logout-button">Logout</button>
    </div>
  );
};

export default NavBar;
