const Contact = require('../models/Contact');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

// @desc    Create new contact submission
// @route   POST /api/v1/contacts
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const { name, school, email, phone, message } = req.body;

  // Get client information
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');

  // Create contact
  const contact = await Contact.create({
    name,
    school,
    email,
    phone,
    message,
    ipAddress,
    userAgent,
    source: 'website'
  });

  logger.info(`New contact created: ${contact._id} from ${email}`);

  // Send notification emails (non-blocking)
  emailService.sendContactNotification(contact).catch(err => 
    logger.error('Failed to send notification email:', err)
  );

  emailService.sendAutoReply(contact).catch(err => 
    logger.error('Failed to send auto-reply email:', err)
  );

  res.status(201).json({
    status: 'success',
    message: 'Thank you for contacting us! We will get back to you soon.',
    data: {
      contact: {
        id: contact._id,
        name: contact.name,
        school: contact.school,
        email: contact.email,
        createdAt: contact.createdAt
      }
    }
  });
});

// @desc    Get all contacts with filtering, sorting, and pagination
// @route   GET /api/v1/contacts
// @access  Private (Admin)
exports.getContacts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    isRead,
    isArchived,
    search,
    sortBy = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
  
  // Search functionality
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { school: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const contacts = await Contact.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  // Get total count for pagination
  const total = await Contact.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    },
    data: {
      contacts
    }
  });
});

// @desc    Get single contact by ID
// @route   GET /api/v1/contacts/:id
// @access  Private (Admin)
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id).select('-__v');

  if (!contact) {
    return next(new AppError('Contact not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
});

// @desc    Update contact
// @route   PATCH /api/v1/contacts/:id
// @access  Private (Admin)
exports.updateContact = asyncHandler(async (req, res, next) => {
  const allowedUpdates = ['status', 'priority', 'notes', 'isRead', 'isArchived'];
  const updates = {};

  // Filter allowed updates
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!contact) {
    return next(new AppError('Contact not found', 404));
  }

  logger.info(`Contact updated: ${contact._id}`);

  res.status(200).json({
    status: 'success',
    message: 'Contact updated successfully',
    data: {
      contact
    }
  });
});

// @desc    Delete contact
// @route   DELETE /api/v1/contacts/:id
// @access  Private (Admin)
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError('Contact not found', 404));
  }

  logger.info(`Contact deleted: ${req.params.id}`);

  res.status(200).json({
    status: 'success',
    message: 'Contact deleted successfully',
    data: null
  });
});

// @desc    Get contact statistics
// @route   GET /api/v1/contacts/stats
// @access  Private (Admin)
exports.getContactStats = asyncHandler(async (req, res, next) => {
  const stats = await Contact.getStats();

  // Get recent contacts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentCount = await Contact.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  res.status(200).json({
    status: 'success',
    data: {
      ...stats,
      recentContacts: recentCount
    }
  });
});

// @desc    Mark contact as read
// @route   PATCH /api/v1/contacts/:id/read
// @access  Private (Admin)
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!contact) {
    return next(new AppError('Contact not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact marked as read',
    data: {
      contact
    }
  });
});

// @desc    Archive contact
// @route   PATCH /api/v1/contacts/:id/archive
// @access  Private (Admin)
exports.archiveContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isArchived: true },
    { new: true }
  );

  if (!contact) {
    return next(new AppError('Contact not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact archived successfully',
    data: {
      contact
    }
  });
});
