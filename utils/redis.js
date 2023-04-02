import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
    });
  }

  isAlive() {
    console.log(`Connected event: ${this.client.connected}`);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
