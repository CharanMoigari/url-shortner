const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'http://51.20.250.123:5000'
    : 'http://localhost:5000'
};

export default config;