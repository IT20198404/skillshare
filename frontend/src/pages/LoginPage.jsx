import React from "react";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirects to Spring Boot's Google OAuth2 login
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Google (OAuth 2.0)</button>
    </div>
  );
}
