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
    const query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE events.end_date > TIME(CURDATE() + INTERVAL 2 DAY) AND avancement!=1 ORDER BY importance DESC`;
      await connection.execute(query)
      .then(async (response) => {
        let nbMissions = await response[0].length;
        if (nbMissions==0) {
            missions.push({name: 'Aucune mission n\'est disponible.', value: 0});
        }
        else {
            response[0].forEach(mission => {

                
                if (parseInt(mission['staff']) > 0) {

                    let lettre = 'S';
                    if (mission['importance'] == 3) {
                        lettre = 'A';
                    }
                    else if (mission['importance'] == 2) {
                        lettre = 'B';
                    }
                    else if (mission['importance'] == 1) {
                        lettre = 'C';
                    }

                    missions.push({name: `${lettre} | ` + mission['nom'] + ' - ' + mission['titre'] + ` (${mission['staff']} places disponibles)`, value: mission['mission_id']});
                }
                
            })
        }
        
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'choose',
    description: 'Vous assigne à une mission.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'choose [mission_name]',
    examples: ['choose Opération Faucon'],
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


                  await connection.execute(`SELECT *, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions WHERE id=${id}`)
                  .then(async reponse => {
                      if (!reponse[0][0]) {
                        embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription(`Aucune mission n'a été publié pour l'instant.`)
                          return interaction.reply({ embeds: [embed], ephemeral: true });
                      }
                      if (reponse[0][0]['staff'] > 0) {
                          if (reponse[0][0]['assigned_members_id'].split(',').includes(await interaction.member.id)) {
                            embed = new MessageEmbed()
                            .setColor('#778899')
                            .setDescription(`Vous êtes déjà assigné à cette mission.`)
                              return interaction.reply({ embeds: [embed], ephemeral: true });
                          };
                          const staff = parseInt(reponse[0][0]['staff'])-1;
                          const new_assigned_member_id = reponse[0][0]['assigned_members_id'] + await interaction.member.id + ',';
                          const query = `UPDATE missions SET staff='${staff}', assigned_members_id='${new_assigned_member_id}' WHERE id=${id}`;
                          await connection.execute(query);

                          const guild = await client.guilds.cache.get(process.env.GUILD_ID);
                            
                          let members_id = new_assigned_member_id.split(',');
                          let members = '';
                          let i = 0;

                          while (i < members_id.length) {
                            if (members_id[i] != '') {
                                members = members + (await guild.members.fetch(members_id[i])).displayName + '\n';
                            }
                            i+=1;
                          }

                          if (members.length == 0) {
                            members = members + 'Aucun';
                          }
                            
                          let lettre = 'S';
                            if (reponse[0][0]['importance'] == 3) {
                                lettre = 'A';
                            }
                            else if (reponse[0][0]['importance'] == 2) {
                                lettre = 'B';
                            }
                            else if (reponse[0][0]['importance'] == 1) {
                                lettre = 'C';
                            }

                            

                          let reponseEmbed = new MessageEmbed()
                          .setColor('#0080ff')
                          .setTitle('Vous êtes désormais assigné à ' + reponse[0][0]['titre'])
                          .setDescription(reponse[0][0]['description'])
                          .addFields(
                              {name: 'Deadline', value: reponse[0][0]['dl'], inline: true},
                              {name: 'Rang', value: lettre, inline: true},
                              {name: 'Responsable', value: reponse[0][0]['author'], inline: true},
                              {name: 'Membres assignés', value: members, inline: false}
                          )
                          .setFooter({ text: 'Si vous ne souhaitez pas être assigné à cette mission faites le savoir à votre responsable.' })


                          await interaction.reply({ embeds: [reponseEmbed], ephemeral: true });
                      }
                      else {
                          let reponseEmbed = new MessageEmbed()
                          .setColor('#ff0004')
                          .setTitle('Cette mission n\'est plus disponible')
                          .setDescription('Pour mettre à jour la liste appuyez sur **ctrl** et **R** simultanément.\nVous pouvez aussi avoir une vu d\'ensemble sur les missions de cet événement en tapant **/refresh**.')

                          await interaction.reply({ embeds: [reponseEmbed], ephemeral: true });
                      }
                  })
                  
                })

    }
}