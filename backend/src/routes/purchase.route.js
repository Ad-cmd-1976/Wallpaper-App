import express from 'express';
import { createPurchase } from '../controllers/purchase.controller.js';
import { protectedRoute } from '../middleware/protected.middleware.js';

const router=express.Router();

router.post('/:imageId', protectedRoute, createPurchase);

export default router;