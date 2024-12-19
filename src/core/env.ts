import dotenv from "dotenv";
import path from "path";

export interface EnvironmentVariables {
  token: string;
}
const envPath: string = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

//validation

export const environmentVariables: EnvironmentVariables = {
  token: process.env.token!,
};

export default environmentVariables;
