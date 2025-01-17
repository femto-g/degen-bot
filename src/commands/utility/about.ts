import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("About DegenBot");

export async function execute(interaction: any) {
  const aboutMessage = `## Degenbot: A simple bot for market data
### Commands:
- **/about**: Displays information about the bot **<-- you are here**
- **/snapshot**: View a snapshot of a particular asset
- **/info** : Similar to snapshot but additionally provides an ohlc/sma chart 
- **/list** : Displays the snapshots of currently tracked assets
- **/track** : Add an asset to the tracking list
- **/untrack** : Remove an asset from the tracking list
### Tips:
- When using providing a ticker symbol for a command, make sure you are using a valid ticker (e.g. for the USD price of Bitcoin, the symbol is ~~BTC~~ BTCUSD)
### Caveats:
- This bot uses the Stocks Basic tier of the [polygon.io](<https://polygon.io/>) api and has the corresponding limitations. This means it is rate limited to a handful of requests PER minute. This also means that daily market date is only available AFTER the end of the market day. Any daily data viewed before then will be delayed.
-# See [polygon.io/pricing](<https://polygon.io/pricing>) for more information`;
  await interaction.reply(aboutMessage);
}
