import { PrismaClient, TrackedAsset } from "@prisma/client";

const prisma = new PrismaClient();

export async function addTrackedAsset(
  ticker: string,
  assetClass: "STOCK" | "CRYPTO"
) {
  return await prisma.trackedAsset.create({ data: { ticker, assetClass } });
}

export async function removeTrackedAsset(
  ticker: string,
  assetClass: "STOCK" | "CRYPTO"
) {
  return await prisma.trackedAsset.delete({
    where: { ticker_assetClass: { ticker, assetClass } },
  });
}

export async function getTrackedAssets() {
  return await prisma.trackedAsset.findMany({
    select: {
      ticker: true,
      assetClass: true,
    },
  });
}
