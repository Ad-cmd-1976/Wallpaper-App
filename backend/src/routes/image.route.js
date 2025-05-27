import express from 'express';
import { getImages, searchImages } from '../controllers/image.controller.js';

const router=express.Router();

router.get('/getImages', getImages);
router.get('/search', searchImages);

export default router;