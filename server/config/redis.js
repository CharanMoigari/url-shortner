import { createCluster } from "redis";

const redisClient = createCluster({
  rootNodes: [
    {
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    },
  ],
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis Cluster Connected");
  } catch (err) {
    console.error("Redis Connection Error:", err);
  }
}

connectRedis();

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redisClient;