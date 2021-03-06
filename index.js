require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const { google } = require('googleapis');
const privatekey = require("./keys.json");

const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive']);

//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected to Google!");
    }
});

module.exports = {
    google: google,
    jwtClient: jwtClient
};

const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } } });
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const activities_list = [
    "Fuwa Fuwa Time",
    "Ina BGM",
    "RIDE ON TIME",
    "brendan complain",
    "Pop on Rocks",
    "conor singing <3",
    "logan chug jug",
    "korone",
    "city pop shark",
    "gooruh",
    "gawr gura",
    "eldritch horrors",
    "nyanners",
    "epic music",
];

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index], { type: 'LISTENING' }); // sets bot's activities to one of the phrases in the arraylist.
    }, 60000); // Runs this every 10 seconds.
});

client.on('message', message => {
    //quirky things
    if (message.content == 'a' && !message.author.bot) {
        return message.channel.send('same desu! GAWR GURA DESU!');
    }
    if (message.content == 'nin...' && !message.author.bot) {
        return message.channel.send('jin! :carrot:');
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You can not do this!');
        }
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('https://tenor.com/view/girls-und-panzers-girl-und-panzer-shit-gif-18968619');
    }
});

client.login(token);