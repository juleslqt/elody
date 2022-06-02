const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
// const dateformat = import('dateformat');
// const { dateformat } = require('dateformat');
const { MessageEmbed } = require('discord.js');

let missions = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
    const query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE events.end_date > TIME(CURDATE() + INTERVAL 2 DAY)`;
      await connection.execute(query)
      .then(async (response) => {
        let nbMissions = await response[0].length;
        if (nbMissions==0) {
            missions.push({name: 'Aucune mission n\'a été publiée.', value: 0});
        }
        else {
            response[0].forEach(mission => {

                missions.push({name: mission['nom'] + ' - ' + mission['titre'], value: mission['mission_id']});

            })
        }
        
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'delete-mission',
    description: 'Supprime un événement.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID,process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_EVENTS'],
    ownerOnly: false,
    usage: 'delete-mission [mission_name]',
    examples: ['delete-mission Opération Faucon'],
    options: [
        {
            name: 'mission_name',
            description: 'Titre de la mission.',
            type: 'NUMBER',
            required: true,
            choices: missions
        }       
    ],
    async runInteraction(client,interaction) {

        const id = interaction.options.getNumber('mission_name');

            mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
              }).then(async (connection) => {
                  await connection.execute(`DELETE FROM missions WHERE id=${id}`)

                  let embed = new MessageEmbed();
                  if (id !== 0) {
                    embed
                        .setColor('#ff0004')
                        .setDescription(`La mission a été supprimé.`)
                        .setTimestamp()
                  }
                  else {
                    embed
                        .setColor('#778899')
                        .setDescription(`Aucune mission n'a été supprimé.`)
                  }
                 
    
                  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
                  await interaction.reply({ embeds: [embed], ephemeral: true });
                  await logChannel.send({ embeds: [embed] });
                  return process.exit();
                  
                })

    }
}