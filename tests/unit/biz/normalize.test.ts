import {
  normalizePercentChange,
  normalizePrice,
  normalizeTicker,
} from "../../../src/biz/normalize";
describe("./biz/normalize.ts", () => {
  test("normalize ticker", () => {
    const stockTicker = "STOCK";
    const cryptoTicker = "X:CRYPTO";

    expect(normalizeTicker(stockTicker)).toBe("STOCK");
    expect(normalizeTicker(cryptoTicker)).toBe("CRYPTO");
  });

  describe("normalizePrice", () => {
    it("should return price in millions with two decimal places if price is >= 1 million", () => {
      expect(normalizePrice(1000000)).toBe("1.00M");
      expect(normalizePrice(1234567)).toBe("1.23M");
      expect(normalizePrice(1500000)).toBe("1.50M");
      expect(normalizePrice(9999999)).toBe("10.00M");
    });

    it("should return price in thousands with two decimal places if price is >= 1 thousand and < 1 million ", () => {
      expect(normalizePrice(1000)).toBe("1.00K");
      expect(normalizePrice(1234)).toBe("1.23K");
      expect(normalizePrice(9999)).toBe("10.00K");
      expect(normalizePrice(999989)).toBe("999.99K");
      // edge case due to rounding
      expect(normalizePrice(999999)).toBe("1.00M");
    });

    it("should return the price as is with two decimal places if price is less than 1000", () => {
      expect(normalizePrice(0)).toBe("0.00");
      expect(normalizePrice(5)).toBe("5.00");
      expect(normalizePrice(99.99)).toBe("99.99");
      expect(normalizePrice(999)).toBe("999.00");
    });

    it("should handle rounding correctly for values close to the rounding threshold", () => {
      expect(normalizePrice(999999)).toBe("1.00M");
      expect(normalizePrice(999)).toBe("999.00");
      expect(normalizePrice(1234.567)).toBe("1.23K");
      expect(normalizePrice(999999.999)).toBe("1.00M");
    });
  });

  describe("normalizePercentChange", () => {
    // Test for positive percentages
    it("should handle positive percentages with correct arrow and percentage formatting", () => {
      expect(normalizePercentChange(5)).toBe("⬆5.00%"); // Simple case (5%)
      expect(normalizePercentChange(12.3)).toBe("⬆12.3%"); // Rounded to 2 decimal places (12.3%)
      expect(normalizePercentChange(98.76)).toBe("⬆98.8%"); // Large positive value (98.76%)
      expect(normalizePercentChange(100)).toBe("⬆100%"); // Exactly 100%
      expect(normalizePercentChange(0.01)).toBe("⬆0.01%"); // Very small positive value (0.01%)
      expect(normalizePercentChange(123.4)).toBe("⬆123%"); // Large positive value > 100%
      //   expect(normalizePercentChange(9999)).toBe("⬆9999.00%"); // Extremely large positive value
    });

    // Test for negative percentages
    it("should handle negative percentages with correct arrow and percentage formatting", () => {
      expect(normalizePercentChange(-5)).toBe("⬇5.00%"); // Simple case (-5%)
      expect(normalizePercentChange(-12.3)).toBe("⬇12.3%"); // Rounded to 2 decimal places (-12.3%)
      expect(normalizePercentChange(-98.76)).toBe("⬇98.8%"); // Large negative value (-98.76%)
      expect(normalizePercentChange(-100)).toBe("⬇100%"); // Exactly -100%
      expect(normalizePercentChange(-0.01)).toBe("⬇0.01%"); // Very small negative value (-0.01%)
      expect(normalizePercentChange(-123.4)).toBe("⬇123%"); // Large negative value < -100%
      //   expect(normalizePercentChange(-9999)).toBe("⬇9999.00%"); // Extremely large negative value
    });

    // Test for zero percentage
    it('should return "0.00%" for zero percentage', () => {
      expect(normalizePercentChange(0)).toBe("0.00%");
    });

    // Test for length truncation (should truncate values that exceed 6 characters)
    it("should truncate values that exceed 6 characters to fit the format", () => {
      expect(normalizePercentChange(12.34)).toBe("⬆12.3%"); // Arrow + 4 digits, total length = 6 chars
      expect(normalizePercentChange(-12.34)).toBe("⬇12.3%"); // Same for negative value
      expect(normalizePercentChange(123.45)).toBe("⬆123%"); // Large value with truncation
      expect(normalizePercentChange(-123.45)).toBe("⬇123%"); // Negative value with truncation
      expect(normalizePercentChange(199.99)).toBe("⬆200%"); // Truncate correctly at >100%
      expect(normalizePercentChange(-199.99)).toBe("⬇200%"); // Negative value truncation
    });
  });
});
