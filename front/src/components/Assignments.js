import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/Assignments.css";

function Assignments({ token }) {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ asset: "", assignedTo: "", base: "" });
  const role = localStorage.getItem("role");

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await API.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssignments();
  }, []);

  // Handle form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/assignments", form);
      setAssignments([...assignments, res.data]);
      setForm({ asset: "", assignedTo: "", base: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Assignment failed");
    }
  };

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h2 className="section-title">Assignments</h2>
      </div>

      {/* Assignment Form (Admin / Commander only) */}
      {(role === "admin" || role === "commander") && (
        <form onSubmit={handleSubmit} className="assignment-form">
          <h3 className="form-title mb-3">Create New Assignment</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Asset Name</label>
              <input
                className="form-input"
                name="asset"
                placeholder="Enter asset name"
                value={form.asset}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <input
                className="form-input"
                name="assignedTo"
                placeholder="Enter assignee name"
                value={form.assignedTo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Base</label>
              <input
                className="form-input"
                name="base"
                placeholder="Enter base name"
                value={form.base}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Assignment
          </button>
        </form>
      )}

      <div className="assignments-list">
        <h3 className="section-title">Existing Assignments</h3>
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Assigned To</th>
              <th>Base</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td>{a.asset}</td>
                <td>{a.assignedTo}</td>
                <td>
                  <span className="base-badge">{a.base}</span>
                </td>
                <td>
                  <span className={`status-badge ${a.expended ? 'status-expended' : 'status-active'}`}>
                    {a.expended ? 'Expended' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
