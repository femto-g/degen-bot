import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { buildClient, loadCommands } from "./core/services";

// Require the necessary discord.js classe

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
buildClient(client);

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
// client.once(Events.ClientReady, (readyClient: Client) => {
//   console.log(`Ready! Logged in as ${readyClient.user!.tag}`);
// });

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   }
// });

// Log in to Discord with your client's token
//client.login(token);
