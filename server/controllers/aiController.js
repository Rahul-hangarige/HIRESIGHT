import multer from 'multer';
import { extractTextFromBuffer } from '../utils/textExtractor.js';
import { analyzeCandidateData } from '../services/aiService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const inferName = (text, fallback) => {
  const cleaned = (text || '').replace(/\s+/g, ' ').trim();
  const lines = cleaned.split(/\n|\r/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.length < 60 && /[A-Z][a-z]+/.test(line)) {
      if (!/(resume|cv|linkedin|profile|contact|summary|experience|education)/i.test(line)) {
        return line;
      }
    }
  }

  if (fallback) {
    const slug = fallback
      .replace(/https?:\/\/|www\.|linkedin\.com\/in\//gi, '')
      .replace(/\.(pdf|docx?)$/i, '')
      .replace(/[-_/]+/g, ' ')
      .trim();

    if (slug) {
      return slug
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
  }

  return 'Candidate';
};

const inferTitle = (text) => {
  const cleaned = (text || '').toLowerCase();
  if (/software engineer|developer|full stack|backend|frontend|engineer|programmer|architect/i.test(cleaned)) {
    return 'Software Engineer';
  }
  if (/product manager|product owner|product lead|product operations/i.test(cleaned)) {
    return 'Product Manager';
  }
  if (/ux designer|ui designer|designer|creative/i.test(cleaned)) {
    return 'Designer';
  }
  if (/marketing|growth|brand|content|campaign/i.test(cleaned)) {
    return 'Marketing Professional';
  }
  if (/data scientist|data analyst|analyst|operations|manager/i.test(cleaned)) {
    return 'Operations or Data Professional';
  }
  return 'Professional';
};

const extractLinkedInProfileText = async (linkedinUrl) => {
  try {
    const response = await fetch(linkedinUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const html = await response.text();
    const plainText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (plainText.length > 200) {
      return plainText.slice(0, 12000);
    }
  } catch (error) {
    console.warn('LinkedIn profile fetch failed, falling back to URL input:', error.message);
  }

  return `LinkedIn profile URL: ${linkedinUrl}`;
};

const flattenQuestions = (interviewQuestions) => {
  if (Array.isArray(interviewQuestions)) {
    return interviewQuestions;
  }

  if (interviewQuestions && typeof interviewQuestions === 'object') {
    return [
      ...(interviewQuestions.technical || []),
      ...(interviewQuestions.behavioral || []),
      ...(interviewQuestions.leadership || []),
    ];
  }

  return [];
};

const formatAnalysis = (candidate, analysisData) => {
  const skills = [
    ...(analysisData?.skillsAnalysis?.technical || []),
    ...(analysisData?.skillsAnalysis?.soft || []),
    ...(analysisData?.skillsAnalysis?.leadership || []),
  ].slice(0, 8);

  const highlights = [
    analysisData?.careerAnalysis?.promotions || 'Career progression is clearly visible.',
    analysisData?.careerAnalysis?.careerGrowth || 'Consistent growth across recent roles.',
    analysisData?.careerAnalysis?.jobStability || 'The profile shows solid professional stability.',
  ].slice(0, 3);

  const recommendation = analysisData?.recommendation
    ? `${analysisData.recommendation}${analysisData.recommendationExplanation ? ` — ${analysisData.recommendationExplanation}` : ''}`
    : 'Consider';

  return {
    candidateName: candidate.name || 'Candidate',
    overallScore: analysisData?.score || 0,
    executiveSummary: analysisData?.executiveSummary || 'A detailed profile analysis will appear here.',
    skills,
    strengths: analysisData?.strengths || [],
    improvements: analysisData?.improvementAreas || [],
    highlights,
    recommendation,
    interviewQuestions: flattenQuestions(analysisData?.interviewQuestions || []),
  };
};

export const analyzeProfile = async (req, res) => {
  try {
    const linkedinUrl = (req.body.linkedinUrl || '').trim();
    const uploadFile = req.file;

    if (!uploadFile && !linkedinUrl) {
      return res.status(400).json({ success: false, error: 'Please upload a resume or provide a LinkedIn URL.' });
    }

    let profileText = '';
    let candidateName = 'Candidate';
    let title = 'Professional';

    if (uploadFile) {
      profileText = await extractTextFromBuffer(uploadFile.buffer, uploadFile.mimetype);
      candidateName = inferName(profileText, uploadFile.originalname);
      title = inferTitle(profileText);
    } else {
      profileText = await extractLinkedInProfileText(linkedinUrl);
      candidateName = inferName(profileText, linkedinUrl);
      title = inferTitle(profileText);
    }

    const candidate = {
      name: candidateName,
      title,
      email: '',
      phone: '',
      linkedinUrl: linkedinUrl || '',
      profileText,
    };

    const analysisData = await analyzeCandidateData(candidate);
    const analysis = formatAnalysis(candidate, analysisData);

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error('AI analysis failed:', error);
    res.status(500).json({ success: false, error: error.message || 'Unable to generate analysis.' });
  }
};

export { upload };
