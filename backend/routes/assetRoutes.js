const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Basic CRUD routes
router.get('/', assetController.getAssets);
router.get('/stats', assetController.getAssetStats);
router.get('/maintenance-required', assetController.getAssetsRequiringMaintenance);
router.get('/:id', assetController.getAssetById);
router.get('/:id/maintenance', assetController.getMaintenanceHistory);

// Protected routes (admin and logistics only)
router.post('/', authMiddleware.restrictTo(['admin', 'logistics']), assetController.createAsset);
router.put('/:id', authMiddleware.restrictTo(['admin', 'logistics']), assetController.updateAsset);
router.delete('/:id', authMiddleware.restrictTo(['admin']), assetController.deleteAsset);

// Maintenance routes
router.post('/:id/maintenance', 
  authMiddleware.restrictTo(['admin', 'logistics']), 
  assetController.addMaintenanceLog
);

// Attachment routes
router.post('/:id/attachments',
  authMiddleware.restrictTo(['admin', 'logistics']),
  assetController.uploadAttachment
);

module.exports = router;
