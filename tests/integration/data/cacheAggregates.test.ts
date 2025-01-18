import { DateTime } from "luxon";
import { getRedisClient } from "../../../src/core/redis";
import { cacheAggregates } from "../../../src/data/cacheAggregates";
import { Aggregate } from "@prisma/client/runtime/library";
import { Aggregates } from "../../../src/biz/aggregates";
import { createClient, RedisClientType } from "redis";

describe("./src/data/cacheAggregates.ts", () => {
  describe("cacheAggregates", () => {
    let client: ReturnType<typeof createClient>; // Redis client type is dependent on your actual implementation of getRedisClient

    beforeAll(async () => {
      // Get an actual Redis client from your existing function
      client = await getRedisClient();
    });

    afterAll(async () => {
      // Close the Redis client after the tests
      await client.quit();
    });

    beforeEach(async () => {
      // Flush the Redis database before each test to ensure clean state
      await client.flushAll();
    });

    it("should set aggregates in Redis ", async () => {
      //TODO: with correct expiration
      const ticker = "AAPL";
      const aggs = {
        ticker,
      };

      const endofDay = DateTime.now()
        .endOf("day")
        .minus({ milliseconds: 999 })
        .toMillis();

      // Call the function to test
      await cacheAggregates(ticker, aggs as Aggregates);

      // Verify the correct key is set in Redis
      const cachedData = await client.get(ticker);
      expect(cachedData).toBe(JSON.stringify(aggs));

      // // Verify the expiration time set in Redis (it's stored as a Unix timestamp)
      // const ttl = await client.ttl(ticker);
      // const expectedTTL = endofDay / 1000 - Math.floor(Date.now() / 1000); // in seconds

      // // Expect the TTL to be close to the expected value
      // expect(ttl).toBeGreaterThanOrEqual(expectedTTL - 5); // Allow for small variations in time
      // expect(ttl).toBeLessThanOrEqual(expectedTTL + 5);
    });
  });
});
