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
import {
  InvalidTickerError,
  RateLimitExceededError,
  RequestError,
} from "../../core/errors";
import { addTrackedAsset } from "../../data/trackedAssets";
import { AssetClass, Prisma } from "@prisma/client";

export const data = new SlashCommandBuilder()
  .setName("track")
  .setDescription("Add an asset to a tracking list")
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
  const assetClass = interaction.options.get("class")?.value as AssetClass;

  const successReply = `${ticker} added to tracking list`;
  try {
    await getAggregates(ticker, assetClass);
    await addTrackedAsset(ticker, assetClass);
  } catch (error) {
    //catch some db error maybe?
    // console.log(error);
    //DONE: catch errorr when an already tracked ticker + assetClass is provided
    if (error instanceof InvalidTickerError) {
      return await interaction.reply({
        content: error.message,
        ephemeral: true,
      });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //console.log(`caught error ${error.code}`);
      if (error.code === "P2002") {
        return await interaction.reply({
          content: "This asset is already being tracked.",
          ephemeral: true,
        });
      }
    }
    //catch rate limit exceeded error and send to bottleneck?
    //TODO: CATCH RATE LIMIT ERROR
    else if (error instanceof RateLimitExceededError) {
      return await interaction.reply({
        content: error.message,
        ephemeral: true,
      });
    } else throw error;
  }

  if (interaction.replied) {
    await interaction.editReply({ content: successReply });
  } else {
    try {
      clearTimeout(timeout);
      await interaction.reply({ content: successReply });
    } catch (error) {
      //handle race condition
      //DONE: check for instance to whatever discordjs error this is
      if (
        error instanceof DiscordjsError &&
        error.code == DiscordjsErrorCodes.InteractionAlreadyReplied
      ) {
        await interaction.editReply({ content: successReply });
      } else throw error;
    }
  }
}
