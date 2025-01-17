import { createClient } from "redis";
import { environmentVariables } from "./env";

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!client) {
    client = await createClient({
      //TODO: password protect and put in .env
      url: environmentVariables.REDIS_URL,
    })
      .on("error", (err) => {
        console.log("Redis Client Error", err);
      })
      .connect();
  }
  return client;
}
