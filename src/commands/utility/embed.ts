import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { exampleStockTable } from "../../core/messages";

export const data = new SlashCommandBuilder()
  .setName("nothing")
  .setDescription("Example Embed");

export async function execute(interaction: CommandInteraction) {
  //   await interaction.reply({ embeds: [exampleStockTable()] });
  //   await interaction.reply({ embeds: [exampleStockTable()] });
  await interaction.reply("Deprecated command");
}
