import Candidate from '../models/Candidate.js';
import Analysis from '../models/Analysis.js';
import { extractTextFromBuffer } from '../utils/textExtractor.js';
import fs from 'fs';

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
export const getCandidates = async (req, res) => {
  try {
    const { search, title } = req.query;
    let query = { createdBy: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    res.json({ success: true, candidate });
  } catch (error) {
    console.error('Get candidate details error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private
export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, title, linkedinUrl, profileText } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Candidate name is required' });
    }

    let resumeData = undefined;
    let finalProfileText = profileText || '';

    if (req.file) {
      resumeData = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path.replace(/\\/g, '/'), // Windows path normalizer
        mimetype: req.file.mimetype,
      };

      // Read file buffer from disk to parse text
      const buffer = fs.readFileSync(req.file.path);
      const extractedText = await extractTextFromBuffer(buffer, req.file.mimetype);
      if (extractedText) {
        finalProfileText = (finalProfileText + '\n\n' + extractedText).trim();
      }
    }

    const candidate = await Candidate.create({
      name,
      email: email || '',
      phone: phone || '',
      title: title || '',
      linkedinUrl: linkedinUrl || '',
      profileText: finalProfileText,
      resume: resumeData,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, candidate });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const { name, email, phone, title, linkedinUrl, profileText } = req.body;

    candidate.name = name || candidate.name;
    candidate.email = email !== undefined ? email : candidate.email;
    candidate.phone = phone !== undefined ? phone : candidate.phone;
    candidate.title = title !== undefined ? title : candidate.title;
    candidate.linkedinUrl = linkedinUrl !== undefined ? linkedinUrl : candidate.linkedinUrl;
    candidate.profileText = profileText !== undefined ? profileText : candidate.profileText;

    if (req.file) {
      // Clean up old resume if it exists
      if (candidate.resume && candidate.resume.path) {
        try {
          if (fs.existsSync(candidate.resume.path)) {
            fs.unlinkSync(candidate.resume.path);
          }
        } catch (err) {
          console.warn('Could not delete old resume file:', err.message);
        }
      }

      candidate.resume = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path.replace(/\\/g, '/'),
        mimetype: req.file.mimetype,
      };

      const buffer = fs.readFileSync(req.file.path);
      const extractedText = await extractTextFromBuffer(buffer, req.file.mimetype);
      if (extractedText) {
        candidate.profileText = (candidate.profileText + '\n\n' + extractedText).trim();
      }
    }

    const updatedCandidate = await candidate.save();
    res.json({ success: true, candidate: updatedCandidate });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    // Clean up uploaded resume file
    if (candidate.resume && candidate.resume.path) {
      try {
        if (fs.existsSync(candidate.resume.path)) {
          fs.unlinkSync(candidate.resume.path);
        }
      } catch (err) {
        console.warn('Could not delete resume file on candidate removal:', err.message);
      }
    }

    // Remove analyses associated with candidate
    await Analysis.deleteMany({ candidate: candidate._id });

    // Remove the candidate
    await Candidate.deleteOne({ _id: candidate._id });

    res.json({ success: true, message: 'Candidate and analyses removed successfully' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
