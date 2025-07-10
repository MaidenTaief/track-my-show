import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GoogleDriveService } from '../services/GoogleDriveService';
import { authMiddleware, requireRole, User } from '../middleware/authMiddleware';
import { validateEmail } from '../utils/validators';
import { Logger } from '../utils/Logger';
import { ApiResponse } from '../utils/ApiResponse';

const router = express.Router();

// ... (full code as provided in your backend snippet for authRoutes)

export default router; 