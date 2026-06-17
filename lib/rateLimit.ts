import { redisGet, redisSet } from "@/lib/redis";

const WINDOW = 60;
const MAX_REQUESTS = 30;

export async function rateLimit(key: string, limit = MAX_REQUESTS, windowSec = WINDOW): Promise<{ allowed: boolean; remaining: number }> {
  const redisKey = `vb:ratelimit:${key}`;
  const current = await redisGet(redisKey);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  const next = count + 1;
  await redisSet(redisKey, String(next), "EX", windowSec);
  return { allowed: true, remaining: limit - next };
}
