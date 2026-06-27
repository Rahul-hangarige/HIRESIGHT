import express from 'express';
import { analyzeProfile, upload } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', upload.single('resume'), analyzeProfile);

export default router;
