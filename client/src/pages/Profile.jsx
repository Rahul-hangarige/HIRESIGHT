import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setOrganization(user.organization || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (password && password.length < 6) {
      return setErrorMsg('New password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    setLoading(true);

    try {
      await updateProfile(name, organization, password || undefined);
      setSuccessMsg('User profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Profile modification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-display">Recruiter Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          Manage your contact credentials and corporate structures.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-6 shadow-2xs">
        {successMsg && (
          <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg flex items-center space-x-2.5">
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center space-x-2.5">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-dark-border pb-2 mb-2">
              Identity & Company Details
            </h3>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-909 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Work Email (Read Only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-100 dark:bg-neutral-950/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-400 dark:text-neutral-500 cursor-not-allowed font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Organization Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4.5 w-4.5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm text-neutral-909 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Security */}
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-dark-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-dark-border pb-2 mb-2">
              Security Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  New Password (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-neutral-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="•••••••• (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-neutral-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-dark-border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-dark-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-500/10 cursor-pointer disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving updates...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
