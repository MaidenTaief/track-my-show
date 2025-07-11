import express from 'express';
import { OrganizerController } from '../controllers/OrganizerController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';
// import { validateOrganizerCreation } from '../middleware/validationMiddleware'; // Placeholder for validation

const router = express.Router();
const organizerController = new OrganizerController();

// Admin routes (require authentication and admin role)
router.get('/', authMiddleware, requireRole('admin'), organizerController.getOrganizers);
router.get('/categories', organizerController.getOrganizerCategories);
router.get('/:id', authMiddleware, organizerController.getOrganizerById);
// Add validation middleware here when ready
router.post('/', authMiddleware, requireRole('admin'), /*validateOrganizerCreation,*/ organizerController.createOrganizer);
router.put('/:id', authMiddleware, requireRole('admin'), organizerController.updateOrganizer);
router.delete('/:id', authMiddleware, requireRole('admin'), organizerController.deleteOrganizer);

// Admin-only verification routes
router.patch('/:id/status', authMiddleware, requireRole('admin'), organizerController.updateOrganizerStatus);
router.patch('/:id/verification', authMiddleware, requireRole('admin'), organizerController.updateOrganizerVerification);

// Organizer management routes (organizer can manage their own)
router.get('/:id/shows', authMiddleware, organizerController.getOrganizerShows);
router.get('/:id/stats', authMiddleware, organizerController.getOrganizerStats);

// Public routes (no authentication required)
router.get('/public/verified', organizerController.getVerifiedOrganizers);
router.get('/slug/:slug', organizerController.getOrganizerBySlug);

// Temporary debug endpoint for Firestore connectivity
router.get('/debug/firestore', async (req, res) => {
  try {
    const { db } = require('../config/firebase');
    console.log('Debug: db instance exists:', !!db);
    if (db) {
      console.log('Debug: Testing Firestore write...');
      const testDoc = await db.collection('organizers').add({
        test: true,
        timestamp: new Date()
      });
      console.log('Debug: Test write successful, ID:', testDoc.id);
      res.json({ success: true, message: 'Firestore working', id: testDoc.id });
    } else {
      res.json({ success: false, message: 'Firestore not available' });
    }
  } catch (error) {
    console.error('Debug: Firestore error:', error);
    res.json({ success: false, error: error.message });
  }
});

export default router; 