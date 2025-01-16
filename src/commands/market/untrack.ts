import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import {
  getAggregates,
  getSnapShot,
  normalizeSnapshot,
} from "../../biz/stocks";
import { snapshotTable } from "../../core/messages/text";
import { InvalidTickerError, RequestError } from "../../core/errors";
import { addTrackedAsset, removeTrackedAsset } from "../../data/trackedAssets";
import { AssetClass, Prisma } from "@prisma/client";

export const data = new SlashCommandBuilder()
  .setName("untrack")
  .setDescription("Remove an asset from a tracking list")
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

  const successReply = `${ticker} removed from tracking list`;
  try {
    await removeTrackedAsset(ticker, assetClass);
  } catch (error) {
    //catch some db error maybe?
    // catch if doesn't exist?
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(`caught error ${error.code}`);
      if (error.code === "P2025") {
        return await interaction.reply({
          content:
            "This asset is not currently being tracked or the asset class is incorrect.",
          ephemeral: true,
        });
      }
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
      //TODO: check for instance to whatever discordjs error this is
      await interaction.editReply({ content: successReply });
    }
  }
}
