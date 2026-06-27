import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Printer,
  BrainCircuit,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileQuestion,
  Save,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock,
  User
} from 'lucide-react';

const AnalysisReport = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Recruiter notes states
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveStatus, setSaveStatus] = useState('All changes saved');
  const typingTimeoutRef = useRef(null);

  const fetchAnalysis = async () => {
    try {
      // Endpoint to get analysis by candidate ID
      const res = await axios.get(`/api/analyses/candidate/${id}`);
      if (res.data && res.data.success) {
        setAnalysis(res.data.analysis);
        setNotes(res.data.analysis.recruiterNotes || '');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.response?.data?.error || 'Failed to retrieve AI analysis report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const saveNotesToBackend = async (currentNotes) => {
    if (!analysis) return;
    setSavingNotes(true);
    setSaveStatus('Saving notes...');
    try {
      const res = await axios.put(`/api/analyses/${analysis._id}/notes`, { notes: currentNotes });
      if (res.data && res.data.success) {
        setSaveStatus('Notes saved successfully');
        setTimeout(() => setSaveStatus('All changes saved'), 2000);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
      setSaveStatus('Error saving notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    setSaveStatus('Typing...');

    // Debounce backend save
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      saveNotesToBackend(val);
    }, 1500); // Wait 1.5 seconds after typing stops to auto-save
  };

  const handleBlurSave = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    saveNotesToBackend(notes);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        <p className="text-neutral-400 text-sm">Compiling intelligence report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm max-w-xl mx-auto my-12">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base">Report Not Generated</h4>
            <p className="mt-1 leading-relaxed">{error}</p>
            <div className="mt-4 flex space-x-3">
              <Link
                to={`/candidates/${id}`}
                className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Go to Candidate Profile
              </Link>
              <Link
                to="/candidates"
                className="border border-neutral-200 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Back to Pipeline
              </Link>
            </div>
          </div>
        </div>
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
      <span className={`px-4 py-2 text-sm font-extrabold rounded-full border shadow-2xs ${styles[rec] || 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
        {rec}
      </span>
    );
  };

  return (
    <div className="space-y-8 print-container animate-fade-in">
      {/* Header and PDF triggers */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-neutral-200 dark:border-dark-border pb-6 no-print">
        <div>
          <Link
            to={`/candidates/${id}`}
            className="inline-flex items-center space-x-2 text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 font-semibold group mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Candidate profile</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
            AI Candidate Assessment
          </h1>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center space-x-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-bold text-sm px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Export Report PDF</span>
        </button>
      </div>

      {/* Main Grid: Info card and analysis results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Score and recommendation summary */}
        <div className="space-y-6 lg:col-span-1">
          {/* Main Score panel */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs flex flex-col items-center text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-6">Fit Assessment</h3>
            
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center bg-primary-50 dark:bg-primary-950/20 rounded-full border border-primary-200/50 dark:border-primary-900/20 shadow-inner mb-6">
              <div className="text-center">
                <span className="text-4xl font-extrabold font-display bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {analysis.score}
                </span>
                <span className="text-xs text-neutral-400 block mt-0.5 font-medium">out of 100</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Recommendation</span>
              <div className="flex justify-center">{getRecommendationBadge(analysis.recommendation)}</div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs font-medium">
              {analysis.recommendationExplanation || 'The evaluation score is computed based on work history, tech skills alignment, and role fit.'}
            </p>
          </div>

          {/* Quick stats on experience */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs space-y-4.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-dark-border pb-3 mb-2">
              Career Timeline Stats
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Clock className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400 block text-xs">Total Experience</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {analysis.careerAnalysis?.yearsOfExperience || 0} years
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400 block text-xs">Career Growth</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {analysis.careerAnalysis?.careerGrowth || 'Steady growth'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400 block text-xs">Promotions History</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium font-sans">
                    {analysis.careerAnalysis?.promotions || 'No promotion logs parsed'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400 block text-xs">Job Stability</span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                    {analysis.careerAnalysis?.jobStability || 'Stable tenure'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Report sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Summary */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
            <h3 className="text-lg font-bold font-display border-b border-neutral-100 dark:border-dark-border pb-3 mb-4 flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              <span>Executive Summary</span>
            </h3>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-sans">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* Skills Matrix */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
            <h3 className="text-lg font-bold font-display border-b border-neutral-100 dark:border-dark-border pb-3 mb-4">
              Skills Matrix
            </h3>
            
            <div className="space-y-5">
              {/* Technical */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">Technical Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsAnalysis?.technical?.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 rounded-md">
                      {skill}
                    </span>
                  )) || <span className="text-xs text-neutral-400 font-medium">No skills detected</span>}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">Soft & Interpersonal Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsAnalysis?.soft?.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900/30 rounded-md">
                      {skill}
                    </span>
                  )) || <span className="text-xs text-neutral-400">None detected</span>}
                </div>
              </div>

              {/* Leadership */}
              {analysis.skillsAnalysis?.leadership && analysis.skillsAnalysis.leadership.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">Leadership & Ownership</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skillsAnalysis.leadership.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps/Missing Skills */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">Potential Skill Gaps</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsAnalysis?.missing?.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-semibold bg-neutral-50 text-neutral-500 border border-dashed border-neutral-300 dark:bg-neutral-900/10 dark:text-neutral-400 dark:border-neutral-800 rounded-md">
                      {skill}
                    </span>
                  )) || <span className="text-xs text-neutral-400">None identified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
              <h4 className="text-md font-bold font-display text-emerald-600 dark:text-emerald-400 mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Key Strengths</span>
              </h4>
              <ul className="space-y-3 text-sm">
                {analysis.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-neutral-700 dark:text-neutral-300 font-sans">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{str}</span>
                  </li>
                )) || <li className="text-neutral-400 text-xs">No analysis compiled.</li>}
              </ul>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
              <h4 className="text-md font-bold font-display text-amber-600 dark:text-amber-400 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Areas for Development</span>
              </h4>
              <ul className="space-y-3 text-sm">
                {analysis.improvementAreas?.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-neutral-700 dark:text-neutral-300 font-sans">
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">⚠</span>
                    <span>{imp}</span>
                  </li>
                )) || <li className="text-neutral-400 text-xs">No details compiled.</li>}
              </ul>
            </div>
          </div>

          {/* Interview Questions */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs space-y-5">
            <h3 className="text-lg font-bold font-display border-b border-neutral-100 dark:border-dark-border pb-3 flex items-center space-x-2">
              <FileQuestion className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span>Recommended Interview Questions</span>
            </h3>

            {/* Technical questions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Technical & Execution</h4>
              <div className="space-y-2">
                {analysis.interviewQuestions?.technical?.map((q, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-dark-border rounded-lg text-sm flex items-start space-x-2.5 font-sans leading-relaxed">
                    <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0">Q{idx+1}</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral questions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Behavioral & Collaboration</h4>
              <div className="space-y-2">
                {analysis.interviewQuestions?.behavioral?.map((q, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-dark-border rounded-lg text-sm flex items-start space-x-2.5 font-sans leading-relaxed">
                    <span className="font-bold text-violet-600 dark:text-violet-400 shrink-0">Q{idx+1}</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership questions */}
            {analysis.interviewQuestions?.leadership && analysis.interviewQuestions.leadership.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Leadership & Vision</h4>
                <div className="space-y-2">
                  {analysis.interviewQuestions.leadership.map((q, idx) => (
                    <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-dark-border rounded-lg text-sm flex items-start space-x-2.5 font-sans leading-relaxed">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Q{idx+1}</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recruiter Notes Block */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs no-print">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-dark-border pb-3 mb-4">
              <h3 className="text-lg font-bold font-display flex items-center space-x-2">
                <Save className="w-5 h-5 text-neutral-400" />
                <span>Recruiter Assessment Notes</span>
              </h3>
              
              {/* Auto-save notification indicator */}
              <span className="text-xs text-neutral-400 dark:text-neutral-500 italic font-semibold flex items-center space-x-1">
                {savingNotes && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 inline" />}
                <span>{saveStatus}</span>
              </span>
            </div>
            
            <textarea
              rows={5}
              placeholder="Type your notes here... (Notes are saved automatically as you type)"
              value={notes}
              onChange={handleNotesChange}
              onBlur={handleBlurSave}
              className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-sans leading-relaxed"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
