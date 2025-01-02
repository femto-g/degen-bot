import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  getCryptoAggregates,
  getSnapShot,
  getStockAggregates,
  normalizeSnapshot,
} from "../../biz/stocks";
import { snapshotTable } from "../../core/messages";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Replies with snapshot")
  .addStringOption((option) =>
    option
      .setName("ticker")
      .setDescription("Ticker symbol for an asset")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("class")
      .setDescription("Asset class of the ticker")
      .setRequired(true)
      .addChoices(
        { name: "Stock", value: "Stock" },
        { name: "Crypto", value: "Crypto" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  const ticker = (
    interaction.options.get("ticker")?.value as string
  ).toUpperCase();
  const assetClass = interaction.options.get("class")?.value as string;
  let snapshot;
  if (assetClass == "Stock") {
    const aggs = await getStockAggregates(ticker);
    snapshot = getSnapShot(aggs);
  } else {
    const aggs = await getCryptoAggregates(ticker);
    snapshot = getSnapShot(aggs);
  }
  //   console.log(snapshot);
  const table = snapshotTable(normalizeSnapshot(snapshot));
  await interaction.reply(table);
}
