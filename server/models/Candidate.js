import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the candidate name'],
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    resume: {
      filename: String,
      originalname: String,
      path: String,
      mimetype: String,
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    profileText: {
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

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
