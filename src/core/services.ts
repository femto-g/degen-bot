import fs from "fs";
import path from "path";
import { Collection, Client, MessageFlags, Events } from "discord.js";
import { environmentVariables } from "./env";
import { logger } from "./logger";
import * as cron from "node-cron";
import { refreshList } from "../biz/aggregates";

const { DISCORD_APP_TOKEN } = environmentVariables;

export async function loadCommands(client: Client) {
  client.commands = new Collection();

  const foldersPath = path.join(__dirname, "../", "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        const command = await import(filePath); // Use await for cleaner syntax
        if ("data" in command && "execute" in command) {
          //use zod validation ??
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (err) {
        console.log(`[ERROR] Failed to load command at ${filePath}:`, err);
      }
    }
  }
}

function addHandlers(client: Client) {
  client.once(Events.ClientReady, (readyClient: Client) => {
    console.log(`Ready! Logged in as ${readyClient.user!.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
      logger.info({
        message: "CommandInteraction",
        commandName: interaction.commandName,
        options: interaction.options.data.map((option) => ({
          name: option.name,
          value: option.value,
        })),
        replied: interaction.replied,
      });
    } catch (error) {
      //console.error(error);
      logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });
}

export async function buildClient(client: Client) {
  await loadCommands(client);
  addHandlers(client);
  client.login(DISCORD_APP_TOKEN);

  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Refreshing tracking list");
      try {
        await refreshList();
        console.log("Finished refreshing");
      } catch (error) {
        if (error instanceof Error) {
          error.message += "/ Error when refreshing tracking list during CRON";
        }
        logger.error(error);
      }
    },
    {
      scheduled: true,
      //IMPORTANT! FIX THIS, CANNOT BE EST MUST BE SAME TIME ZONE AS REDIS SERVICE
      //DONE: MADE THIS UTC
      timezone: "America/New_York",
    }
  );
}
