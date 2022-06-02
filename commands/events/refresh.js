const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'refresh',
    description: 'Expose toutes les missions disponibles d\'un événement',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: '/refresh',
    examples: ['/refresh'],
    async runInteraction(client,interaction) {

        if (interaction.channel.name != 'missions') {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Rendez-vous dans un canal nommé **missions** pour executer cette commande.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE events.end_date > TIME(CURDATE() + INTERVAL 2 DAY) AND event_mission_channel_id='${interaction.channel.id}' AND avancement!=1 ORDER BY importance DESC`;

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

                let missions = [];
               if (response[0][0]) {
                    response[0].forEach(async mission => {

                        let color = '';
                        let level = '';
            
                        if (mission['importance'] == '01') {
                            // color = '#cd7f32'; // Bronze
                            color = '#0080ff'; // Bleu
                            level = 'C';

                        }
                        else if (mission['importance'] == '02') {
                            // color = '#778899'; // Argent
                            color = '#32CD32'; // Vert
                            level = 'B';
                        }
                        else if (mission['importance'] == '03') {
                            color = '#ffd700'; // Or
                            level = 'A';
                        }
                        else {
                            color = '#ff0004';
                            level = 'S';
                        }
            
                        let id = ('' + mission['event_mission_id']);

                        missions.push( 
                            new MessageEmbed()
                            .setTitle(level + ' - ' + mission['titre'])
                            .setColor(color)
                            .setDescription(mission['mission_description'])
                            .addFields({value: '**Places disponibles : ' + mission['staff'] + '**', name: '\u200B', inline: true})
                            .setFooter({text: 'Par ' + mission['author'] + '   '.repeat(30) + id})
                        );

                    })

                    await interaction.reply({ embeds: missions, ephemeral: true });
               }
               else {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`Aucune mission n'a été publié pour l'instant.`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
               }

          }).catch(err => console.log(err));  

    })
}
}