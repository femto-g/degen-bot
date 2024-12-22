import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { table1D, exampleStockTable } from "../../core/messages";

export const data = new SlashCommandBuilder()
  .setName("tabletest")
  .setDescription("Table");

export async function execute(interaction: CommandInteraction) {
  //   await interaction.reply({ embeds: [exampleStockTable()] });
  //   await interaction.reply({ embeds: [exampleStockTable()] });
  await interaction.reply(exampleStockTable());
}
