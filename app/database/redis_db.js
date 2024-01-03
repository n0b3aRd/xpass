import { createClient } from "redis";
import logger from "../utils/logger.js";

// redis adapter clients
const pubClient = createClient(); // todo: set redis url
pubClient.on("error", (err) => logger.error("Redis Pub Client Error", err));
const subClient = pubClient.duplicate();

// redis db client
const redisClient = createClient(); // url: 'redis://alice:foobared@awesome.redis.server:6380'
redisClient.on("error", (err) => logger.error("Redis DB Client Error", err));

export { pubClient, subClient, redisClient };
