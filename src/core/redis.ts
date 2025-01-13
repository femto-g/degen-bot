import { createClient } from "redis";

const client = (async () => {
  return await createClient({
    url: "redis://cache:6379",
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
})();

export async function getRedisClient() {
  return await client;
}
