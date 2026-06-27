import '../styles/hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <div className="hero__eyebrow">AI Resume & LinkedIn Analyzer</div>
        <h1 className="hero__title">Analyze top candidates with clarity and confidence.</h1>
        <p className="hero__subtitle">
          Analyze resumes and LinkedIn profiles to generate AI-powered hiring insights.
        </p>
        <a href="#analyzer" className="hero__button">
          Get Started
        </a>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__shape hero__shape--large"></div>
        <div className="hero__shape hero__shape--small"></div>
      </div>
    </section>
  );
};

export default Hero;
