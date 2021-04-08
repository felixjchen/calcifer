import { redis_host } from "../config";
import { RedisClient } from "redis";

export class History {
  redis: RedisClient;

  constructor() {
    this.redis = new RedisClient({ host: redis_host });
    this.redis.on("connect", () => {
      console.log(`connected to redis ${redis_host}`);
    });
    this.redis.on("error", (err) => {
      if (err.code === "ECONNREFUSED") {
        console.log(
          "Couldn't connect to redis, try docker run -p 6379:6379 redis"
        );
      } else {
        console.log(err);
      }
    });
  }

  // Set redis[key] = ""
  async initKey(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redis.set(key, "", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  // Append redis[key] += str
  append(key: string, str: string) {
    this.redis.append(key, str);
  }

  // Get redis[key]
  async get(key: string) {
    return new Promise((resolve, reject) => {
      this.redis.get(key, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}
