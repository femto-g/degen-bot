import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: any) {
  const aboutMessage = `DegenBot
A simple bot for market data
Commands:
info : View a snapshot of a particular asset
Caveats:
This bot uses the stocks basic tier of the polygon.io api and has the corresponding limitations.
This means it is rate limited to a handful of requests PER minute. 
This also means that daily market date is only available AFTER the end of the market day. 
Any daily data viewed before then will be delayed.

See polygon.io/pricing for more information`;
  await interaction.reply("Pong!");
}
