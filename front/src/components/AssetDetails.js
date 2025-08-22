import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import MaintenanceForm from './MaintenanceForm';
import '../styles/AssetDetails.css';

function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(location.state?.openMaintenance || false);

  const fetchAssetDetails = useCallback(async () => {
    try {
      const res = await API.get(`/assets/${id}`);
      setAsset(res.data);
    } catch (err) {
      console.error('Error fetching asset details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMaintenanceHistory = useCallback(async () => {
    try {
      const res = await API.get(`/assets/${id}/maintenance`);
      setMaintenanceHistory(res.data);
    } catch (err) {
      console.error('Error fetching maintenance history:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchAssetDetails();
    fetchMaintenanceHistory();
  }, [fetchAssetDetails, fetchMaintenanceHistory]);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.put(`/assets/${id}`, { ...asset, status: newStatus });
      setAsset({ ...asset, status: newStatus });
    } catch (err) {
      console.error('Error updating asset status:', err);
    }
  };

  if (loading) return <div>Loading asset details...</div>;
  if (!asset) return <div>Asset not found</div>;

  return (
    <div className="asset-details-container">
      <div className="details-header">
        <h2>{asset.name}</h2>
        <div className="header-actions">
          {(role === 'admin' || role === 'logistics') && (
            <>
              <button 
                className="secondary-button"
                onClick={() => navigate(`/assets/${id}/edit`)}
              >
                Edit Asset
              </button>
              <button 
                className="primary-button"
                onClick={() => setShowMaintenanceForm(true)}
              >
                Record Maintenance
              </button>
            </>
          )}
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Category</label>
              <span>{asset.category}</span>
            </div>
            <div className="info-item">
              <label>Serial Number</label>
              <span>{asset.serialNumber}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              {(role === 'admin' || role === 'logistics') ? (
                <select 
                  value={asset.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="status-select"
                >
                  <option value="Active">Active</option>
                  <option value="In Maintenance">In Maintenance</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Retired">Retired</option>
                </select>
              ) : (
                <span className={`status-badge ${asset.status.toLowerCase()}`}>
                  {asset.status}
                </span>
              )}
            </div>
            <div className="info-item">
              <label>Condition</label>
              <span>{asset.condition}</span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Location Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Base</label>
              <span>{asset.location?.base}</span>
            </div>
            <div className="info-item">
              <label>Specific Location</label>
              <span>{asset.location?.specific || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Acquisition Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Purchase Date</label>
              <span>
                {asset.acquisition?.date 
                  ? new Date(asset.acquisition.date).toLocaleDateString()
                  : 'Not recorded'}
              </span>
            </div>
            <div className="info-item">
              <label>Cost</label>
              <span>
                {asset.acquisition?.cost 
                  ? `$${asset.acquisition.cost.toLocaleString()}`
                  : 'Not recorded'}
              </span>
            </div>
            <div className="info-item">
              <label>Supplier</label>
              <span>{asset.acquisition?.supplier || 'Not recorded'}</span>
            </div>
            <div className="info-item">
              <label>Warranty Expiry</label>
              <span>
                {asset.acquisition?.warrantyExpiry 
                  ? new Date(asset.acquisition.warrantyExpiry).toLocaleDateString()
                  : 'Not recorded'}
              </span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Specifications</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Manufacturer</label>
              <span>{asset.specifications?.manufacturer || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Model</label>
              <span>{asset.specifications?.model || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Year</label>
              <span>{asset.specifications?.year || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="details-card full-width">
          <h3>Maintenance History</h3>
          {maintenanceHistory.length > 0 ? (
            <div className="maintenance-timeline">
              {maintenanceHistory.map((log, index) => (
                <div key={index} className="maintenance-log">
                  <div className="log-date">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  <div className="log-details">
                    <h4>{log.type}</h4>
                    <p>{log.description}</p>
                    <div className="log-meta">
                      <span>Completed by: {log.completedBy}</span>
                      <span>Cost: ${log.cost?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No maintenance history recorded</p>
          )}
        </div>

        {asset.attachments?.length > 0 && (
          <div className="details-card full-width">
            <h3>Attachments</h3>
            <div className="attachments-grid">
              {asset.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span>{attachment.name}</span>
                  <span>{attachment.type}</span>
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showMaintenanceForm && (
        <MaintenanceForm
          assetId={id}
          onClose={() => setShowMaintenanceForm(false)}
          onSave={() => {
            setShowMaintenanceForm(false);
            fetchMaintenanceHistory();
          }}
        />
      )}
    </div>
  );
}

export default AssetDetails;
