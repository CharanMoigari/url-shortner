import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="logo">🔗 URL Shortener</h1>
        <nav className="home-nav">
          <button onClick={() => navigate('/login')} className="btn-secondary">Login</button>
          <button onClick={() => navigate('/register')} className="btn-primary">Sign Up</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero">
          <h2>Shorten Your Long URLs</h2>
          <p>Create short, memorable links to share anywhere</p>
          <button
            onClick={() => navigate('/register')}
            className="btn-large"
          >
            Get Started Free
          </button>
        </section>

        <section className="features">
          <h3>Why Choose URL Shortener?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>⚡ Fast & Reliable</h4>
              <p>Shorten URLs in seconds with our fast API</p>
            </div>
            <div className="feature-card">
              <h4>📊 Track Analytics</h4>
              <p>Monitor clicks and performance of your links</p>
            </div>
            <div className="feature-card">
              <h4>🔒 Secure</h4>
              <p>Your data is encrypted and secure</p>
            </div>
            <div className="feature-card">
              <h4>✨ Easy to Use</h4>
              <p>No technical skills needed</p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Sign Up</h4>
              <p>Create a free account</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Paste URL</h4>
              <p>Paste your long URL</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Get Short Link</h4>
              <p>Get your shortened URL</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Share & Track</h4>
              <p>Share and monitor clicks</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 URL Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
