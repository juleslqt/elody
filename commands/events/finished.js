const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'finished',
    description: 'Change le statut d\'une mission qui vous est assignée en \'Accomplie\'',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'finished [mission_id]',
    examples: ['finished 12'],
    options: [
        {
            name: 'mission_id',
            description: 'Choisissez le numéro de la mission qui a été accomplie.',
            type: 'STRING',
            required: true
        }
    ],
    async runInteraction(client,interaction) {

        const mission_id = interaction.options.getString('mission_id');

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(`SELECT id FROM missions WHERE event_mission_id ='${mission_id}'AND assigned_members_id LIKE '%${interaction.member.id}%' AND avancement!=1 ;`).then(async (response) => {
                if (response[0][0]) {
                    await connection.execute(`UPDATE missions SET avancement=1 WHERE event_mission_id ='${mission_id}' ;`);
                    embed = new MessageEmbed()
                        .setColor('#ff0004')
                        .setTitle('Mission accomplie !')
                        .setDescription('Votre responsable va maintenant évaluer votre travail.\nTapez **/missions finished** pour voir son retour sur votre mission.')
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return process.exit();
                }
                else {
                    embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription('Vous n\'êtes pas assigné à cette mission.\nTapez **/missions** pour vérifier à quelle mission vous êtes assigné.')
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            });

            
            

            }); 

    }
}