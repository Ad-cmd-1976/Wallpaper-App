import express from "express";
import { signup, login, logout, getProfile } from '../controllers/auth.controller.js'
import { protectedRoute } from "../middleware/protected.middleware.js";
const router=express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/profile', protectedRoute, getProfile);

export default router;