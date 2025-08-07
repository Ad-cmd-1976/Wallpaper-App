import express from 'express';
import { protectedRoute } from '../middleware/protected.middleware.js';
import { verifyPayment, createOrder } from '../controllers/payment.controller.js';

const router=express.Router();

router.post('/order/:imageId', protectedRoute, createOrder);
router.post('/verify', protectedRoute, verifyPayment);

export default router;