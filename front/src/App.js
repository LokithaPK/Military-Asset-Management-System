import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Assets from "./components/Assets";
import AssetDetails from "./components/AssetDetails";
import CreateAsset from "./components/CreateAsset";
import EditAsset from "./components/EditAsset";
import Assignments from "./components/Assignments";
import Purchases from "./components/Purchases";
import Transfers from "./components/Transfers";
import "./styles/main.css";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <div className="app-container">
        <Navbar setToken={setToken} token={token} />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/assets" element={token ? <Assets /> : <Navigate to="/login" />} />
            <Route path="/assets/new" element={token ? <CreateAsset /> : <Navigate to="/login" />} />
            <Route path="/assets/:id" element={token ? <AssetDetails /> : <Navigate to="/login" />} />
            <Route path="/assets/:id/edit" element={token ? <EditAsset /> : <Navigate to="/login" />} />
            <Route path="/assignments" element={token ? <Assignments /> : <Navigate to="/login" />} />
            <Route path="/purchases" element={token ? <Purchases /> : <Navigate to="/login" />} />
            <Route path="/transfers" element={token ? <Transfers /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
