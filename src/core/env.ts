import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

export interface EnvironmentVariables {
  token: string;
  clientId: string;
  guildId: string;
  apiKey: string;
  databaseUrl: string;
}
// const envPath: string = path.resolve(____dirname, `.env.${process.env.NODE_ENV}`);

// Get the current module's directory path
const currentDir = __dirname;

// Go one directory up
const dir = path.resolve(currentDir, "../..");

console.log(dir); // This will print the path of the parent folder

const envPath: string = path.resolve(dir, `.env`);
//console.log(envPath);
dotenv.config({ path: envPath });

//validation

export const environmentVariables: EnvironmentVariables = {
  token: process.env.token!,
  clientId: process.env.clientId!,
  guildId: process.env.guildId!,
  apiKey: process.env.apiKey!,
  databaseUrl: process.env.DATABASE_URL!,
};

export default environmentVariables;
