const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      minlength: [2, 'Name must be at least 2 characters']
    },
    school: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      maxlength: [200, 'School name cannot exceed 200 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\d\s+()-]+$/,
        'Please provide a valid phone number'
      ]
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'completed', 'closed'],
      default: 'new'
    },
    source: {
      type: String,
      enum: ['website', 'phone', 'email', 'referral', 'other'],
      default: 'website'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isArchived: 1, status: 1 });

// Virtual for formatted creation date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to sanitize data
contactSchema.pre('save', function(next) {
  // Remove any HTML tags from text fields for security
  const stripHtml = (str) => str.replace(/<[^>]*>/g, '');
  
  if (this.name) this.name = stripHtml(this.name);
  if (this.school) this.school = stripHtml(this.school);
  if (this.message) this.message = stripHtml(this.message);
  if (this.notes) this.notes = stripHtml(this.notes);
  
  next();
});

// Static method to get statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await this.countDocuments();
  const unread = await this.countDocuments({ isRead: false });
  
  return {
    total,
    unread,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
