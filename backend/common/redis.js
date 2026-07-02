import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

client.on("connect", () => {
  console.log("Redis connected successfully");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

await client.connect();

export default client;