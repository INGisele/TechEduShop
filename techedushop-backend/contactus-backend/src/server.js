const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const connectDB = require('./config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  logger.info(`
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║   🚀 TechEduShop API Server Running               ║
    ║                                                   ║
    ║   Environment: ${config.env.padEnd(36)}║
    ║   Port: ${PORT.toString().padEnd(43)}║
    ║   URL: http://localhost:${PORT.toString().padEnd(26)}║
    ║                                                   ║
    ║   API Endpoints:                                  ║
    ║   • POST   /api/v1/contacts                       ║
    ║   • GET    /api/v1/contacts                       ║
    ║   • GET    /api/v1/contacts/:id                   ║
    ║   • PATCH  /api/v1/contacts/:id                   ║
    ║   • DELETE /api/v1/contacts/:id                   ║
    ║   • GET    /api/v1/contacts/stats                 ║
    ║                                                   ║
    ║   Health Check: /health                           ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

module.exports = server;
