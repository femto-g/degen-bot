import { StockSnapshot } from "./aggregates";

export function normalizeTicker(ticker: string) {
  if (ticker.startsWith("X:")) {
    return ticker.slice(2);
  }
  return ticker;
} // function normalizePrice(price: number) {
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
export function normalizePrice(price: number): string {
  let normalizedPrice: string;

  if (price >= 999990) {
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
} // function normalizePercentChange(change: number) {
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
export function normalizePercentChange(percent: number): string {
  // Determine if the percent is positive or negative
  const arrow = percent > 0 ? "⬆" : percent < 0 ? "⬇" : "";

  // Get the absolute value of the percentage
  const absPercent = Math.abs(percent);

  let percentage: string;

  // Apply rounding based on the value of the percentage
  if (absPercent >= 100) {
    // If percentage is >= 1000 or <= -1000, round to 0 decimal places
    percentage = absPercent.toFixed(0); // No decimal places
  } else if (absPercent >= 10) {
    // If percentage is >= 10 but < 100, round to 1 decimal place
    percentage = absPercent.toFixed(1);
  } else {
    // If percentage is < 10, round to 2 decimal places
    percentage = absPercent.toFixed(2);
  }

  // Format the result ensuring the arrow and percentage symbol are added
  const result = arrow + percentage + "%";

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
