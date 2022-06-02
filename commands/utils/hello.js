const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'hello',
    description: 'Gagnez des points au classement.',
    category: 'utils',
    roles:[process.env.MEMBERS_ROLE_ID,],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: '/hello',
    examples: ['/hello'],
    async runInteraction(client,interaction) {

        const query = `SELECT *, DATE_FORMAT(try_date, '%Y-%m-%dT%H:%i:%s') as dl FROM members WHERE discord_id='${interaction.member.id}' OR try_date > CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-%d '), '09:00:00');`;

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

                let embed = new MessageEmbed();
                let points;
                var tryDate;
                var daily_point;
                let tryDates = [];
                let i = 0;
                while (i < response[0].length) {
                    if (response[0][i]['discord_id']==interaction.member.id) {
                        tryDate = new Date(response[0][i]['dl']);
                        daily_point = response[0][i]['daily_point'];
                    }
                    else {
                        tryDates.push(response[0][i]['dl']);
                    }
                    
                    i+=1;
                }
                
                var currentDate = new Date();
                var validDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(),3,43);
                var maxTryDate = new Date(tryDates.sort().reverse()[0]);

                if (maxTryDate < validDate || maxTryDate=='Invalid Date') {
                    maxTryDate = new Date();
                }

                if (maxTryDate >= currentDate && !interaction.channel.name.includes('Réunion - ')) {
                    points = 2;
                    gain = '2 points';
                    first = '**Vous êtes le premier !**\n';
                    color = '#ff0004';
                }
                else {
                    points = 1;
                    gain = '1 point';
                    first = '\u200B';
                    color = '#ffd700';
                }

                if (interaction.channel.name.includes('Réunion - ') && (validDate > tryDate && currentDate >= validDate)) {
                    points = 4;
                    gain = '4 points';
                    first = '\u200B';
                    color = '#ff0004';
                }

                if ((validDate > tryDate && currentDate >= validDate) || (daily_point==0 && interaction.channel.isThread() && interaction.channel.name.includes('Réunion - '))) {
                    let reunion = '';
                    if (interaction.channel.name.includes('Réunion - ')) {
                        reunion = ',daily_point=1';
                    }
                    else {
                        reunion = ',daily_point=0';
                    }
                    const query2 = `UPDATE members SET score=score+${points}, try_date='${moment(currentDate).format("YYYY-MM-DD HH:mm:ss")}'${reunion} WHERE discord_id='${await interaction.member.id}'`;
                    connection.execute(query2);

                    embed
                    .setColor(color)
                    .setTitle('Vous avez gagné ' + gain + '')
                    .setDescription(first + 'Tapez **/ranking** pour connaître votre score.')

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    
                }
                else {
                    embed
                    .setColor('#778899')
                    .setTitle('Vous avez déjà obtenu vos points journaliers')
                    .setFooter({ text: 'Tapez /ranking pour connaître votre score.' })

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            });  

    })
}
}