import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/common.css";
import "../styles/Register.css";

function Register({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("logistics");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!email.trim()) {
      alert("Email is required");
      return;
    }
    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      const res = await API.post("/auth/register", { 
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.role);
      setToken(token);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      if (errorMessage.includes("duplicate key")) {
        alert("This email is already registered");
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select 
              className="form-select"
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="commander">Commander</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary register-submit">
            Create Account
          </button>
        </form>
        <div className="register-login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
