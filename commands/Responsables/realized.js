const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'realized',
    description: 'Change le statut d\'une tâche qui vous est assignée en \'Accomplie\'',
    category: 'Responsables',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'realized [task_id]',
    examples: ['realized 12'],
    options: [
        {
            name: 'task_id',
            description: 'Choisissez le numéro de la tâche qui a été accomplie',
            type: 'STRING',
            required: true
        }
    ],
    async runInteraction(client,interaction) {

        const taskId = interaction.options.getString('task_id');

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(`SELECT id FROM plan_action WHERE id ='${taskId}'AND responsable = '${interaction.member.displayName}' AND avancement!=1 ;`).then(async (response) => {
                if (response[0][0]) {
                    await connection.execute(`UPDATE plan_action SET avancement=1 WHERE id ='${taskId}' ;`);
                    embed = new MessageEmbed()
                        .setColor('#ff0004')
                        .setDescription('Tâche accomplie !')
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return process.exit();
                }
                else {
                    embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription('Cette tâche ne vous est pas assignée.')
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            });

            
            

            }); 

    }
}