import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { usePDF } from 'react-to-pdf';
import './Assets.css';

function Assets() {
  const [assets, setAssets] = useState([]);
  const { toPDF, targetRef } = usePDF({
    filename: 'assets-report.pdf',
    page: { margin: 20 }
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        setAssets(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssets();
  }, []);



  return (
    <div className="assets-container">
      <div className="header-container">
        <h2>Assets Overview</h2>
        <button 
          onClick={() => toPDF()}
          className="download-btn"
        >
          Download PDF Report
        </button>
      </div>

      <div ref={targetRef} className="report-container">
        <h2 className="report-header">Military Asset Management System</h2>
        <h3 className="report-header">Assets Report</h3>
        <p className="report-date">Generated on: {new Date().toLocaleDateString()}</p>
        
        <table className="assets-table">
          <thead>
            <tr>
              <th>Base</th>
              <th>Asset</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, idx) => (
              <tr key={idx}>
                <td>{a.base}</td>
                <td>{a.asset}</td>
                <td>{a.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assets;
