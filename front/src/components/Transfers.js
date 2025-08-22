import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/common.css";
import "../styles/Transfers.css";

function Transfers() {
  const role = localStorage.getItem("role");
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState({ asset: "", quantity: 0, fromBase: "", toBase: "" });

  // Fetch transfers
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await API.get("/transfers");
        setTransfers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTransfers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/transfers", form);
      setTransfers([...transfers, res.data]);
      setForm({ asset: "", quantity: 0, fromBase: "", toBase: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Transfer failed");
    }
  };

  return (
    <div className="transfers-container">
      <div className="transfers-header">
        <h2 className="transfers-title">Asset Transfers</h2>
      </div>

      {/* Only Admin / Logistics can add */}
      {(role === "admin" || role === "logistics") && (
        <div className="transfer-form">
          <h3>New Transfer</h3>
          <form onSubmit={handleSubmit}>
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
                <label className="form-label">Quantity</label>
                <input
                  className="form-input"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">From Base</label>
                <input
                  className="form-input"
                  name="fromBase"
                  placeholder="Enter source base"
                  value={form.fromBase}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">To Base</label>
                <input
                  className="form-input"
                  name="toBase"
                  placeholder="Enter destination base"
                  value={form.toBase}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="form-submit">Create Transfer</button>
          </form>
        </div>
      )}

      <div className="transfers-history">
        <h3 className="history-title">Transfer History</h3>
        <div className="transfer-item" style={{fontWeight: 'bold', borderBottom: '2px solid #eee'}}>
          <div>Asset</div>
          <div>Quantity</div>
          <div>From</div>
          <div>To</div>
          <div>Date</div>
        </div>
        <div className="transfers-list">
          {transfers.map((t) => (
            <div key={t._id} className="transfer-item">
              <div className="transfer-asset">{t.asset}</div>
              <div className="transfer-quantity">{t.quantity}</div>
              <div className="transfer-base">{t.fromBase}</div>
              <div className="transfer-base">{t.toBase}</div>
              <div className="transfer-date">
                {new Date(t.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transfers;
