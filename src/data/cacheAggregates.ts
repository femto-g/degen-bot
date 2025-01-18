import { DateTime } from "luxon";
import { Aggregates } from "../biz/aggregates";
import { getRedisClient } from "../core/redis";

export async function cacheAggregates(ticker: string, aggs: Aggregates) {
  const client = await getRedisClient();
  const endofDay = DateTime.now()
    .endOf("day")
    .minus({ milliseconds: 999 })
    .toMillis();
  await client.set(ticker, JSON.stringify(aggs));
  await client.expireAt(ticker, endofDay);
}
