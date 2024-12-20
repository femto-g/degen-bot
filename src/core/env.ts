import dotenv from "dotenv";
import path from "path";

export interface EnvironmentVariables {
  token: string;
  clientId: string;
  guildId: string;
}
const envPath: string = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

//validation

export const environmentVariables: EnvironmentVariables = {
  token: process.env.token!,
  clientId: process.env.clientId!,
  guildId: process.env.guildId!,
};

export default environmentVariables;
