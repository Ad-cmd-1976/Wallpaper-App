import express from 'express';
import { downloadImage, getImages, searchImages, uploadImageData } from '../controllers/image.controller.js';
import { protectedRoute, adminRoute } from '../middleware/protected.middleware.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);
router.get('/download', protectedRoute, downloadImage);
router.post('/upload', protectedRoute, adminRoute, uploadImageData);

export default router;