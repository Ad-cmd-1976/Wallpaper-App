import express from 'express';
import { downloadImage, getImages, searchImages, uploadImage } from '../controllers/image.controller.js';
import { protectedRoute, adminRoute } from '../middleware/protected.middleware.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);
router.get('/download/:publicId', protectedRoute, downloadImage);
router.post('/upload', protectedRoute, adminRoute, uploadImage);

export default router;