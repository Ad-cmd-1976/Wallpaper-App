import express from 'express';
import { createPurchase, getPurchasedList } from '../controllers/purchase.controller.js';
import { protectedRoute } from '../middleware/protected.middleware.js';

const router=express.Router();

router.post('/:imageId', protectedRoute, createPurchase);
router.get('/list', protectedRoute, getPurchasedList);

export default router;