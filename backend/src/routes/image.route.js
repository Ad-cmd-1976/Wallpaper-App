import express from 'express';
import { downloadImage, getImages, searchImages, uploadImageData, uploadPlusImageData, getPurchasedList, getPresignedUrl } from '../controllers/image.controller.js';
import { protectedRoute, adminRoute, uploadMemory } from '../middleware/protected.middleware.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);
router.get('/download', protectedRoute, downloadImage);
router.get('/list', protectedRoute, getPurchasedList);
router.post('/pre-sign', protectedRoute, adminRoute, getPresignedUrl);
router.post('/plus-upload', protectedRoute, adminRoute, uploadMemory.single('file'), uploadPlusImageData);
router.post('/upload', protectedRoute, adminRoute, uploadImageData);

export default router;