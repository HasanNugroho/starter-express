import Redis, { RedisOptions } from 'ioredis';
import logger from './logger';

const redisPort = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;

// Check if the port is valid
if (isNaN(redisPort) || redisPort < 0 || redisPort >= 65536) {
  logger.error(
    `Invalid Redis port: ${process.env.REDIS_PORT}. Falling back to default port 6379.`
  );
  process.exit(1);
}

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: redisPort,
  password: process.env.REDIS_PASSWORD ?? 'somerandompassword',
  retryStrategy: (times: number) => {
    // Retry connection after an exponential delay up to 2000ms
    return Math.min(times * 10000, 10000);
  },
};

logger.info('Establishing Redis connection...');
const redisClient = new Redis(redisOptions);

// Log Redis connection events
redisClient.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

redisClient.on('error', (err: Error) => {
  // Log the error but do not throw, to prevent crashing the application
  logger.error('Redis Error: ' + err.message);
  process.exit(1);
});

// Optional: Handle ready event to confirm Redis is ready to use
redisClient.on('ready', () => {
  logger.info('Redis client is ready to use');
});

// Optional: Handle close event when the connection is closed
redisClient.on('close', () => {
  logger.warn('Redis connection closed');
});

// Optional: Handle end event when the connection is ended
redisClient.on('end', () => {
  logger.info('Redis connection has ended');
});

// Optional: Handle reconnected event if the connection is re-established
redisClient.on('reconnecting', (time: number) => {
  logger.info(`Reconnecting to Redis in ${time} ms...`);
});

export default redisClient;
