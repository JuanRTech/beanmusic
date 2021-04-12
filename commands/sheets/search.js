const Discord = require('discord.js');
module.exports = {
    name: 'search',
    description: 'Search for ratings across all of Bean Music',
    aliases: ['find', 's'],
    execute(message, args) {
        if (args.length === 0) {
            return message.reply("you gotta search for something :pleading_face:");
        }

        message.channel.send("searching...");

        const spreadsheetId = '1BR-4SFwNXP_c1mK19AEXx7aa6PFfzaSJFDJ2bgKyU8k';
        const users = ['raw_dirtyj', 'raw_mrposhy', 'raw_glassarchon', 'raw_loqueres', 'raw_sola', 'raw_rohan', 'raw_brendwini', 'raw_kyotoyen', 'raw_ram'];
        const { jwtClient, google } = require('../../index.js');
        const sheets = google.sheets('v4');
        var results = [];
        var matches = [];

        try {
            for (let user of users) {
                results.push(sheets.spreadsheets.values.get({
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: user,
                }));
                console.log('search success for ' + user + ':');
            }

        } catch (err) {
            console.log('The API returned an error: ' + err);
        }

        Promise.all(results)
            .then((sheet) => {
                //matching time
                //0 - name
                //1 - type
                //2 - genre
                //3 - artist
                //4 - link
                //5 - comments
                //6 - rating
                //7 - time

                var searchstring = args.join(" ").toLowerCase();
                var re = new RegExp(searchstring, 'i');

                var pageindex = 0;
                for (let page of sheet) {
                    for (let song of page.data.values) {
                        if (song) {
                            for (let attribute of song) {
                                if (attribute.match(re)) {
                                    matches.push([pageindex, song])
                                    break;
                                }
                            }
                        }
                    }
                    pageindex++;
                }
                console.log(matches);

                for (let match of matches) {
                    if (!match[1]) {
                        continue;
                    }

                    const output = new Discord.MessageEmbed()
                        .setColor('#00FFFF')
                        .setTitle(match[1][0].length >=1 ? match[1][0] : 'No Title')
                        .setURL(match[1][4].length >=1 ? match[1][4] : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                        .setAuthor(match[1][3].length >=1 ? match[1][3] : 'No Author' )
                        .setDescription((match[1][1].length >=1 ? match[1][1] : 'No Type' )+ ' | ' + (match[1][2].length >=1 ? match[1][2] : 'No Genre'))
                        .addFields(
                            { name: 'Rated on', value: users[match[0]] },
                            { name: 'Comment', value: match[1][5].length >=1 ? match[1][5] : 'No Comment' },
                            { name: 'Rating', value: match[1][6].length >=1 ? match[1][6] : 'No Rating', inline: true },
                            { name: 'Date', value: match[1][7].length >=1 ? match[1][7] : 'No Date', inline: true },
                        )
                        .setFooter('Bean Music');

                    message.channel.send(output);
                }

                //no results found
                if (matches == 0) {
                    message.reply("No results found :weary:");
                    return;
                }

                message.channel.send("Done :clap:");
            })
    },
};