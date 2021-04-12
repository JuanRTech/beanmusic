module.exports = {
    name: 'info',
    description: 'Info about Bean Music',
    aliases: ['about', 'join', 'git', 'github'],
    execute(message, args) {
        const info = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Bean Music')
            .setURL('https://discord.js.org/')
            .setAuthor('RATE ALL THE SONGS', 'https://discord.js.org')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'What even is this?', value: 'The BeanBox is rating every song ever...' },
                { name: 'What do I do?', value: 'I\'m a bot that lets you search through all of the user ratings!', inline: true },
                { name: 'I want to join!', value: 'ping dirtyj', inline: true },
            )
            .setFooter('Source code', 'https://github.com/JuanRTech/beanmusic');

        channel.send(info);
    },
};