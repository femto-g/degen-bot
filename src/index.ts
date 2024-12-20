import { environmentVariables } from "./core/env";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./helpers";

const { token } = environmentVariables;

// Require the necessary discord.js classe

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
await loadCommands(client);

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient: Client) => {
  console.log(`Ready! Logged in as ${readyClient.user!.tag}`);
});

// Log in to Discord with your client's token
//client.login(token);
