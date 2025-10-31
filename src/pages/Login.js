import React, { useState } from "react";
import API from "../api"; // axios instance with baseURL
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ FIXED: Correct endpoint (no /api prefix needed)
      const res = await API.post("/auth/login", { email, password });

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`✅ Welcome ${res.data.user?.name || "User"}!`);
      window.location.href = "/notes";
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "❌ Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            value={email}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <a href="/signup" className="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
