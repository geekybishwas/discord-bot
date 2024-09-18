import { REST, Routes } from "discord.js";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const commands = [
  {
    name: "create",
    description: "Create a new short URL",
  },
  {
    name: "ping",
    description: "Replies with a pong",
  },
  {
    name: "info",
    description: "Provide and info",
  },
];

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands("1285949194980294656"), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
