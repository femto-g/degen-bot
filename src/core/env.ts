import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// export interface EnvironmentVariables {
//   token: string;
//   clientId: string;
//   guildId: string;
//   apiKey: string;
//   databaseUrl: string;
//   redisUrl: string;
// }

const environmentVariablesSchema = z.object({
  DISCORD_APP_TOKEN: z
    .string()
    .min(1, { message: "Discord Token is required and cannot be empty" }),
  DISCORD_CLIENT_ID: z
    .string()
    .min(1, { message: "Client ID is required and cannot be empty" }),
  DISCORD_GUILD_ID: z
    .string()
    .min(1, { message: "Guild ID is required and cannot be empty" }),
  POLYGON_API_KEY: z
    .string()
    .min(1, { message: "API Key is required and cannot be empty" }),
  DATABASE_URL: z.string().url({ message: "Database URL must be a valid URL" }),
  REDIS_URL: z.string().url({ message: "Redis URL must be a valid URL" }),
});

// const envPath: string = path.resolve(____dirname, `.env.${process.env.NODE_ENV}`);

// Get the current module's directory path
const currentDir = __dirname;

// Go one directory up
const dir = path.resolve(currentDir, "../..");

console.log(dir); // This will print the path of the parent folder

const envPath: string = path.resolve(dir, `.env`);
//console.log(envPath);
dotenv.config({ path: envPath });

//TODO: validation

const envVars = {
  DISCORD_APP_TOKEN: process.env.DISCORD_APP_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
};

export const environmentVariables = environmentVariablesSchema.parse(envVars);
export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;
