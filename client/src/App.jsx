import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import Features from './components/Features';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <Analyzer />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;
