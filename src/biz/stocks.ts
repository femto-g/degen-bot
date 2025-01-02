import { DateTime } from "luxon";
import environmentVariables, { EnvironmentVariables } from "../core/env";

interface StockSnapshot {
  ticker: string;
  price: number;
  dayPercentChange: number;
  weekPercentChange: number;
  monthPercentChange: number;
}

interface Aggregates {
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

const { apiKey } = environmentVariables;

function normalizeTicker(ticker: string) {
  if (ticker.startsWith("X:")) {
    return ticker.slice(2);
  }
  return ticker;
}

// function normalizePrice(price: number) {
//   //first normalize price max width 6
//   // 3.05
//   // 3.23k
//   // 345.12 354.2k
//   // 3.453K 34500.23 34.53k

//   const stringPrice = price.toString();
//   const [dollars, cents] = stringPrice.split(".");
//   let normalizedPrice;
//   switch (dollars.length) {
//     case 4:
//       normalizedPrice = dollars[0] + "." + dollars.substring(1, 4) + "K";
//       break;
//     case 5:
//       normalizedPrice =
//         dollars.substring(0, 2) + "." + dollars.substring(2, 4) + "K";
//       break;
//     case 6:
//       normalizedPrice =
//         dollars.substring(0, 3) + "." + dollars.substring(3, 4) + "K";
//       break;
//     default:
//       normalizedPrice = dollars + "." + cents;
//       break;
//   }
//   return normalizedPrice;
// }

function normalizePrice(price: number): string {
  let normalizedPrice: string;

  if (price >= 1000000) {
    // If price is 1 million or more, convert to millions (e.g., 1.23M)
    const roundedPrice = Math.round((price / 1000000) * 100) / 100; // Round to two decimal places
    normalizedPrice = roundedPrice.toFixed(2) + "M";
  } else if (price >= 1000) {
    // If price is 1 thousand or more, convert to thousands (e.g., 32.32K)
    const roundedPrice = Math.round((price / 1000) * 100) / 100; // Round to two decimal places
    normalizedPrice = roundedPrice.toFixed(2) + "K";
  } else {
    // Otherwise, return the price as is
    normalizedPrice = price.toFixed(2);
  }

  return normalizedPrice;
}

// function normalizePercentChange(change: number) {
//   //max width 5

//   let isNeg = false;
//   if (change < 0) {
//     isNeg = true;
//     change *= -1;
//   }

//   const stringPercentChange = change.toString();
//   let normalizedPercent;
//   if (stringPercentChange.length < 4) {
//     normalizedPercent = stringPercentChange;
//   } else {
//     normalizedPercent = stringPercentChange.slice(0, 4);
//   }
//   if (isNeg) {
//     normalizedPercent = "⬇" + normalizedPercent;
//   } else {
//     normalizedPercent = "⬆" + normalizedPercent;
//   }
//   return normalizedPercent + "%";
// }

function normalizePercentChange(ratio: number): string {
  // Determine if the ratio is positive or negative
  const arrow = ratio > 0 ? "⬆" : ratio < 0 ? "⬇" : "";

  // Convert the ratio to a percentage and round to two decimal places
  const percentage = Math.abs(ratio).toFixed(2);

  // Format the result ensuring
  let result = arrow + percentage + "%";

  // If the resulting string exceeds 6 characters, truncate it
  if (result.length > 6) {
    // Only keep the portion that fits, leaving room for the percent symbol
    result = result.slice(0, 5) + "%";
  }

  return result;
}

export function normalizeSnapshot(snapshot: StockSnapshot) {
  const {
    ticker,
    price,
    dayPercentChange,
    weekPercentChange,
    monthPercentChange,
  } = snapshot;

  const normalizedSnapshot = {
    ticker: normalizeTicker(ticker),
    price: normalizePrice(price),
    dayPercentChange: normalizePercentChange(dayPercentChange),
    weekPercentChange: normalizePercentChange(weekPercentChange),
    monthPercentChange: normalizePercentChange(monthPercentChange),
  };
  return normalizedSnapshot;
}

// async function validateTicker(ticker: string) {}

export async function getStockAggregates(ticker: string) {
  //get aggregates for a stock ticker over a 1 month range

  const now = DateTime.now();
  const oneMonthAgo = now.minus({ months: 1 });

  const rangeStart = oneMonthAgo.toMillis();
  const rangeEnd = now.toMillis();

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${rangeStart}/${rangeEnd}?adjusted=true&sort=asc&apiKey=${apiKey}`;
  const response = await fetch(url);
  const aggregates: Aggregates = await response.json();
  if (aggregates.resultsCount == 0) {
    throw new Error("Invalid ticker");
  }

  return aggregates;
}

export async function getCryptoAggregates(ticker: string) {
  //get aggregates for a stock ticker over a 1 month range

  const now = DateTime.now();
  const oneMonthAgo = now.minus({ months: 1 });

  const rangeStart = oneMonthAgo.toMillis();
  const rangeEnd = now.toMillis();

  ticker = "X:" + ticker;

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${rangeStart}/${rangeEnd}?adjusted=true&sort=asc&apiKey=${apiKey}`;
  const response = await fetch(url);
  const aggregates: Aggregates = await response.json();
  if (aggregates.resultsCount == 0) {
    throw new Error("Invalid ticker");
  }

  return aggregates;
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
