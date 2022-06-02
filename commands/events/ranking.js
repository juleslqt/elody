const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'ranking',
    description: 'Affiche le classement.',
    category: 'events',
    roles:[process.env.MEMBERS_ROLE_ID,],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: '/ranking',
    examples: ['/ranking'],
    async runInteraction(client,interaction) {


        const query = `SELECT * FROM members JOIN postes ON id_poste=postes.id WHERE nom_poste!='Responsable' ORDER BY score DESC;`;

        let embeds = [];

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

                let i = 1;
                let fields = [];

                while (i < response[0].length+1) {

                    i = i+'';
                    if (i.length == 1) {
                        i = '0' + i;
                    }

                    let identity;

                    if (interaction.member.displayName == (response[0][i-1]['prenom'] + ' ' + response[0][i-1]['nom'])) {
                        identity = '***' + response[0][i-1]['prenom'] + ' ' + response[0][i-1]['nom'] + '***';
                    }
                    else {
                        identity = response[0][i-1]['prenom'] + ' ' + response[0][i-1]['nom'];
                    }

                       fields.push(
                        {name: i + '    |', value: '__', inline: true},
                        {name: '\u200B' + ' '.repeat(24) + identity + ' '.repeat(24) + '\u200B', value: '\u200B', inline: true},
                        {name: '|    ' + response[0][i-1]['score'], value: '\u200B', inline: true}
                        ) 

                    i=parseInt(i);
                    i+=1;
                }

                let u = 0;
                let color = '';

                while (u < fields.length) {

                    if (u < 24) {
                        color = '#ff0004';
                    }
                    else if (u < 48) {
                        color = '#ffd700';
                    }
                    else if (u < 72) {
                        color = '#32CD32';
                    }
                    else {
                        color = '#0080ff';
                    }

                    embeds.push(new MessageEmbed()
                        .setColor(color)
                        .addFields(
                            fields.slice(u,u+24),
                        )
                        .setFooter({text: '.' + '   '.repeat(50) + '.'})
                    )
                    u+=24;
                }

                

                await interaction.reply({ embeds: embeds, ephemeral: true })
            });  

    })
}
}