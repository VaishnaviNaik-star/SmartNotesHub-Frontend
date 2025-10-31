import React, { useState } from "react";
import API from "../api"; // axios instance
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // start empty
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("⚠️ Please select a role!");
      return;
    }

    try {
      setLoading(true);
      // ✅ Fixed endpoint — no extra /api
      await API.post("/auth/signup", { name, email, password, role });

      alert("✅ Signup successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      console.error("Signup Error:", err);
      const msg =
        err.response?.data?.message ||
        "❌ Signup failed. Please check your details and try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
