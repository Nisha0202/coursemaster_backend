import redisClient from '../config/redis';

export const cacheMiddleware = (keyPrefix: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const cacheKey = `${keyPrefix}:${JSON.stringify(req.query)}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = function (data: any) {
        redisClient
          .setEx(cacheKey, 3600, JSON.stringify(data))
          .catch(console.error);
        return originalJson(data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

export const invalidateCache = async (keyPrefix: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(`${keyPrefix}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};
