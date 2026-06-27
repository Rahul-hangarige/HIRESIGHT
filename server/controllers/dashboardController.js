import Candidate from '../models/Candidate.js';
import Analysis from '../models/Analysis.js';

// @desc    Get dashboard metrics & charting analytics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Total Candidates count
    const totalCandidates = await Candidate.countDocuments({ createdBy: userId });

    // 2. Total Analyses count
    const totalAnalyses = await Analysis.countDocuments({ createdBy: userId });

    // Fetch all analyses for active recruiter to compute distributions
    const analyses = await Analysis.find({ createdBy: userId }).populate('candidate');
    
    let totalScore = 0;
    let recommendedCount = 0;
    
    const recsBreakdown = {
      'Highly Recommended': 0,
      'Recommended': 0,
      'Consider': 0,
      'Not Recommended': 0
    };

    const skillCounts = {};
    const expLevels = {
      '0-2 yrs (Junior)': 0,
      '3-5 yrs (Mid)': 0,
      '6+ yrs (Senior/Lead)': 0
    };

    analyses.forEach(ana => {
      totalScore += ana.score;
      if (ana.recommendation === 'Highly Recommended' || ana.recommendation === 'Recommended') {
        recommendedCount++;
      }
      
      if (recsBreakdown[ana.recommendation] !== undefined) {
        recsBreakdown[ana.recommendation]++;
      }

      // Collect skills frequency
      if (ana.skillsAnalysis && ana.skillsAnalysis.technical) {
        ana.skillsAnalysis.technical.forEach(skill => {
          const formattedSkill = skill.trim();
          if (formattedSkill) {
            skillCounts[formattedSkill] = (skillCounts[formattedSkill] || 0) + 1;
          }
        });
      }

      // Collect experience distribution
      const yrs = (ana.careerAnalysis && ana.careerAnalysis.yearsOfExperience) || 0;
      if (yrs <= 2) {
        expLevels['0-2 yrs (Junior)']++;
      } else if (yrs <= 5) {
        expLevels['3-5 yrs (Mid)']++;
      } else {
        expLevels['6+ yrs (Senior/Lead)']++;
      }
    });

    const averageScore = totalAnalyses > 0 ? Math.round(totalScore / totalAnalyses) : 0;

    // Format top 8 technical skills for Recharts Bar Chart
    const skillDistribution = Object.entries(skillCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Format experience breakdown for Recharts Pie Chart
    const experienceDistribution = Object.entries(expLevels).map(([name, value]) => ({ name, value }));

    // Format recommendation breakdown for Recharts Pie Chart
    const recommendationDistribution = Object.entries(recsBreakdown).map(([name, value]) => ({ name, value }));

    // Fetch recent 5 candidates added
    const recentCandidates = await Candidate.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Format recent analyses list for dashboard logs
    const recentAnalyses = analyses
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(ana => ({
        _id: ana._id,
        candidateId: ana.candidate ? ana.candidate._id : null,
        candidateName: ana.candidate ? ana.candidate.name : 'Deleted Candidate',
        candidateTitle: ana.candidate ? ana.candidate.title : 'Professional',
        score: ana.score,
        recommendation: ana.recommendation,
        createdAt: ana.createdAt
      }));

    res.json({
      success: true,
      stats: {
        totalCandidates,
        totalAnalyses,
        averageScore,
        recommendedCount,
        recommendationDistribution,
        skillDistribution,
        experienceDistribution,
        recentCandidates,
        recentAnalyses
      }
    });
  } catch (error) {
    console.error('Get dashboard statistics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
