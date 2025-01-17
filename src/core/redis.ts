import { createClient } from "redis";
import { environmentVariables } from "./env";

const client = (async () => {
  return await createClient({
    //TODO: password protect and put in .env
    url: environmentVariables.redisUrl,
  })
    .on("error", (err) => {
      console.log("Redis Client Error", err);
    })
    .connect();
})();

export async function getRedisClient() {
  return await client;
}
