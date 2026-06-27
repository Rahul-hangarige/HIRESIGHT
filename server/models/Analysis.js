import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      unique: true, // Only one analysis report per candidate
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendation: {
      type: String,
      required: true,
      enum: ['Highly Recommended', 'Recommended', 'Consider', 'Not Recommended'],
    },
    recommendationExplanation: {
      type: String,
      default: '',
    },
    executiveSummary: {
      type: String,
      required: true,
    },
    skillsAnalysis: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      leadership: { type: [String], default: [] },
      missing: { type: [String], default: [] },
    },
    careerAnalysis: {
      yearsOfExperience: { type: Number, default: 0 },
      careerGrowth: { type: String, default: '' },
      promotions: { type: String, default: '' },
      jobStability: { type: String, default: '' },
      industryExperience: { type: [String], default: [] },
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvementAreas: {
      type: [String],
      default: [],
    },
    interviewQuestions: {
      technical: { type: [String], default: [] },
      behavioral: { type: [String], default: [] },
      leadership: { type: [String], default: [] },
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
