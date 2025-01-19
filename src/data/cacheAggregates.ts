import { DateTime } from "luxon";
import { Aggregates } from "../biz/aggregates";
import { getRedisClient } from "../core/redis";

export async function cacheAggregates(ticker: string, aggs: Aggregates) {
  const client = await getRedisClient();
  const endofDay = DateTime.now()
    .setZone("America/New_York")
    .endOf("day")
    .minus({ milliseconds: 999 })
    .toSeconds();
  //console.log(endofDay);
  //console.log(new Date(endofDay).toISOString());
  await client.set(ticker, JSON.stringify(aggs));
  await client.expireAt(ticker, endofDay);
}
