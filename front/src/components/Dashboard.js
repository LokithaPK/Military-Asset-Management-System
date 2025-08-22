import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/common.css";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role") || "");
  const [metrics, setMetrics] = useState({
    openingBalance: 0,
    closingBalance: 0,
    netMovement: 0,
    assigned: 0,
    expended: 0,
    breakdown: { totalPurchased: 0, transferIn: 0, transferOut: 0 }
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await API.get("/dashboard");
        setMetrics(res.data);
      } catch (err) {
        console.log("Error fetching metrics:", err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="section-title">Dashboard</h2>
        <h3 className="welcome-message">Welcome, <b>{role.toUpperCase()}</b></h3>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Opening Balance</div>
          <div className="metric-value">{metrics.openingBalance}</div>
        </div>
        
        <div className="metric-card" onClick={() => setShowPopup(true)} style={{cursor: 'pointer'}}>
          <div className="metric-title">Net Movement</div>
          <div className="metric-value">{metrics.netMovement}</div>
          <div className="metric-change">(click for breakdown)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Closing Balance</div>
          <div className="metric-value">{metrics.closingBalance}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Assigned</div>
          <div className="metric-value">{metrics.assigned}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Expended</div>
          <div className="metric-value">{metrics.expended}</div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Net Movement Breakdown</h3>
              <button className="popup-close" onClick={() => setShowPopup(false)}>&times;</button>
            </div>
            <div className="metric-card">
              <div className="metric-title">Total Purchases</div>
              <div className="metric-value">{metrics.breakdown.totalPurchased}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Transfer In</div>
              <div className="metric-value">{metrics.breakdown.transferIn}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Transfer Out</div>
              <div className="metric-value">{metrics.breakdown.transferOut}</div>
            </div>
          </div>
        </div>
      )}

      <h3 className="section-title">Quick Actions</h3>
      <div className="actions-grid">
        {role === "admin" && (
          <>
            <div className="action-card" onClick={() => navigate("/assets")}>
              <h4>View All Assets</h4>
              <p>Manage and view all military assets</p>
            </div>
            <div className="action-card" onClick={() => navigate("/users")}>
              <h4>Manage Users</h4>
              <p>Add, edit, or remove system users</p>
            </div>
            <div className="action-card" onClick={() => navigate("/transfers")}>
              <h4>View Transfers</h4>
              <p>Track all asset transfers</p>
            </div>
          </>
        )}
        {role === "commander" && (
          <>
            <div className="action-card" onClick={() => navigate("/assets")}>
              <h4>View Base Assets</h4>
              <p>View and manage your base assets</p>
            </div>
            <div className="action-card" onClick={() => navigate("/assignments")}>
              <h4>Assign Assets</h4>
              <p>Manage asset assignments</p>
            </div>
          </>
        )}
        {role === "logistics" && (
          <>
            <div className="action-card" onClick={() => navigate("/purchases")}>
              <h4>Record Purchase</h4>
              <p>Add new asset purchases</p>
            </div>
            <div className="action-card" onClick={() => navigate("/transfers")}>
              <h4>Transfer Assets</h4>
              <p>Manage asset transfers</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
