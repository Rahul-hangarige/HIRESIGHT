import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  Target,
  Briefcase,
  Award,
  TrendingUp,
  Download,
  ArrowRight
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    linkedinUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateData.name) {
      setError('Please enter candidate name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('name', candidateData.name);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('title', candidateData.title);
      formData.append('linkedinUrl', candidateData.linkedinUrl);
      if (file) {
        formData.append('resume', file);
      }

      const res = await axios.post('/api/candidates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      if (res.data && res.data.success) {
        const candidateId = res.data.candidate._id;
        // Trigger analysis
        const analysisRes = await axios.post(`/api/analyses`, {
          candidateId,
          analysisType: 'full'
        });

        if (analysisRes.data && analysisRes.data.success) {
          setAnalysis(analysisRes.data.analysis);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-bg dark:to-neutral-900 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Analysis Complete
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Comprehensive AI-powered resume insights for {analysis.candidateName}
              </p>
            </div>
            <button
              onClick={() => {
                setAnalysis(null);
                setCandidateData({ name: '', email: '', phone: '', title: '', linkedinUrl: '' });
                setFile(null);
              }}
              className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Analyze Another
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Overall Score</span>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {analysis.overallScore?.toFixed(1) || 'N/A'}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Based on comprehensive evaluation
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Experience</span>
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {analysis.experienceLevel || 'N/A'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Years of professional background
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Skill Match</span>
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {analysis.skillMatch?.toFixed(1) || 'N/A'}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Against market demands
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Recommendation</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {analysis.recommendation || 'N/A'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Hiring decision guidance
              </p>
            </div>
          </div>

          {/* Detailed Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths?.map((strength, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">•</span>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{strength}</span>
                  </li>
                )) || <p className="text-slate-500 text-sm">No data available</p>}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Opportunities</h3>
              </div>
              <ul className="space-y-2">
                {analysis.improvements?.map((improvement, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">→</span>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{improvement}</span>
                  </li>
                )) || <p className="text-slate-500 text-sm">No data available</p>}
              </ul>
            </div>

            {/* Key Skills */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {skill}
                  </span>
                )) || <p className="text-slate-500 text-sm">No data available</p>}
              </div>
            </div>
          </div>

          {/* Summary Report */}
          {analysis.detailReport && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Executive Summary</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.detailReport}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate('/candidates')}
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View All Candidates
            </button>
            <button
              onClick={() => {
                setAnalysis(null);
                setCandidateData({ name: '', email: '', phone: '', title: '', linkedinUrl: '' });
                setFile(null);
              }}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Analyze Another Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-bg dark:to-neutral-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Resume Analyzer
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload and analyze resumes with AI-powered insights. Get instant feedback on candidate qualifications, skills, and fit.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Candidate Information */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Candidate Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={candidateData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={candidateData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={candidateData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Current Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={candidateData.title}
                    onChange={handleInputChange}
                    placeholder="Senior Software Engineer"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={candidateData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/johndoe"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Upload Resume</h2>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDragDrop}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold">
                        {file ? file.name : 'Drag and drop your resume here'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        or click to browse (PDF, DOC, DOCX, TXT - Max 10MB)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploading...</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !candidateData.name}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Instant Analysis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get AI-powered insights in seconds with comprehensive candidate evaluation
            </p>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Skill Matching</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Identify skill gaps and alignment with job requirements automatically
            </p>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Smart Recommendations</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get actionable hiring recommendations based on comprehensive evaluation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
