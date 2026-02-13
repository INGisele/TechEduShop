const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const contactValidator = require('../validators/contactValidator');
const validateRequest = require('../middleware/validateRequest');

// Public routes
router.post(
  '/',
  contactValidator.createContact,
  validateRequest,
  contactController.createContact
);

// Admin routes (these would typically require authentication middleware)
// For now, they're accessible but you should add auth middleware in production
router.get(
  '/stats',
  contactController.getContactStats
);

router.get(
  '/',
  contactValidator.listContacts,
  validateRequest,
  contactController.getContacts
);

router.get(
  '/:id',
  contactValidator.getContact,
  validateRequest,
  contactController.getContact
);

router.patch(
  '/:id',
  contactValidator.updateContact,
  validateRequest,
  contactController.updateContact
);

router.delete(
  '/:id',
  contactValidator.deleteContact,
  validateRequest,
  contactController.deleteContact
);

router.patch(
  '/:id/read',
  contactValidator.getContact,
  validateRequest,
  contactController.markAsRead
);

router.patch(
  '/:id/archive',
  contactValidator.getContact,
  validateRequest,
  contactController.archiveContact
);

module.exports = router;
