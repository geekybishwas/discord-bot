import { Client, GatewayIntentBits } from "discord.js";

import OpenAI from "openai";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Log into Discord
client.login(process.env.DISCORD_BOT_TOKEN);

// Listen for message
client.on("messageCreate", async (message) => {
  // Ignore the message from bots
  if (message.author.bot) return;

  try {
    // Capture the user's message content and store it into varible prompt
    const prompt = message.content;

    // Send the request to OpenAi and get a streaming response
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    //   Lets initialize the variable that store the responses from OpenAi
    let replyContent = "";

    for await (const chunk of stream) {
      // Append each chunk of the response
      replyContent += chunk.choices[0]?.delta?.content || "";
    }

    await message.reply(replyContent);
  } catch (error) {
    console.error("Error with openAPI: ", error);
    message.reply("Sorry, something went wrong while processing your request");
  }
});

client.on("interactionCreate", async (interaction) => {
  // Check if the interaction is a command
  if (!interaction.isCommand()) return;

  const { user, commandName } = interaction;

  const { username } = user; //Further destructure to get username

  switch (commandName) {
    case "ping":
      await interaction.reply(`${username}, Pong!`);
      break;
    case "info":
      await interaction.reply(`Info command received from ${username}`);
      break;
    default:
      await interaction.reply(`Unknown command`);
      break;
  }
});
