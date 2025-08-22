import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar({ setToken, token }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Military Assets</h1>
      <div className="navbar-links">
        {token && <Link to="/" className="nav-link">Dashboard</Link>}
        {token && <Link to="/assignments" className="nav-link">Assignments</Link>}

        {/* Role-based links */}
        {(role === "admin" || role === "logistics") && <Link to="/purchases" className="nav-link">Purchases</Link>}
        {(role === "admin" || role === "logistics") && <Link to="/transfers" className="nav-link">Transfers</Link>}
        {token && <Link to="/assets" className="nav-link">Assets</Link>}

        {/* Auth Links */}
        {!token ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-button">
            <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
