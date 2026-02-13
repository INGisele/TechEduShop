const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.cors.origin,
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || config.env === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// HTTP request logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  // Custom morgan format for production
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin routes in development
    return config.env === 'development' && req.path.startsWith('/api/v1/contacts/');
  }
});

// Apply rate limiter to public routes
app.use('/api/v1/contacts', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1/contacts', contactRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to TechEduShop API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      contacts: '/api/v1/contacts'
    }
  });
});

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
