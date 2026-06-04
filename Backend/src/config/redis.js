import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// console.log("HOST", process.env.REDIS_HOST);

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.log(`❌ Redis error: ${err?.message || JSON.stringify(err)}`);
});

export default redis;
