import '../styles/navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__logo">HireSight</span>
        </div>

        <nav className="navbar__nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
