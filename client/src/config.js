const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'http://16.171.240.13:5000'
    : 'http://localhost:5000'
};

export default config;