import Redis from "ioredis";

let client: Redis | null = null;

function getRedis(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true,
      enableReadyCheck: false,
    });
    client.connect().catch(() => {});
  }
  return client;
}

export async function redisGet(key: string): Promise<string | null> {
  try {
    return await getRedis().get(key);
  } catch {
    return null;
  }
}

export async function redisSet(key: string, value: string, mode?: string, ttl?: number): Promise<void> {
  try {
    if (mode === "EX" && ttl !== undefined) {
      await getRedis().set(key, value, "EX", ttl);
    } else {
      await getRedis().set(key, value);
    }
  } catch {
    // Redis unavailable
  }
}
