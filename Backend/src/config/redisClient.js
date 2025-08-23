require('dotenv').config()
const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_ADMIN_HOST,
    port: process.env.REDIS_ADMIN_PORT,
  },
  password: process.env.REDIS_ADMIN_PASSWORD,
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("✅ Connected to Redis Cloud");
    } catch (err) {
      console.error("❌ Redis Connection Failed:", err);
    }
  }
};

const ensureConnected = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis connected (from controller)");
  }
};


module.exports = { redisClient, connectRedis,ensureConnected };