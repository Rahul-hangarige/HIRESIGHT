import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Plus,
  X,
  FileText,
  Linkedin,
  Mail,
  Phone,
  Trash2,
  AlertCircle,
  Loader2,
  Briefcase,
  UserCheck
} from 'lucide-react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterTitle, setFilterTitle] = useState('');

  // Add Candidate Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formProfileText, setFormProfileText] = useState('');
  const [formFile, setFormFile] = useState(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCandidates = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterTitle) params.title = filterTitle;
      
      const res = await axios.get('/api/candidates', { params });
      if (res.data && res.data.success) {
        setCandidates(res.data.candidates);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Could not fetch candidate directory. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, filterTitle]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete candidate ${name} and their AI analysis?`)) return;
    try {
      const res = await axios.delete(`/api/candidates/${id}`);
      if (res.data && res.data.success) {
        setCandidates(candidates.filter(c => c._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete candidate');
    }
  };

  const handleFileChange = (e) => {
    setFormFile(e.target.files[0]);
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!formName) {
      return setFormError('Candidate name is required.');
    }

    setFormLoading(true);
    setFormError('');

    const formData = new FormData();
    formData.append('name', formName);
    formData.append('email', formEmail);
    formData.append('phone', formPhone);
    formData.append('title', formTitle);
    formData.append('linkedinUrl', formLinkedin);
    formData.append('profileText', formProfileText);
    if (formFile) {
      formData.append('resume', formFile);
    }

    try {
      const res = await axios.post('/api/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.success) {
        // Reset form fields
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormTitle('');
        setFormLinkedin('');
        setFormProfileText('');
        setFormFile(null);
        setModalOpen(false);
        fetchCandidates();
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to upload candidate details.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display">Candidate Directory</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Manage candidates, upload resume files, and run AI evaluations.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-lg shadow-md shadow-primary-500/10 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Filter / Search panel */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-neutral-200 dark:border-dark-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search name, title, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Filter Title */}
        <div className="w-full md:max-w-xs flex items-center space-x-2.5">
          <span className="text-xs font-semibold text-neutral-400 shrink-0">Filter Title</span>
          <select
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="block w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-800 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
          >
            <option value="">All Job Titles</option>
            <option value="Engineer">Engineers / Developers</option>
            <option value="Designer">Designers</option>
            <option value="Product">Product Management</option>
            <option value="Manager">Managers</option>
          </select>
        </div>
      </div>

      {/* Candidates List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm text-neutral-400">Loading directory...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start space-x-3.5 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-12 text-center max-w-lg mx-auto">
          <Briefcase className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold font-display">No Candidates Found</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs mx-auto">
            {search || filterTitle
              ? 'Try modifying your search queries or filter dropdown settings.'
              : 'Add candidate profiles to begin screening and running reports.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <div
              key={cand._id}
              className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-5 hover:shadow-md transition-all duration-150 flex flex-col group"
            >
              {/* Header: Avatar initials & basic names */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-full bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold font-display text-md">
                    {cand.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base hover:text-primary-600 transition-colors">
                      <Link to={`/candidates/${cand._id}`}>{cand.name}</Link>
                    </h3>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium truncate max-w-[160px] mt-0.5">
                      {cand.title || 'Role not specified'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cand._id, cand.name)}
                  className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-100"
                  title="Delete Candidate"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Middle contact stats */}
              <div className="my-5 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {cand.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{cand.email}</span>
                  </div>
                )}
                {cand.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{cand.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{cand.resume ? `Resume: ${cand.resume.originalname}` : 'No resume file uploaded'}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-neutral-100 dark:border-dark-border flex items-center justify-between mt-auto">
                {cand.linkedinUrl ? (
                  <a
                    href={cand.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-8" />
                )}

                <Link
                  to={`/candidates/${cand._id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <span>Evaluate Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Backdrop & Add Candidate Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
          />
          {/* Slide drawer */}
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-card border-l border-neutral-200 dark:border-dark-border h-full flex flex-col p-6 overflow-y-auto animate-fade-in shadow-2xl z-50">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-dark-border pb-4 mb-5">
              <h2 className="text-xl font-bold font-display">Add Candidate Profile</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-start space-x-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddCandidate} className="space-y-5 flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2834"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formLinkedin}
                    onChange={(e) => setFormLinkedin(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Upload Resume File (PDF, DOCX, TXT)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 dark:border-dark-border border-dashed rounded-lg bg-neutral-50/50 dark:bg-neutral-900/10">
                  <div className="space-y-1.5 text-center">
                    <FileText className="mx-auto h-10 w-10 text-neutral-400 dark:text-neutral-600" />
                    <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-hidden">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {formFile ? `Selected: ${formFile.name}` : 'PDF, DOCX, Word, or TXT up to 10MB'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Paste Professional Profile / Bio / Experience Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste work experience details, skills, education history, or resume contents..."
                  value={formProfileText}
                  onChange={(e) => setFormProfileText(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-900 dark:text-dark-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-sans"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-dark-border mt-auto flex space-x-3.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-neutral-200 dark:border-dark-border rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Parsing Profile...
                    </>
                  ) : (
                    'Add Candidate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
