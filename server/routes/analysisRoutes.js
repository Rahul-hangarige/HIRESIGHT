import express from 'express';
import {
  createAnalysis,
  getAnalysisByCandidate,
  getAnalysisById,
  updateRecruiterNotes,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate / trigger analysis - POST endpoint
router.post('/', protect, async (req, res) => {
  const { candidateId } = req.body;
  req.params.candidateId = candidateId;
  createAnalysis(req, res);
});

// Generate / trigger analysis - also support parameterized route
router.post('/:candidateId', protect, createAnalysis);

// Get analysis for candidate
router.get('/candidate/:candidateId', protect, getAnalysisByCandidate);

// Get analysis details by Analysis ID
router.get('/:id', protect, getAnalysisById);

// Update notes on analysis
router.put('/:id/notes', protect, updateRecruiterNotes);

export default router;
