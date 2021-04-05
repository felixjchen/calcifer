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
  async init(key: string) {
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
  async append(key: string, str: string) {
    return new Promise((resolve, reject) => {
      this.redis.get(key, (err, res) => {
        if (err) {
          reject(err);
        } else {
          const new_value = res + str;
          this.redis.set(key, new_value, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        }
      });
    });
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
