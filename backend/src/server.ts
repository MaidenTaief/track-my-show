import dotenv from 'dotenv';
import app from './app';
import { Logger } from './utils/Logger';
import { GoogleDriveService } from './services/GoogleDriveService';
import * as admin from 'firebase-admin';

dotenv.config();

const PORT = process.env.PORT || 3002;

// Firebase Admin SDK initialization
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // For development, you can use the default credentials
      // In production, you should use a service account key
      if (process.env.NODE_ENV === 'production') {
        // Production: Use service account key
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Development: Try to use service account key if available, otherwise skip
        try {
          const serviceAccount = require('./serviceAccountKey.json');
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          Logger.info('Firebase Admin SDK initialized successfully with service account');
        } catch (serviceAccountError) {
          Logger.warn('Service account key not found. Firebase will not be available.');
          Logger.warn('To enable Firebase, download serviceAccountKey.json from Firebase Console');
          Logger.warn('and place it in the backend/src/ directory');
        }
      }
    }
  } catch (error) {
    Logger.error('Firebase Admin SDK initialization error:', error);
    // Don't exit the process, just log the error
    // The app can still work without Firebase in development
  }
};

async function startServer() {
  try {
    // Initialize Firebase Admin SDK
    initializeFirebase();

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
