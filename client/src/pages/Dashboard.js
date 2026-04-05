import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlAPI } from '../api';
import { useAuth } from '../AuthContext';
import URLCard from '../components/URLCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingUrls, setFetchingUrls] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUrls = async () => {
      try {
        setFetchingUrls(true);
        const response = await urlAPI.getAllUrls(token);
        setUrls(response.urls || []);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingUrls(false);
      }
    };

    fetchUrls();
  }, [token, navigate]);

  const handleCreateUrl = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await urlAPI.createUrl(originalUrl, token);
      setUrls(prev => [response.url, ...prev]);
      setOriginalUrl('');
      setSuccess('Short URL created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      await urlAPI.deleteUrl(id, token);
      setUrls(prev => prev.filter(url => url.id !== id));
      setSuccess('URL deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🔗 URL Shortener</h1>
          <p>Welcome, <strong>{user?.name}</strong></p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="create-section">
          <h2>Create New Short URL</h2>
          <form onSubmit={handleCreateUrl} className="create-form">
            <div className="form-group">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Enter URL to shorten (e.g., https://example.com/very-long-url)"
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Shorten URL'}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </section>

        <section className="urls-section">
          <h2>Your Short URLs ({urls.length})</h2>

          {fetchingUrls ? (
            <div className="loading">Loading your URLs...</div>
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <p>No short URLs yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="urls-grid">
              {urls.map(url => (
                <URLCard
                  key={url.id}
                  url={url}
                  onDelete={handleDeleteUrl}
                  onCopy={handleCopyToClipboard}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
