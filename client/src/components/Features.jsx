import '../styles/features.css';

const features = [
  {
    title: 'AI Analysis',
    description: 'Analyze candidate information intelligently with clear hiring insights.',
    icon: '⚡'
  },
  {
    title: 'Skill Detection',
    description: 'Identify technical and soft skills from resumes and LinkedIn profiles.',
    icon: '🔍'
  },
  {
    title: 'Hiring Insights',
    description: 'Generate recruiter-friendly recommendations for better decisions.',
    icon: '💡'
  }
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features__header">
        <p className="eyebrow">What HireSight does</p>
        <h2>Modern analysis for hiring teams.</h2>
      </div>

      <div className="features__grid">
        {features.map((item) => (
          <article key={item.title} className="feature-card">
            <div className="feature-card__icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;
