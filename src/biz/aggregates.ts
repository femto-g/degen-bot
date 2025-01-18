import { DateTime } from "luxon";
import { environmentVariables, EnvironmentVariables } from "../core/env";
import { StatusCodes } from "http-status-codes";
import { InvalidTickerError, RateLimitExceededError } from "../core/errors";
import { getRedisClient } from "../core/redis";
import { getTrackedAssets } from "../data/trackedAssets";
import Bottleneck from "bottleneck";
import { cacheAggregates } from "../data/cacheAggregates";

export interface StockSnapshot {
  ticker: string;
  price: number;
  dayPercentChange: number;
  weekPercentChange: number;
  monthPercentChange: number;
}

export interface Aggregates {
  ticker: string; // The exchange symbol that this item is traded under (e.g., "X:BTCUSD")
  adjusted: boolean; // Whether the data is adjusted for stock splits or not
  queryCount: number; // The number of aggregates (minute or day) used to generate the response
  request_id: string; // Unique request identifier assigned by the server
  resultsCount: number; // The total number of results returned for this request
  status: string; // Status of the response (e.g., "OK")
  results: AggregateBar[]; // Array containing trading data for each time period
  next_url?: string; // URL to fetch the next page of data (if present)
}

interface AggregateBar {
  c: number; // Close price for the symbol in the given time period
  h: number; // Highest price for the symbol in the given time period
  l: number; // Lowest price for the symbol in the given time period
  n: number; // Number of transactions in the aggregate window
  o: number; // Open price for the symbol in the given time period
  otc?: boolean; // Whether this aggregate is for an OTC ticker (optional)
  t: number; // Unix Millisecond timestamp for the start of the aggregate window
  v: number; // Trading volume of the symbol in the given time period
  vw: number; // Volume-weighted average price for the symbol in the given time period
}

export type AssetClass = "STOCK" | "CRYPTO";

const { POLYGON_API_KEY } = environmentVariables;

// async function validateTicker(ticker: string) {}

async function getStockAggregates(ticker: string) {
  //get aggregates for a stock ticker over a 1 month range

  const now = DateTime.now();
  const oneMonthAgo = now.minus({ months: 1 });

  const rangeStart = oneMonthAgo.toMillis();
  const rangeEnd = now.toMillis();

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${rangeStart}/${rangeEnd}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  const response = await fetch(url);
  if (response.status == StatusCodes.TOO_MANY_REQUESTS) {
    throw new RateLimitExceededError();
  }
  const aggregates: Aggregates = await response.json();
  if (aggregates.resultsCount == 0) {
    throw new InvalidTickerError();
  }

  return aggregates;
}

async function getCryptoAggregates(ticker: string) {
  //get aggregates for a stock ticker over a 1 month range

  const now = DateTime.now();
  const oneMonthAgo = now.minus({ months: 1 });

  const rangeStart = oneMonthAgo.toMillis();
  const rangeEnd = now.toMillis();

  ticker = "X:" + ticker;

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${rangeStart}/${rangeEnd}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
  const response = await fetch(url);
  if (response.status == StatusCodes.TOO_MANY_REQUESTS) {
    throw new RateLimitExceededError();
  }
  const aggregates: Aggregates = await response.json();
  if (aggregates.resultsCount == 0) {
    throw new InvalidTickerError();
  }

  return aggregates;
}

export async function getAggregates(ticker: string, assetClass: string) {
  const client = await getRedisClient();

  if (await client.exists(ticker)) {
    //TODO: This is only using the ticker as a key, should be {ticker, assetClass}
    //console.log(`${ticker} fetched from cache`);
    const cachedAggs = await client.get(ticker);
    const aggs = JSON.parse(cachedAggs!) as Aggregates; //add Zod Validation here?
    return aggs;
  }

  if (assetClass == "STOCK") {
    const aggs = await getStockAggregates(ticker);
    await cacheAggregates(ticker, aggs);
    return aggs;
  } else if (assetClass == "CRYPTO") {
    const aggs = await getCryptoAggregates(ticker);
    await cacheAggregates(ticker, aggs);
    return aggs;
  } else {
    console.log(assetClass);
    throw new Error("Unknown asset class");
  }
}

export function getSnapShot(aggregates: Aggregates) {
  //console.log(aggregates);
  const { ticker, results, resultsCount } = aggregates;

  const newestResult = results[resultsCount - 1];
  const lastDayResult = results[resultsCount - 2];
  const lastWeekResult = results[resultsCount - 6];
  const lastMonthResult = results[0];

  const newestPrice = newestResult.c;
  const lastDayPrice = lastDayResult.c;
  const lastWeekPrice = lastWeekResult.c;
  const lastMonthPrice = lastMonthResult.c;

  const snapshot: StockSnapshot = {
    ticker,
    price: newestPrice,
    dayPercentChange: ((newestPrice - lastDayPrice) * 100) / newestPrice,
    weekPercentChange: ((newestPrice - lastWeekPrice) * 100) / newestPrice,
    monthPercentChange: ((newestPrice - lastMonthPrice) * 100) / newestPrice,
  };

  return snapshot;
}

export async function refreshList() {
  const list = await getTrackedAssets();
  //TODO: idk maybe make this better? but I don't think I have to
  const limiter = new Bottleneck({
    // reservoir: 5,
    // reservoirRefreshAmount: 5,
    // reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 1,
    minTime: 12 * 1000,
  });
  for (let asset of list) {
    let { ticker, assetClass } = asset;
    await limiter.schedule(async () => getAggregates(ticker, assetClass));
  }
}
