const { body, param, query } = require('express-validator');

const contactValidationRules = {
  // Validation for creating a new contact
  createContact: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Contact person name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    
    body('school')
      .trim()
      .notEmpty()
      .withMessage('School name is required')
      .isLength({ min: 2, max: 200 })
      .withMessage('School name must be between 2 and 200 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email address is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('phone')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[\d\s+()-]+$/)
      .withMessage('Please provide a valid phone number')
      .isLength({ min: 10, max: 20 })
      .withMessage('Phone number must be between 10 and 20 characters'),
    
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters'),
  ],

  // Validation for updating contact status
  updateContact: [
    param('id')
      .isMongoId()
      .withMessage('Invalid contact ID'),
    
    body('status')
      .optional()
      .isIn(['new', 'contacted', 'in-progress', 'completed', 'closed'])
      .withMessage('Invalid status value'),
    
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority value'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
    
    body('isRead')
      .optional()
      .isBoolean()
      .withMessage('isRead must be a boolean value'),
  ],

  // Validation for getting a single contact
  getContact: [
    param('id')
      .isMongoId()
      .withMessage('Invalid contact ID'),
  ],

  // Validation for query parameters
  listContacts: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('status')
      .optional()
      .isIn(['new', 'contacted', 'in-progress', 'completed', 'closed'])
      .withMessage('Invalid status filter'),
    
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority filter'),
    
    query('isRead')
      .optional()
      .isBoolean()
      .withMessage('isRead must be a boolean value'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search term must be between 2 and 100 characters'),
  ],

  // Validation for deleting a contact
  deleteContact: [
    param('id')
      .isMongoId()
      .withMessage('Invalid contact ID'),
  ],
};

module.exports = contactValidationRules;
