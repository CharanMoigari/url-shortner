const { createCluster } = require("redis");

const redisClient = createCluster({
  rootNodes: [
    {
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    },
  ],
});

redisClient.on("connect", () => {
  console.log("✅ Redis Cluster Connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisClient;