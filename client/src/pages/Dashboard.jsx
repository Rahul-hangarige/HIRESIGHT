import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  BrainCircuit,
  Award,
  TrendingUp,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        if (res.data && res.data.success) {
          setData(res.data.stats);
        } else {
          setError(res.data.error || 'Failed to fetch dashboard metrics.');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Could not connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 dark:text-primary-400" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Aggregating recruiter metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-700 dark:text-red-400 flex items-start space-x-3.5 max-w-xl mx-auto my-12">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-md">Error Loading Dashboard</h4>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
            Please make sure the backend database is running and verify the server logs.
          </p>
        </div>
      </div>
    );
  }

  // Fallback structures if no data exists
  const stats = data || {
    totalCandidates: 0,
    totalAnalyses: 0,
    averageScore: 0,
    recommendedCount: 0,
    recommendationDistribution: [],
    skillDistribution: [],
    experienceDistribution: [],
    recentCandidates: [],
    recentAnalyses: []
  };

  // Color arrays for charts
  const RECOMMENDATION_COLORS = {
    'Highly Recommended': '#10b981', // Emerald
    'Recommended': '#3b82f6',        // Blue
    'Consider': '#f59e0b',           // Amber
    'Not Recommended': '#ef4444'     // Red
  };

  const PIE_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  const recChartData = stats.recommendationDistribution.filter(d => d.value > 0);
  const expChartData = stats.experienceDistribution.filter(d => d.value > 0);

  const getRecommendationBadge = (rec) => {
    const styles = {
      'Highly Recommended': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
      'Recommended': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
      'Consider': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
      'Not Recommended': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30'
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[rec] || 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
        {rec}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display">Recruiter Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Real-time analytics and summaries of active candidate evaluations.
          </p>
        </div>
        <Link
          to="/candidates"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-lg shadow-md shadow-primary-500/10 transition-all cursor-pointer"
        >
          <span>Add Candidate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Candidates</span>
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold font-display">{stats.totalCandidates}</h3>
            <p className="text-xs text-neutral-400 mt-1">Applicants uploaded in pipeline</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">AI Analyses Generated</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold font-display">{stats.totalAnalyses}</h3>
            <p className="text-xs text-neutral-400 mt-1">Screening reports generated</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Average Fit Score</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold font-display">
              {stats.averageScore}<span className="text-sm text-neutral-400 font-normal">/100</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">Overall candidate quality score</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Recommended Share</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold font-display">
              {stats.totalAnalyses > 0 ? Math.round((stats.recommendedCount / stats.totalAnalyses) * 100) : 0}
              <span className="text-sm text-neutral-400 font-normal">%</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {stats.recommendedCount} Highly / Recommended candidates
            </p>
          </div>
        </div>
      </div>

      {stats.totalCandidates === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-12 text-center max-w-xl mx-auto mt-6">
          <BrainCircuit className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-display">No Candidates Found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 max-w-sm mx-auto">
            Get started by adding your first candidate profile, uploading a resume, or pasting details.
          </p>
          <Link
            to="/candidates"
            className="mt-6 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-lg shadow-md shadow-primary-500/10 cursor-pointer transition-all"
          >
            <span>Go to Candidate Pipeline</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Charts Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill distribution chart */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border lg:col-span-2 flex flex-col">
              <h3 className="text-lg font-bold font-display mb-4">Top Technical Skills in Pipeline</h3>
              {stats.skillDistribution.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-12 text-sm text-neutral-400">
                  Run AI analyses on candidates to view skill distributions.
                </div>
              ) : (
                <div className="h-72 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.skillDistribution} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 5 }}>
                      <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={80} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(18, 18, 20, 0.85)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#f4f4f5',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16}>
                        {stats.skillDistribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Recommendation Distribution */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border flex flex-col">
              <h3 className="text-lg font-bold font-display mb-4">Recommendation Split</h3>
              {recChartData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-12 text-sm text-neutral-400">
                  No ratings compiled yet.
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {recChartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={RECOMMENDATION_COLORS[entry.name] || '#a1a1aa'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(18, 18, 20, 0.85)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f4f4f5',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend Custom */}
                  <div className="mt-4 space-y-2">
                    {recChartData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: RECOMMENDATION_COLORS[entry.name] }}
                          />
                          <span className="text-neutral-600 dark:text-neutral-400 font-medium">{entry.name}</span>
                        </div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {entry.value} candidate{entry.value > 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activities list grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Analyses Reports */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold font-display">Recent AI Reports</h3>
                <Link to="/candidates" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  View pipeline
                </Link>
              </div>

              {stats.recentAnalyses.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-400">
                  No screening reports generated yet.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-dark-border">
                  {stats.recentAnalyses.map((ana) => (
                    <div key={ana._id} className="py-3.5 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 px-1 rounded-lg transition-colors">
                      <div className="overflow-hidden pr-3">
                        <Link to={`/candidates/${ana.candidateId}`} className="font-semibold text-sm hover:text-primary-600 transition-colors truncate block">
                          {ana.candidateName}
                        </Link>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{ana.candidateTitle}</p>
                      </div>
                      <div className="flex items-center space-x-4 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{ana.score}</span>
                          <span className="text-xs text-neutral-400">/100</span>
                        </div>
                        {getRecommendationBadge(ana.recommendation)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Candidates Added */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-neutral-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold font-display">Newly Added Candidates</h3>
                <Link to="/candidates" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  Manage profiles
                </Link>
              </div>

              {stats.recentCandidates.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-400">
                  No candidates listed yet.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-dark-border">
                  {stats.recentCandidates.map((cand) => (
                    <div key={cand._id} className="py-3.5 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 px-1 rounded-lg transition-colors">
                      <div className="overflow-hidden pr-3">
                        <Link to={`/candidates/${cand._id}`} className="font-semibold text-sm hover:text-primary-600 transition-colors block truncate">
                          {cand.name}
                        </Link>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{cand.title || 'Role not specified'}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(cand.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
