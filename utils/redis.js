import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.redisIsConnected = undefined;
    this.client = createClient();

    this.client.on('error', (err) => {
      this.redisIsConnected = false;
      console.log(`Redis client not connected to the server: ${err}`);
    });

    this.client.on('connect', () => {
      this.redisIsConnected = true;
      console.log('Redis client connected to the server');
    });
  }

  isAlive() {
    return this.redisIsConnected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const keyValue = await getAsync(key);
    return keyValue;
  }

  async set(key, value, duration) {
    const setExAsync = promisify(this.client.setex).bind(this.client);
    await setExAsync(key, duration, value);
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
