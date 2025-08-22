import React, { useState } from 'react';
import API from '../api';
import '../styles/MaintenanceForm.css';

function MaintenanceForm({ assetId, onClose, onSave }) {
  const [form, setForm] = useState({
    type: 'scheduled',
    description: '',
    date: new Date().toISOString().split('T')[0],
    completedBy: '',
    cost: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post(`/assets/${assetId}/maintenance`, {
        ...form,
        cost: parseFloat(form.cost) || 0
      });
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Record Maintenance</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="maintenance-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="scheduled">Scheduled Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the maintenance work performed..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Completed By</label>
              <input
                type="text"
                name="completedBy"
                value={form.completedBy}
                onChange={handleChange}
                required
                placeholder="Name of technician/personnel"
              />
            </div>

            <div className="form-group">
              <label>Cost</label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="Enter cost (if any)"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any additional notes or observations..."
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaintenanceForm;
