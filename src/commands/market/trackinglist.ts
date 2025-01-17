import {
  AttachmentBuilder,
  CommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
  SlashCommandBuilder,
} from "discord.js";
import {
  getAggregates,
  getSnapShot,
  normalizeSnapshot,
} from "../../biz/stocks";
import { infoTable, snapshotTable } from "../../core/messages/text";
import {
  InvalidTickerError,
  RateLimitExceededError,
  RequestError,
} from "../../core/errors";
import { addTrackedAsset, getTrackedAssets } from "../../data/trackedAssets";
import { AssetClass } from "@prisma/client";

export const data = new SlashCommandBuilder()
  .setName("list")
  .setDescription("View the list of currently tracked assets");

export async function execute(interaction: CommandInteraction) {
  //#TODO: this should be either wrapped or have a helper function in order to\
  //consolidate this timeout/reply functionality (here I am just guessing that the reply will be ready in time)
  const timeout = setTimeout(async () => {
    if (!interaction.replied) {
      await interaction.deferReply();
    }
  }, 2500);

  let table;

  // const successReply = `${ticker} added to tracking list`;
  try {
    const assets = await getTrackedAssets();
    if (assets.length == 0) {
      return await interaction.reply("Not currently tracking any assets.");
    }

    const allAggs = await Promise.all(
      assets.map(
        async (asset) => await getAggregates(asset.ticker, asset.assetClass)
      )
    );

    const snapshots = allAggs.map((aggs) => getSnapShot(aggs));
    const normalizedSnapshots = snapshots.map((ss) => normalizeSnapshot(ss));
    table = infoTable(normalizedSnapshots);
  } catch (error) {
    //for now do this but the data should be pre-cached by the cron so this should never/rarely occur
    //TODO
    if (error instanceof RateLimitExceededError) {
      return await interaction.reply({
        content: error.message,
        ephemeral: true,
      });
    }
    //catch rate limit exceeded error and send to bottleneck?
    else throw error;
  }

  if (interaction.replied) {
    await interaction.editReply({ content: table });
  } else {
    try {
      clearTimeout(timeout);
      await interaction.reply({ content: table });
    } catch (error) {
      //handle race condition
      //DONE: check for instance to whatever discordjs error this is
      if (
        error instanceof DiscordjsError &&
        error.code == DiscordjsErrorCodes.InteractionAlreadyReplied
      ) {
        await interaction.editReply({ content: table });
      } else throw error;
    }
  }
}
