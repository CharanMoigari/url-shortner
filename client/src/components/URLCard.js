import React from 'react';
import config from '../config';
import './URLCard.css';

const URLCard = ({ url, onDelete, onCopy }) => {
  const baseUrl = config.API_URL;
  const shortUrl = `${baseUrl}/${url.shortId}`;
  const createdDate = new Date(url.createdAt).toLocaleDateString();

  return (
    <div className="url-card">
      <div className="url-card-header">
        <div className="url-info">
          <h4 className="short-url">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {url.shortId}
            </a>
          </h4>
          <p className="original-url" title={url.originalUrl}>
            {url.originalUrl}
          </p>
        </div>
      </div>

      <div className="url-card-body">
        <div className="url-stat">
          <span className="stat-label">Clicks</span>
          <span className="stat-value">{url.clicks || 0}</span>
        </div>
        <div className="url-stat">
          <span className="stat-label">Created</span>
          <span className="stat-value">{createdDate}</span>
        </div>
      </div>

      <div className="url-card-footer">
        <button
          className="btn-copy"
          onClick={() => onCopy(shortUrl)}
          title="Copy to clipboard"
        >
          📋 Copy
        </button>
        <button
          className="btn-share"
          onClick={() => {
            const text = `Check this out: ${shortUrl}`;
            if (navigator.share) {
              navigator.share({
                title: 'Short URL',
                text: text,
                url: shortUrl
              });
            } else {
              onCopy(shortUrl);
            }
          }}
          title="Share"
        >
          🔗 Share
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(url.id)}
          title="Delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default URLCard;
