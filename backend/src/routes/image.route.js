import express from 'express';
import { downloadImage, getImages, searchImages } from '../controllers/image.controller.js';
import { protectedRoute } from '../middleware/protected.middleware.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);
router.get('/download/:publicId', protectedRoute, downloadImage);

export default router;