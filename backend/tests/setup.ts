import { createConnection, getConnection } from 'typeorm';
import { RedisMemoryServer } from 'redis-memory-server';

let redisServer: RedisMemoryServer;

export const setupTestDatabase = async () => {
  // Setup test database connection
  await createConnection({
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5433'),
    username: process.env.TEST_DB_USERNAME || 'test',
    password: process.env.TEST_DB_PASSWORD || 'test',
    database: process.env.TEST_DB_NAME || 'test_trackmyshow',
    entities: ['src/models/*.ts'],
    synchronize: true,
    dropSchema: true,
    logging: false,
  });
};

export const setupTestRedis = async () => {
  redisServer = new RedisMemoryServer();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  process.env.REDIS_URL = `redis://${host}:${port}`;
};

export const teardownTests = async () => {
  try {
    await getConnection().close();
    if (redisServer) {
      await redisServer.stop();
    }
  } catch (error) {
    console.error('Error during test teardown:', error);
  }
};

beforeAll(async () => {
  await setupTestDatabase();
  await setupTestRedis();
});

afterAll(async () => {
  await teardownTests();
}); 