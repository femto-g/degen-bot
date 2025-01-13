import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("About DegenBot");

export async function execute(interaction: any) {
  const aboutMessage = `## Degenbot: A simple bot for market data
### Commands:
/about: displays information about the bot **<-- you are here**
/snapshot : View a snapshot of a particular asset
/info : similar to snapshot but additionally provides an ohlc/sma chart 
### Tips:
- When using /snapshot or /info for a crypto asset, make sure you are using a valid ticker; for example, the ticker symbol to track the USD price of bitcoin is not 'BTC' but rather, 'BTCUSD'.
### Caveats:
- This bot uses the Stocks Basic tier of the [polygon.io](<https://polygon.io/>) api and has the corresponding limitations. This means it is rate limited to a handful of requests PER minute. This also means that daily market date is only available AFTER the end of the market day. Any daily data viewed before then will be delayed.
-# See [polygon.io/pricing](<https://polygon.io/pricing>) for more information`;
  await interaction.reply(aboutMessage);
}
