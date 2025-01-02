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
  let snapshot = null;
  if (assetClass == "Stock") {
    let aggs = null;
    try {
      aggs = await getStockAggregates(ticker);
    } catch (error) {
      return interaction.reply({
        content: "Invalid ticker. Use a valid stock ticker symbol.",
      });
    }
    snapshot = getSnapShot(aggs);
  } else {
    let aggs = null;
    try {
      aggs = await getCryptoAggregates(ticker);
    } catch (error) {
      return interaction.reply({
        content: "Invalid ticker. Use a valid crypto ticker symbol",
      });
    }
  }
  //   console.log(snapshot);
  const table = snapshotTable(normalizeSnapshot(snapshot!));
  await interaction.reply(table);
}
