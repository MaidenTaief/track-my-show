import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn('Firebase Admin SDK initialization failed:', error);
  }
}

export { admin }; 