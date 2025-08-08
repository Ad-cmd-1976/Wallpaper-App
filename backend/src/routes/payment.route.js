import express from 'express';
import { protectedRoute } from '../middleware/protected.middleware.js';
import { verifyPayment, createOrder, createPlusUser, verifyPlusUser } from '../controllers/payment.controller.js';

const router=express.Router();

router.post('/order/plus-user', protectedRoute, createPlusUser);
router.post('/order/:imageId', protectedRoute, createOrder);
router.post('/verify/plus-user', protectedRoute, verifyPlusUser);
router.post('/verify', protectedRoute, verifyPayment);

export default router;