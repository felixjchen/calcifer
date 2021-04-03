import { redis_host } from "../config";
import { RedisClient } from "redis";

export class History {
  redis: RedisClient;

  constructor() {
    this.redis = new RedisClient({ host: redis_host });
    console.log(`connected to redis ${redis_host}`);
  }

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
