import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/AssetForm.css';

function AssetForm({ assetId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    subCategory: '',
    serialNumber: '',
    status: 'Active',
    condition: '',
    location: {
      base: '',
      specific: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    acquisition: {
      date: '',
      cost: '',
      supplier: '',
      warrantyExpiry: ''
    },
    specifications: {
      manufacturer: '',
      model: '',
      year: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
        unit: 'meters'
      },
      weight: {
        value: '',
        unit: 'kg'
      }
    },
    maintenance: {
      maintenanceFrequency: ''
    },
    notes: ''
  });

  const fetchAssetDetails = useCallback(async () => {
    try {
      const res = await API.get(`/assets/${assetId}`);
      setForm({
        ...form,
        ...res.data,
        acquisition: {
          ...form.acquisition,
          ...(res.data.acquisition || {}),
          date: res.data.acquisition?.date?.split('T')[0] || '',
          warrantyExpiry: res.data.acquisition?.warrantyExpiry?.split('T')[0] || ''
        }
      });
    } catch (err) {
      setError('Failed to fetch asset details');
    }
  }, [assetId, form]);

  useEffect(() => {
    if (assetId) {
      fetchAssetDetails();
    }
  }, [assetId, fetchAssetDetails]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (assetId) {
        await API.put(`/assets/${assetId}`, form);
      } else {
        await API.post('/assets', form);
      }
      navigate('/assets');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asset-form-container">
      <div className="form-header">
        <h2>{assetId ? 'Edit Asset' : 'Create New Asset'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="asset-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Asset Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter asset name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Communications">Communications</option>
                <option value="Medical">Medical</option>
                <option value="Protective Gear">Protective Gear</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sub-Category</label>
              <input
                type="text"
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                placeholder="Enter sub-category"
              />
            </div>

            <div className="form-group">
              <label>Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                required
                placeholder="Enter serial number"
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="In Maintenance">In Maintenance</option>
                <option value="Reserved">Reserved</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="form-group">
              <label>Condition *</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Base *</label>
              <input
                type="text"
                name="location.base"
                value={form.location.base}
                onChange={handleChange}
                required
                placeholder="Enter base location"
              />
            </div>

            <div className="form-group">
              <label>Specific Location</label>
              <input
                type="text"
                name="location.specific"
                value={form.location.specific}
                onChange={handleChange}
                placeholder="Enter specific location"
              />
            </div>

            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                value={form.location.coordinates.latitude}
                onChange={(e) => handleNestedChange('location', 'coordinates', 'latitude', e.target.value)}
                placeholder="Enter latitude"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={form.location.coordinates.longitude}
                onChange={(e) => handleNestedChange('location', 'coordinates', 'longitude', e.target.value)}
                placeholder="Enter longitude"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Acquisition Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="acquisition.date"
                value={form.acquisition.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Cost</label>
              <input
                type="number"
                name="acquisition.cost"
                value={form.acquisition.cost}
                onChange={handleChange}
                placeholder="Enter cost"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Supplier</label>
              <input
                type="text"
                name="acquisition.supplier"
                value={form.acquisition.supplier}
                onChange={handleChange}
                placeholder="Enter supplier name"
              />
            </div>

            <div className="form-group">
              <label>Warranty Expiry</label>
              <input
                type="date"
                name="acquisition.warrantyExpiry"
                value={form.acquisition.warrantyExpiry}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Specifications</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Manufacturer</label>
              <input
                type="text"
                name="specifications.manufacturer"
                value={form.specifications.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer"
              />
            </div>

            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="specifications.model"
                value={form.specifications.model}
                onChange={handleChange}
                placeholder="Enter model"
              />
            </div>

            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                name="specifications.year"
                value={form.specifications.year}
                onChange={handleChange}
                placeholder="Enter year"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label>Maintenance Frequency (days)</label>
              <input
                type="number"
                name="maintenance.maintenanceFrequency"
                value={form.maintenance.maintenanceFrequency}
                onChange={handleChange}
                placeholder="Enter maintenance frequency"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Dimensions</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Length</label>
              <input
                type="number"
                step="0.01"
                value={form.specifications.dimensions.length}
                onChange={(e) => handleNestedChange('specifications', 'dimensions', 'length', e.target.value)}
                placeholder="Enter length"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Width</label>
              <input
                type="number"
                step="0.01"
                value={form.specifications.dimensions.width}
                onChange={(e) => handleNestedChange('specifications', 'dimensions', 'width', e.target.value)}
                placeholder="Enter width"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Height</label>
              <input
                type="number"
                step="0.01"
                value={form.specifications.dimensions.height}
                onChange={(e) => handleNestedChange('specifications', 'dimensions', 'height', e.target.value)}
                placeholder="Enter height"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={form.specifications.dimensions.unit}
                onChange={(e) => handleNestedChange('specifications', 'dimensions', 'unit', e.target.value)}
              >
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
                <option value="inches">Inches</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Enter any additional notes about the asset"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/assets')}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : (assetId ? 'Update Asset' : 'Create Asset')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssetForm;
