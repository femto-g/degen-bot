import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { exampleEmbed } from "../../core/messages";

export const data = new SlashCommandBuilder()
  .setName("tabletest")
  .setDescription("Example Embed");

export async function execute(interaction: CommandInteraction) {
  await interaction.reply({ embeds: [exampleEmbed] });
}
