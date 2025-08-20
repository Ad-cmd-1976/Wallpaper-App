import express from 'express';
import { protectedRoute, checkSubscription } from '../middleware/protected.middleware.js';
import { verifyPayment, createOrder, createPlusUser, verifyPlusUser } from '../controllers/payment.controller.js';

const router=express.Router();

router.post('/order/plus-user', protectedRoute, checkSubscription, createPlusUser);
router.post('/order/:imageId', protectedRoute, createOrder);
router.post('/verify/plus-user', protectedRoute, verifyPlusUser);
router.post('/verify', protectedRoute, verifyPayment);

export default router;