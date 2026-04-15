const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    connectTimeout: 5000,
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis Connected");
    }
  } catch (err) {
    console.log("❌ Redis Connection Failed:", err.message);
  }
};

// connect immediately (non-blocking app start)
connectRedis();

module.exports = redisClient;