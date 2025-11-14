import express from 'express';
import {
    getAtvModels,
    updateAtvModels
} from '../controllers/atvController.js';

// NOTE: You will need to import your admin/auth middleware here later
// import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route: /api/atvs

// @route GET /api/atvs (Public) - Fetch all ATV models
router.get('/', getAtvModels);

// @route PUT /api/atvs (Private/Admin) - Update all ATV models
// NOTE: Add your authentication middleware (e.g., protect, admin) before updateAtvModels
router.put('/', updateAtvModels); 

export default router;