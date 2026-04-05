import config from './config';

const API_URL = config.API_URL;

// Auth API calls
export const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  }
};

// URL API calls
export const urlAPI = {
  createUrl: async (originalUrl, token) => {
    const response = await fetch(`${API_URL}/api/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ originalUrl })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create short URL');
    return data;
  },

  getAllUrls: async (token) => {
    const response = await fetch(`${API_URL}/api/urls`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch URLs');
    return data;
  },

  getUrl: async (id, token) => {
    const response = await fetch(`${API_URL}/api/urls/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch URL');
    return data;
  },

  deleteUrl: async (id, token) => {
    const response = await fetch(`${API_URL}/api/urls/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete URL');
    return data;
  }
};
