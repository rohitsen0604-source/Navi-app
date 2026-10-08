const Redis = require('ioredis');

let redisClient = null;
let isRedisAvailable = false;
const inMemoryLocks = new Map();

try {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts
      }
      return 1000;
    },
    lazyConnect: true
  });

  redisClient.connect().then(() => {
    isRedisAvailable = true;
    console.log('[Redis] Connected successfully for atomic reservation locks');
  }).catch((err) => {
    console.warn('[Redis] Not connected. Operating with in-memory lock engine fallback:', err.message);
  });

  redisClient.on('error', (err) => {
    isRedisAvailable = false;
  });
} catch (e) {
  console.warn('[Redis] Client initialization skipped, using in-memory lock manager.');
}

// Atomic lock utility for race conditions & double booking prevention
const acquireLock = async (resourceKey, ttlSeconds = 30) => {
  if (isRedisAvailable && redisClient) {
    try {
      const result = await redisClient.set(resourceKey, 'locked', 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (err) {
      console.warn('[Redis Lock Error, falling back to memory]:', err.message);
    }
  }

  // In-memory fallback
  const now = Date.now();
  const existing = inMemoryLocks.get(resourceKey);
  if (existing && existing > now) {
    return false; // Already locked
  }
  inMemoryLocks.set(resourceKey, now + ttlSeconds * 1000);
  return true;
};

const releaseLock = async (resourceKey) => {
  if (isRedisAvailable && redisClient) {
    try {
      await redisClient.del(resourceKey);
    } catch (err) {
      console.warn('[Redis Release Error]:', err.message);
    }
  }
  inMemoryLocks.delete(resourceKey);
};

module.exports = {
  getRedisClient: () => redisClient,
  acquireLock,
  releaseLock
};
