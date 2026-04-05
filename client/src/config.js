// API Configuration
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com'  // Update with your production URL
    : 'http://localhost:5000'
};

export default config;
