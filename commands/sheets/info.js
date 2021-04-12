const Discord = require('discord.js');
module.exports = {
    name: 'info',
    description: 'Info about Bean Music',
    aliases: ['about', 'join', 'git', 'github'],
    execute(message, args) {
        const info = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Bean Music')
            .setURL('https://docs.google.com/spreadsheets/d/1BR-4SFwNXP_c1mK19AEXx7aa6PFfzaSJFDJ2bgKyU8k/edit?usp=sharing')
            .setAuthor('RATE ALL THE SONGS')
            .addFields(
                { name: 'What even is this?', value: 'The BeanBox is rating every song ever...' },
                { name: 'What do I do?', value: 'I\'m a bot that lets you search through all of the user ratings!', inline: true },
                { name: 'I want to join!', value: 'ping dirtyj', inline: true },
            )
            .setFooter('Bean Music', 'https://github.com/JuanRTech/beanmusic');

        message.channel.send(info);
    },
};
