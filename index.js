const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });

async function HttpRequest(method, url) {
  const { default: fetch } = await import('node-fetch');
  const response = await fetch(url, { method });
  return response;
}

var package = require("./package.json");

var config = {
  version: package.version,
  color: "584dff",
  prefix: "!",
  animal_images_channel: process.env.ANIMAL_CHANNEL_ID,
  request: HttpRequest,
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  console.log(
    `\nVariables:\nprefix: ${config.prefix}\nanimal_images_channel: ${config.animal_images_channel}`
  );
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.execute(msg, args, config);
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      msg.reply("Invalid command!").then((message) => {
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 5000);
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
