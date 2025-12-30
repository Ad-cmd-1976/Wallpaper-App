import express from "express";
import { signup, login, logout, getProfile, refreshToken, forgetPassword, resetPassword } from '../controllers/auth.controller.js'
import { protectedRoute } from "../middleware/protected.middleware.js";
const router=express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protectedRoute, getProfile);
router.post('/refresh', refreshToken);

export default router;