import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  getCryptoAggregates,
  getSnapShot,
  getStockAggregates,
  normalizeSnapshot,
} from "../../biz/stocks";
import { snapshotTable } from "../../core/messages";
import Bottleneck from "bottleneck";
import { RequestError } from "../../core/errors";

// const limiter = new Bottleneck({
//   reservoir: 5,
//   reservoirRefreshAmount: 5,
//   reservoirRefreshInterval: 60 * 1000,
//   maxConcurrent: 2,
//   minTime: 5 * 1000,
// });
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
  //await interaction.deferReply({ ephemeral: true });
  //   await interaction.editReply(
  //     "This command is rate limited; try not to use it too often in a short time."
  //   );
  const ticker = (
    interaction.options.get("ticker")?.value as string
  ).toUpperCase();
  const assetClass = interaction.options.get("class")?.value as string;
  let snapshot = null;
  if (assetClass == "Stock") {
    let aggs = null;
    //need to discriminate between errors later
    try {
      //   aggs = await limiter.schedule(
      //     async () => await getStockAggregates(ticker)
      //   );
      aggs = await getStockAggregates(ticker);
    } catch (error) {
      if (error instanceof RequestError) {
        return await interaction.reply({
          content: error.message,
          ephemeral: true,
        });
      }
    }
    snapshot = getSnapShot(aggs!);
  } else {
    let aggs = null;
    try {
      //   aggs = await limiter.schedule(
      //     async () => await getStockAggregates(ticker)
      //   );
      aggs = await getCryptoAggregates(ticker);
    } catch (error) {
      if (error instanceof RequestError) {
        return await interaction.reply({
          content: error.message,
          ephemeral: true,
        });
      }
    }
    snapshot = getSnapShot(aggs!);
  }
  //   console.log(snapshot);
  const table = snapshotTable(normalizeSnapshot(snapshot!));
  //   await interaction.deleteReply();
  await interaction.reply(table);
}
