import fs from "fs";
import path from "path";
import { Collection, Client } from "discord.js";

export async function loadCommands(client: Client) {
  client.commands = new Collection();

  const foldersPath = path.join(__dirname, "commands");
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
