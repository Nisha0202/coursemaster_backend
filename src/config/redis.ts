// src/config/redis.ts
import { createClient } from 'redis'; // ✅ Correct import for Redis v4

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const initRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect(); // Connect only if not already connected
    console.log('✅ Redis connected');
  }
};

export default redisClient;

