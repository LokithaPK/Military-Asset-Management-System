import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/Purchases.css";

function Purchases() {
  const role = localStorage.getItem("role");
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ asset: "", quantity: 0, base: "" });

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await API.get("/purchases");
        setPurchases(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPurchases();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/purchases", form);
      setPurchases([...purchases, res.data]);
      setForm({ asset: "", quantity: 0, base: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  return (
    <div className="purchases-container">
      <div className="purchases-header">
        <h2 className="section-title">Purchases</h2>
      </div>

      {/* Only Admin / Logistics can add */}
      {(role === "admin" || role === "logistics") && (
        <form onSubmit={handleSubmit} className="purchase-form">
          <h3 className="form-title mb-3">Record New Purchase</h3>
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
                min="1"
                placeholder="Enter quantity"
                value={form.quantity}
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
            Record Purchase
          </button>
        </form>
      )}

      <div className="purchases-list">
        <h3 className="section-title">Purchase History</h3>
        <table className="purchases-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Base</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id}>
                <td className="purchase-date">
                  {new Date(p.date).toLocaleDateString()}
                </td>
                <td>{p.asset}</td>
                <td className="quantity-cell">{p.quantity}</td>
                <td>
                  <span className="base-badge">{p.base}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Purchases;
