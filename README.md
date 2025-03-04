# Degen Bot

Degen Bot is a Discord bot designed to provide real-time stock and crypto market data. Built with Discord.js and leveraging the Polygon API, this bot delivers market data in the form of tables and charts right into your Discord server.

## Features

- Fetches real-time stock and crypto market data
- Presents data in chart format. Powered by Chartjs and QuickChart
- Built with Discord.js and the Polygon API
- Caching with Redis to stay within API rate limits

## Prerequisites

To run Degen Bot locally, you'll need:

- **Node.js** (version X.X.X or above)
- **Docker** (for containerized deployment)
- **A Polygon API token** (for market data)
- **A Discord bot token** (to communicate with Discord's API)

## Installation

To set up and run Degen Bot locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/degen-bot.git
   cd degen-bot
   ```

2. Create a `.env` file in the project root and add your required variables:

   ```bash
   DISCORD_APP_TOKEN=your_discord_app_token
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_GUILD_ID=your_guild_id
   POLYGON_API_TOKEN=your_polygon_api_token
   DATABASE_URL=db_connection_string
   REDIS_URL=redis_connection_string
   ```

3. Start the project using Docker Compose:
   ```bash
   docker-compose up
   ```
   This will set up the necessary services including Postgres and Redis.

## Usage

Once the bot is running, use the slash commands in your Discord server to fetch market data. (Refer to Discord's slash command documentation for usage details.)

<img src="https://github.com/user-attachments/assets/0ea22b7c-484a-4cb9-907e-6eb985b9c85d" alt="voo info" width="450" height="300"> 
<br>
<img src="https://github.com/user-attachments/assets/8db6848b-0b89-43cd-826c-010b84bf1ae9" alt="list" width="450" height="250">



### Commands

- `/about`: Displays information about the bot
- `/snapshot [ticker] [asset_class]`: View a snapshot of a particular asset
- `/info [ticker] [asset_class]` : Similar to snapshot but additionally provides an ohlc/sma chart
- `/list` : Displays the snapshots of currently tracked assets
- `/track [ticker] [asset_class]` : Add an asset to the tracking list
- `/untrack [ticker] [asset_class]` : Remove an asset from the tracking list

## Testing

You can run unit tests with the following command:

```bash
npm run test:unit
```
