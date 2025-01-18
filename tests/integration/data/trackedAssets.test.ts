import { PrismaClient } from "@prisma/client";
import {
  addTrackedAsset,
  getTrackedAssets,
  removeTrackedAsset,
} from "../../../src/data/trackedAssets";

describe("Tracked Asset Service Integration Tests", () => {
  let prisma: PrismaClient;
  const ticker1 = "AAPL";
  const ticker2 = "BTC";
  const assetClassStock: "STOCK" = "STOCK";
  const assetClassCrypto: "CRYPTO" = "CRYPTO";

  beforeAll(async () => {
    prisma = new PrismaClient(); // Initialize Prisma client
  });

  // After all tests, disconnect Prisma to clean up the connection
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Before each test, ensure the database is clean
  beforeEach(async () => {
    // Ensure the database is clean before running each test
    await prisma.trackedAsset.deleteMany();
  });

  // This block of code ensures cleanup after failed tests as well
  afterEach(async () => {
    // Log any errors if a test fails
    // const trackedAssets = await prisma.trackedAsset.findMany();
    // if (trackedAssets.length > 0) {
    //   console.log("Tracked assets after test: ", trackedAssets);
    // }

    // Delete all tracked assets after each test to prevent database contamination
    try {
      await prisma.trackedAsset.deleteMany();
    } catch (error) {
      console.error("Error during cleanup: ", error);
    }
  });

  it("should add a tracked asset to the database", async () => {
    const asset = await addTrackedAsset(ticker1, assetClassStock);

    const trackedAssets = await getTrackedAssets();
    expect(trackedAssets).toHaveLength(1); // There should be 1 tracked asset
    expect(trackedAssets[0]).toEqual({
      ticker: ticker1,
      assetClass: assetClassStock,
    });
  });

  it("should remove a tracked asset from the database", async () => {
    await addTrackedAsset(ticker1, assetClassStock);

    await removeTrackedAsset(ticker1, assetClassStock);

    const trackedAssets = await getTrackedAssets();
    expect(trackedAssets).toHaveLength(0); // No tracked assets should exist
  });

  it("should throw an error when trying to remove a non-existent asset", async () => {
    await expect(
      removeTrackedAsset(ticker1, assetClassStock)
    ).rejects.toThrow();
  });

  it("should get all tracked assets", async () => {
    await addTrackedAsset(ticker1, assetClassStock);
    await addTrackedAsset(ticker2, assetClassCrypto);

    const trackedAssets = await getTrackedAssets();
    expect(trackedAssets).toHaveLength(2); // Two assets should be present
    expect(trackedAssets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ticker: ticker1,
          assetClass: assetClassStock,
        }),
        expect.objectContaining({
          ticker: ticker2,
          assetClass: assetClassCrypto,
        }),
      ])
    );
  });
});
