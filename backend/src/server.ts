import dotenv from 'dotenv';
import app from './app';
import { Logger } from './utils/Logger';
import { GoogleDriveService } from './services/GoogleDriveService';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize Google Drive service
    await GoogleDriveService.initialize();
    Logger.info('Google Drive service initialized successfully');

    // Start the server
    app.listen(PORT, () => {
      Logger.info(`🚀 Server running on port ${PORT}`);
      Logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      Logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
      Logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    Logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
