import Candidate from '../models/Candidate.js';
import Analysis from '../models/Analysis.js';
import { analyzeCandidateData } from '../services/aiService.js';

// @desc    Generate and save AI analysis for a candidate
// @route   POST /api/analyses/:candidateId
// @access  Private
export const createAnalysis = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findOne({
      _id: candidateId,
      createdBy: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    // Trigger AI analysis / mock fallback
    const analysisData = await analyzeCandidateData(candidate);

    // Check if an analysis already exists for this candidate
    let analysis = await Analysis.findOne({ candidate: candidateId });

    if (analysis) {
      // Update existing
      analysis.score = analysisData.score;
      analysis.recommendation = analysisData.recommendation;
      analysis.recommendationExplanation = analysisData.recommendationExplanation;
      analysis.executiveSummary = analysisData.executiveSummary;
      analysis.skillsAnalysis = analysisData.skillsAnalysis;
      analysis.careerAnalysis = analysisData.careerAnalysis;
      analysis.strengths = analysisData.strengths;
      analysis.improvementAreas = analysisData.improvementAreas;
      analysis.interviewQuestions = analysisData.interviewQuestions;
      // Note: we preserve the existing recruiterNotes when re-running analysis
      await analysis.save();
    } else {
      // Create new
      analysis = await Analysis.create({
        candidate: candidateId,
        score: analysisData.score,
        recommendation: analysisData.recommendation,
        recommendationExplanation: analysisData.recommendationExplanation,
        executiveSummary: analysisData.executiveSummary,
        skillsAnalysis: analysisData.skillsAnalysis,
        careerAnalysis: analysisData.careerAnalysis,
        strengths: analysisData.strengths,
        improvementAreas: analysisData.improvementAreas,
        interviewQuestions: analysisData.interviewQuestions,
        recruiterNotes: '',
        createdBy: req.user._id,
      });
    }

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error('Create analysis report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get analysis by candidate ID
// @route   GET /api/analyses/candidate/:candidateId
// @access  Private
export const getAnalysisByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Verify candidate belongs to user
    const candidate = await Candidate.findOne({
      _id: candidateId,
      createdBy: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const analysis = await Analysis.findOne({ candidate: candidateId });

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis report not found for this candidate. Click Generate Analysis.' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Get candidate analysis report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get analysis report by report ID
// @route   GET /api/analyses/:id
// @access  Private
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate('candidate');

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis report not found' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Get analysis by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update recruiter notes on analysis
// @route   PUT /api/analyses/:id/notes
// @access  Private
export const updateRecruiterNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis report not found' });
    }

    analysis.recruiterNotes = notes !== undefined ? notes : analysis.recruiterNotes;
    await analysis.save();

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Update recruiter notes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
