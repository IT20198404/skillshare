import React from "react";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirects to Spring Boot's Google OAuth2 login
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <button
          className="login-btn"
          onClick={handleLogin}
          style={{
            display: "block",        // Make the button a block element
            margin: "0 auto",        // Auto margin to center it horizontally
            textAlign: "center",     // Center the text inside the button (if needed)
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
