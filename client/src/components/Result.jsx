import '../styles/result.css';

const getRecommendationMeta = (recommendation) => {
  const text = (recommendation || '').toLowerCase();

  if (text.includes('strong') || text.includes('highly')) {
    return { label: 'Strong Fit', tone: 'positive' };
  }

  if (text.includes('good') || text.includes('recommended')) {
    return { label: 'Good Fit', tone: 'neutral' };
  }

  return { label: 'Needs Review', tone: 'warning' };
};

const Result = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="result__empty">
        <p>No analysis yet. Upload a resume or enter a LinkedIn profile to begin.</p>
      </div>
    );
  }

  const recommendationMeta = getRecommendationMeta(analysis.recommendation);
  const interviewCount = analysis.interviewQuestions?.length || 0;

  return (
    <div className="result__card">
      <div className="result__hero">
        <div>
          <p className="result__eyebrow">Candidate Report</p>
          <h3>{analysis.candidateName}</h3>
          <p className="result__subtitle">AI-powered candidate snapshot for fast screening</p>
        </div>

        <div className="result__scorebox">
          <div className="result__scorecircle">
            <span>{analysis.overallScore}%</span>
          </div>
          <div>
            <p className="result__scorelabel">Overall Score</p>
            <span className={`result__pill ${recommendationMeta.tone}`}>{recommendationMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="result__metrics">
        <div className="result__metric">
          <span>Score</span>
          <strong>{analysis.overallScore}/100</strong>
        </div>
        <div className="result__metric">
          <span>Skills</span>
          <strong>{analysis.skills?.length || 0}</strong>
        </div>
        <div className="result__metric">
          <span>Interview Qs</span>
          <strong>{interviewCount}</strong>
        </div>
      </div>

      <div className="result__section result__section--summary">
        <div className="result__sectionHeader">
          <h4>Executive Summary</h4>
          <span className="result__chip">Quick read</span>
        </div>
        <p>{analysis.executiveSummary}</p>
      </div>

      <div className="result__grid">
        <div className="result__panel">
          <div className="result__sectionHeader">
            <p className="panel__title">Skills</p>
            <span className="result__chip">Core fit</span>
          </div>
          <div className="panel__badges">
            {analysis.skills.map((skill) => (
              <span key={skill} className="badge">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="result__panel">
          <div className="result__sectionHeader">
            <p className="panel__title">Career Highlights</p>
            <span className="result__chip">Proof points</span>
          </div>
          <ul>
            {analysis.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="result__grid">
        <div className="result__panel">
          <div className="result__sectionHeader">
            <p className="panel__title">Strengths</p>
            <span className="result__chip positive">Strength</span>
          </div>
          <ul>
            {analysis.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result__panel">
          <div className="result__sectionHeader">
            <p className="panel__title">Areas for Improvement</p>
            <span className="result__chip warning">Watchouts</span>
          </div>
          <ul>
            {analysis.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="result__section">
        <div className="result__sectionHeader">
          <h4>Hiring Recommendation</h4>
          <span className={`result__chip ${recommendationMeta.tone}`}>{recommendationMeta.label}</span>
        </div>
        <p className="result__recommendation">{analysis.recommendation}</p>
      </div>

      <div className="result__section">
        <div className="result__sectionHeader">
          <h4>Interview Questions</h4>
          <span className="result__chip">{interviewCount} questions</span>
        </div>
        <ol className="result__list">
          {analysis.interviewQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Result;
