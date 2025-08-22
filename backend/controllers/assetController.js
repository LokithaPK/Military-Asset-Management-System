const Asset = require('../models/Asset');

// Get all assets with filtering and pagination
exports.getAssets = async (req, res) => {
  try {
    const {
      category,
      status,
      condition,
      base,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (condition) filter.condition = condition;
    if (base) filter['location.base'] = base;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const assets = await Asset.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Asset.countDocuments(filter);

    res.json({
      assets,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assets' });
  }
};

// Get asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching asset' });
  }
};

// Create new asset
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting asset' });
  }
};

// Add maintenance log
exports.addMaintenanceLog = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    asset.maintenance.maintenanceHistory.push(req.body);
    asset.maintenance.lastMaintenance = req.body.date;
    
    // Calculate next maintenance date based on frequency
    if (asset.maintenance.maintenanceFrequency) {
      const nextDate = new Date(req.body.date);
      nextDate.setDate(nextDate.getDate() + asset.maintenance.maintenanceFrequency);
      asset.maintenance.nextScheduledMaintenance = nextDate;
    }

    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get maintenance history
exports.getMaintenanceHistory = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset.maintenance.maintenanceHistory);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching maintenance history' });
  }
};

// Get assets requiring maintenance
exports.getAssetsRequiringMaintenance = async (req, res) => {
  try {
    const assets = await Asset.find({
      'maintenance.nextScheduledMaintenance': {
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      },
      status: { $ne: 'In Maintenance' }
    }).sort('maintenance.nextScheduledMaintenance');

    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching maintenance requirements' });
  }
};

// Upload asset attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Assume req.file contains the uploaded file details
    const attachment = {
      type: req.body.type,
      name: req.file.originalname,
      url: req.file.path, // You'll need to implement file storage
      uploadDate: new Date()
    };

    asset.attachments.push(attachment);
    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get asset statistics
exports.getAssetStats = async (req, res) => {
  try {
    const stats = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalAssets: { $sum: 1 },
          categoryCounts: { $push: '$category' },
          statusCounts: { $push: '$status' },
          averageAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$acquisition.date'] },
                1000 * 60 * 60 * 24 * 365
              ]
            }
          },
          totalValue: { $sum: '$acquisition.cost' }
        }
      }
    ]);

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching asset statistics' });
  }
};
