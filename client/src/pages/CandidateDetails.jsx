import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  FileText,
  BrainCircuit,
  Calendar,
  AlertCircle,
  Loader2,
  Edit2,
  Save,
  X,
  Eye,
  FileCheck
} from 'lucide-react';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editProfileText, setEditProfileText] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Analysis generation state
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchCandidateAndReport = async () => {
    try {
      // 1. Fetch Candidate Details
      const candRes = await axios.get(`/api/candidates/${id}`);
      if (candRes.data && candRes.data.success) {
        setCandidate(candRes.data.candidate);
        
        // Prep edit states
        const c = candRes.data.candidate;
        setEditName(c.name || '');
        setEditEmail(c.email || '');
        setEditPhone(c.phone || '');
        setEditTitle(c.title || '');
        setEditLinkedin(c.linkedinUrl || '');
        setEditProfileText(c.profileText || '');
      }

      // 2. Fetch Analysis (might return 404 if not run yet)
      try {
        const anaRes = await axios.get(`/api/analyses/candidate/${id}`);
        if (anaRes.data && anaRes.data.success) {
          setAnalysis(anaRes.data.analysis);
        }
      } catch (err) {
        // Analysis not run yet (standard case)
        setAnalysis(null);
      }
    } catch (err) {
      console.error('Error fetching candidate/report:', err);
      setError('Could not load candidate file details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateAndReport();
  }, [id]);

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editName) return alert('Name is required.');

    setSaveLoading(true);
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('email', editEmail);
    formData.append('phone', editPhone);
    formData.append('title', editTitle);
    formData.append('linkedinUrl', editLinkedin);
    formData.append('profileText', editProfileText);
    if (editFile) {
      formData.append('resume', editFile);
    }

    try {
      const res = await axios.put(`/api/candidates/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.success) {
        setCandidate(res.data.candidate);
        setEditFile(null);
        setEditing(false);
        // Refresh analysis check
        fetchCandidateAndReport();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update candidate details.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const res = await axios.post(`/api/analyses/${id}`);
      if (res.data && res.data.success) {
        setAnalysis(res.data.analysis);
        navigate(`/candidates/${id}/report`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete AI analysis.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        <p className="text-neutral-400 text-sm">Opening candidate file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start space-x-3.5 max-w-xl mx-auto my-12">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const getRecommendationBadge = (rec) => {
    const styles = {
      'Highly Recommended': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
      'Recommended': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
      'Consider': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
      'Not Recommended': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30'
    };
    return (
      <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${styles[rec] || 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
        {rec}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link to="/candidates" className="inline-flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-semibold group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to pipeline</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Profile Details Card */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 lg:col-span-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-dark-border pb-4 mb-5">
            <h2 className="text-lg font-bold font-display">Candidate Metadata</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 border border-neutral-200 dark:border-dark-border rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleEditSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-905 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-905 dark:text-dark-text-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-905"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Replace Resume File (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 file:cursor-pointer hover:file:bg-primary-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Pasted Professional Profile Text
                </label>
                <textarea
                  rows={6}
                  value={editProfileText}
                  onChange={(e) => setEditProfileText(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm font-sans"
                />
              </div>

              <div className="flex space-x-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-all cursor-pointer dark:border-dark-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Modifications'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display fields */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xl font-display">
                  {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-display leading-tight">{candidate.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center space-x-1.5 font-medium">
                    <Briefcase className="w-4 h-4 text-neutral-400" />
                    <span>{candidate.title || 'Role not specified'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-4 border-t border-neutral-100 dark:border-dark-border text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{candidate.email || 'No email specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                  <span>{candidate.phone || 'No phone specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                  {candidate.linkedinUrl ? (
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline truncate"
                    >
                      {candidate.linkedinUrl}
                    </a>
                  ) : (
                    <span className="text-neutral-400">No LinkedIn url provided</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                  {candidate.resume ? (
                    <a
                      href={`/uploads/${candidate.resume.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <FileCheck className="w-4 h-4 mr-1 text-emerald-500" />
                      <span>{candidate.resume.originalname}</span>
                    </a>
                  ) : (
                    <span className="text-neutral-400">No resume document uploaded</span>
                  )}
                </div>
              </div>

              {/* Profile Bio panel */}
              <div className="pt-6 border-t border-neutral-100 dark:border-dark-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Raw Profile Details</h4>
                <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg p-4 max-h-72 overflow-y-auto text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans whitespace-pre-wrap">
                  {candidate.profileText ? candidate.profileText : 'No details pasted or extracted.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Screening Status Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
            <h3 className="text-lg font-bold font-display border-b border-neutral-100 dark:border-dark-border pb-3 mb-4">
              AI Evaluation Report
            </h3>

            {analysis ? (
              <div className="space-y-6 text-center">
                {/* Visual score */}
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-primary-50 dark:bg-primary-950/20 rounded-full border border-primary-200 dark:border-primary-900/20 shadow-inner">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold font-display text-primary-600 dark:text-primary-400">
                      {analysis.score}
                    </span>
                    <span className="text-xs text-neutral-400 block mt-0.5">out of 100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Hiring Recommendation</p>
                  <div>{getRecommendationBadge(analysis.recommendation)}</div>
                </div>

                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/40 rounded-lg text-xs leading-relaxed text-neutral-500 text-left border border-neutral-200 dark:border-dark-border">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Executive Summary snippet:</span>
                  <p className="line-clamp-3">{analysis.executiveSummary}</p>
                </div>

                <div className="pt-2 flex flex-col space-y-2">
                  <Link
                    to={`/candidates/${id}/report`}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md shadow-primary-500/10"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View AI Report</span>
                  </Link>

                  <button
                    onClick={handleRunAnalysis}
                    disabled={analysisLoading}
                    className="w-full flex items-center justify-center space-x-2 border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-semibold text-sm px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {analysisLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <BrainCircuit className="w-4 h-4 text-neutral-400" />
                        <span>Re-run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <BrainCircuit className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4 animate-pulse" />
                <h4 className="font-bold text-base font-display">No AI Screening Run Yet</h4>
                <p className="text-xs text-neutral-500 mt-2 max-w-[220px] mx-auto leading-relaxed">
                  Generate structured candidate reports, suitability scores, timeline details, and core questions.
                </p>

                <button
                  onClick={handleRunAnalysis}
                  disabled={analysisLoading}
                  className="mt-6 w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm px-4.5 py-2.5 rounded-lg shadow-md shadow-primary-500/10 cursor-pointer transition-colors"
                >
                  {analysisLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Screening Candidate...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4" />
                      <span>Generate AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
