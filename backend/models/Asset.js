const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['scheduled', 'repair', 'inspection'],
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  completedBy: String,
  cost: Number,
  notes: String
});

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Weapons', 'Vehicles', 'Communications', 'Medical', 'Protective Gear', 'Technology', 'Other'],
    required: true
  },
  subCategory: String,
  serialNumber: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'In Maintenance', 'Reserved', 'Retired', 'Under Repair'],
    default: 'Active'
  },
  condition: {
    type: String,
    enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
    required: true
  },
  location: {
    base: String,
    specific: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  acquisition: {
    date: Date,
    cost: Number,
    supplier: String,
    warrantyExpiry: Date
  },
  specifications: {
    manufacturer: String,
    model: String,
    year: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String
    },
    weight: {
      value: Number,
      unit: String
    }
  },
  maintenance: {
    lastMaintenance: Date,
    nextScheduledMaintenance: Date,
    maintenanceFrequency: Number, // in days
    maintenanceHistory: [maintenanceLogSchema]
  },
  attachments: [{
    type: {
      type: String,
      enum: ['Manual', 'Warranty', 'Certificate', 'Image', 'Other']
    },
    name: String,
    url: String,
    uploadDate: Date
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  lastCheckedBy: String,
  lastCheckDate: Date
});

// Update the updatedAt field before saving
assetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for frequently queried fields
assetSchema.index({ category: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ serialNumber: 1 });
assetSchema.index({ 'location.base': 1 });

module.exports = mongoose.model('Asset', assetSchema);
