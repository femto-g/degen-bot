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
  token: z
    .string()
    .min(1, { message: "Token is required and cannot be empty" }),
  clientId: z
    .string()
    .min(1, { message: "Client ID is required and cannot be empty" }),
  guildId: z
    .string()
    .min(1, { message: "Guild ID is required and cannot be empty" }),
  apiKey: z
    .string()
    .min(1, { message: "API Key is required and cannot be empty" }),
  databaseUrl: z.string().url({ message: "Database URL must be a valid URL" }),
  redisUrl: z.string().url({ message: "Redis URL must be a valid URL" }),
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
  token: process.env.token,
  clientId: process.env.clientId,
  guildId: process.env.guildId,
  apiKey: process.env.apiKey,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
};

export const environmentVariables = environmentVariablesSchema.parse(envVars);
export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;
