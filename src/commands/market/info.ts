import {
  AttachmentBuilder,
  CommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
  SlashCommandBuilder,
} from "discord.js";
import { getAggregates, getSnapShot } from "../../biz/aggregates";
import { normalizeSnapshot } from "../../biz/normalize";
import { snapshotTable } from "../../core/messages/text";
import Bottleneck from "bottleneck";
import { RequestError } from "../../core/errors";
import { createOHLTChart, getChartUrl } from "../../core/messages/chart";

// const limiter = new Bottleneck({
//   reservoir: 5,
//   reservoirRefreshAmount: 5,
//   reservoirRefreshInterval: 60 * 1000,
//   maxConcurrent: 2,
//   minTime: 5 * 1000,
// });
export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Replies with info on a security")
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
        { name: "Stock", value: "STOCK" },
        { name: "Crypto", value: "CRYPTO" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  const timeout = setTimeout(async () => {
    if (!interaction.replied) {
      await interaction.deferReply();
    }
  }, 2500);

  const ticker = (
    interaction.options.get("ticker")?.value as string
  ).toUpperCase();
  const assetClass = interaction.options.get("class")?.value as string;
  let snapshot = null;

  let aggs = null;
  try {
    aggs = await getAggregates(ticker, assetClass);
  } catch (error) {
    if (error instanceof RequestError) {
      //race condition possible here too but I don't think it will actually occur
      clearTimeout(timeout);
      return await interaction.reply({
        content: error.message,
        ephemeral: true,
      });
    } else {
      throw error;
    }
  }
  snapshot = getSnapShot(aggs);

  const table = snapshotTable(normalizeSnapshot(snapshot));
  //   await interaction.deleteReply();
  //await interaction.reply(table);
  const chart = new AttachmentBuilder(
    await getChartUrl(createOHLTChart(aggs))
  ).setName("img.png");
  if (interaction.replied) {
    await interaction.editReply({ content: table, files: [chart] });
  } else {
    try {
      clearTimeout(timeout);
      await interaction.reply({ content: table, files: [chart] });
    } catch (error) {
      //handle race condition
      //DONE: check for instance to whatever discordjs error this is
      //TODO: extract this somewhere do I don't have to copy it each time
      if (
        error instanceof DiscordjsError &&
        error.code == DiscordjsErrorCodes.InteractionAlreadyReplied
      ) {
        await interaction.editReply({ content: table, files: [chart] });
      } else throw error;
    }
  }
}
