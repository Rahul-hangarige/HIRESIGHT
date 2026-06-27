import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="about">
      <div className="footer__inner">
        <div>
          <p className="footer__brand">HireSight</p>
          <p className="footer__text">A sleek AI Resume & LinkedIn analyzer built for fast, confident hiring decisions.</p>
        </div>

        <div className="footer__links">
          <div>
            <p className="footer__label">Quick Links</p>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#analyzer">Analyze</a>
          </div>

          <div>
            <p className="footer__label">Connect</p>
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>

          <div>
            <p className="footer__label">Owners</p>
            <a href="https://in.linkedin.com/in/hangarige-rahul-6305b7290" target="_blank" rel="noreferrer">Rahul</a>
            <a href="https://www.linkedin.com/in/hareesh-ai-dev" target="_blank" rel="noreferrer">Hareesh</a>
          </div>
        </div>
      </div>

      <p className="footer__note">© 2026 HireSight. All rights reserved. Crafted for modern hiring teams.</p>
    </footer>
  );
};

export default Footer;
