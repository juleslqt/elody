const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
// const dateformat = import('dateformat');
// const { dateformat } = require('dateformat');
const { MessageEmbed } = require('discord.js');

let events = [];
let events_id = [];
let event_id = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT * FROM events WHERE end_date > TIME(CURDATE() + INTERVAL 2 DAY) ORDER BY id DESC `).then(async (response) => {
        let nbEvents = await response[0].length;
        if (nbEvents==0) {
            events.push({name: 'Aucun événement n\'a été créé.', value: '0'});
        }
        else {
            response[0].forEach(event => {

                events.push({name: event['nom'], value: event['discord_id']+','+event['discord_category_id']});
                events_id.push(event['discord_id']+'');
                event_id.push(event['discord_id']+'', event['id']+'');

            })
        }
        
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'delete-event',
    description: 'Supprime un événement.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID,process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_EVENTS'],
    ownerOnly: false,
    usage: 'delete-event [event_name]',
    examples: ['delete-event Gala'],
    options: [
        {
            name: 'event_name',
            description: 'Nom de l\'événement.',
            type: 'STRING',
            required: true,
            choices: events
        }       
    ],
    async runInteraction(client,interaction) {

        const name = interaction.options.getString('event_name');
        const discord_id = name.split(',')[0];
        const discord_category_id = name.split(',')[1];

        if (!events_id.includes(discord_id)) {
            if (discord_id!=0) {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`L\'événement n\'existe pas.\nAucun événement n\'a été supprimé.`)
                return interaction.reply({embeds: [embed], ephemeral: true });
            }
            else {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`Aucun événement n\'a été supprimé.`)
                return interaction.reply({embeds: [embed], ephemeral: true });
            }
            
        }
        else {

            mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
              }).then(async (connection) => {
                const sql_event_id = await event_id[event_id.indexOf(discord_id)+1];
                const query1 = `DELETE FROM events WHERE discord_id=${discord_id};`;
                const query2 = `DELETE FROM missions WHERE event_mission_id LIKE '${sql_event_id+'%'}'`;

                  await connection.execute(query1);
                  await connection.execute(query2);
                  let event = await client.guilds.cache.get(process.env.GUILD_ID).scheduledEvents.fetch(discord_id);

                  const embed = new MessageEmbed()
                    .setColor('#ff0004')
                    .setDescription(`L'événement ${event.name} a été supprimé.`)
                    .setTimestamp()

                    await event.delete();

                    await interaction.reply({ embeds: [embed], ephemeral: true });

                    const category = await interaction.guild.channels.fetch(discord_category_id);
                    await category.children.forEach( async channel => await channel.delete());
                    await category.delete();
    
                  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
                  
                  await logChannel.send({ embeds: [embed] });
                  return process.exit();
                  
                })

        }

    }
}