module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        const pings = ["wah!", "あ", "a", "hic", "guh", "konpeko", "sex"];
        message.channel.send(pings[Math.floor(Math.random() * pings.length)]);
    },
};