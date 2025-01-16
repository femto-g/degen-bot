-- CreateEnum
CREATE TYPE "AssetClass" AS ENUM ('STOCK', 'CRYPTO');

-- CreateTable
CREATE TABLE "TrackedAsset" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "assetClass" "AssetClass" NOT NULL,

    CONSTRAINT "TrackedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackedAsset_ticker_assetClass_key" ON "TrackedAsset"("ticker", "assetClass");
