import express from 'express';
import { downloadImage, getImages, searchImages, uploadImageData } from '../controllers/image.controller.js';
import { protectedRoute, adminRoute, uploadMemory } from '../middleware/protected.middleware.js';
import { uploadPlusImageData } from '../controllers/image.controller.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);
router.get('/download', protectedRoute, downloadImage);
router.post('/plus-upload', protectedRoute, adminRoute, uploadMemory.single('file'), uploadPlusImageData);
router.post('/upload', protectedRoute, adminRoute, uploadImageData);

export default router;