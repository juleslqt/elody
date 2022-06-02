const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'missions',
    description: 'Expose toutes les missions auxquelles vous êtes assignés.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: '/missions',
    examples: ['/missions'],
    options: [
        {
            name: 'mission_type',
            description: 'Souhaitez-vous voir les mission achevée ou en cours ?',
            type: 'STRING',
            required: true,
            choices: [{name: 'Progressing', value: 'Progressing'}, {name: 'Finished', value: 'Finished'}]
        }       
    ],
    async runInteraction(client,interaction) {

        const choice = interaction.options.getString('mission_type');


        if (choice == 'Progressing') {

        const query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE events.end_date > TIME(CURDATE() + INTERVAL 2 DAY) AND assigned_members_id LIKE '%${interaction.member.id},%' AND avancement!=1 ORDER BY importance DESC, events.id`;


        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

                let missions = [];
                let i = 0;
               if (response[0][0]) {
                
                   while (i < response[0].length) {

                        let color = '';
            
                        if (response[0][i]['importance'] == '01') {
                            // color = '#cd7f32'; // Bronze
                            color = '#0080ff'; // Bleu
                        }
                        else if (response[0][i]['importance'] == '02') {
                            // color = '#778899'; // Argent
                            color = '#32CD32'; // Vert
                        }
                        else if (response[0][i]['importance'] == '03') {
                            color = '#ffd700'; // Or
                        }
                        else {
                            color = '#ff0004';
                        }
            
                        let id = response[0][i]['event_mission_id'];

                        const guild = await client.guilds.cache.get(process.env.GUILD_ID);

                        let members_id = response[0][i]['assigned_members_id'].split(',');
                          let members = '';
                          let u = 0;

                          while (u < members_id.length) {
                            if (members_id[u] != '') {
                                members = members + (await guild.members.fetch(members_id[u])).displayName + '\n';
                            }
                            u+=1;
                          }

                          if (members.length == 0) {
                            members = members + 'Aucun';
                          }

                          let lettre = 'S';
                            if (response[0][i]['importance'] == 3) {
                                lettre = 'A';
                            }
                            else if (response[0][i]['importance'] == 2) {
                                lettre = 'B';
                            }
                            else if (response[0][i]['importance'] == 1) {
                                lettre = 'C';
                            }

                        missions.push( 
                        new MessageEmbed()
                          .setColor(color)
                          .setTitle(response[0][i]['nom'] + ' - ' + response[0][i]['titre'])
                          .setDescription(response[0][i]['description'])
                          .addFields(
                              {name: 'Deadline', value: response[0][i]['dl'], inline: true},
                              {name: 'Rang', value: lettre, inline: true},
                              {name: 'Responsable', value: response[0][i]['author'], inline: true},
                              {name: 'Membres assignés', value: members, inline: true}
                          )
                          .setFooter({ text: 'Une fois la mission achevée tapez /finished ' + id + '   '.repeat(20) + '.' })
                        );
                        i+=1;
                    }

                    await interaction.reply({ embeds: missions, ephemeral: true });
               }
               else {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`Vous n'avez choisi aucune mission pour l'instant.\nTapez **/choose** pour choisir une mission.`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
               }

          }).catch(err => console.log(err));  

    })
    }
    else {

        const query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE events.end_date > TIME(CURDATE() + INTERVAL 2 DAY) AND assigned_members_id LIKE '%${interaction.member.id},%' AND avancement=1 ORDER BY importance DESC, events.id`;


        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

                let missions = [];
                let i = 0;
               if (response[0][0]) {
                
                   while (i < response[0].length) {

                        let color = '';
            
                        if (response[0][i]['importance'] == '01') {
                            // color = '#cd7f32'; // Bronze
                            color = '#0080ff'; // Bleu
                        }
                        else if (response[0][i]['importance'] == '02') {
                            // color = '#778899'; // Argent
                            color = '#32CD32'; // Vert
                        }
                        else if (response[0][i]['importance'] == '03') {
                            color = '#ffd700'; // Or
                        }
                        else {
                            color = '#ff0004';
                        }
            
                        let id = response[0][i]['event_mission_id'];

                        const guild = await client.guilds.cache.get(process.env.GUILD_ID);

                        let members_id = response[0][i]['assigned_members_id'].split(',');
                          let members = '';
                          let u = 0;

                          while (u < members_id.length) {
                            if (members_id[u] != '') {
                                members = members + (await guild.members.fetch(members_id[u])).displayName + '\n';
                            }
                            u+=1;
                          }

                          if (members.length == 0) {
                            members = members + 'Aucun';
                          }

                          let lettre = 'S';
                            if (response[0][i]['importance'] == 3) {
                                lettre = 'A';
                            }
                            else if (response[0][i]['importance'] == 2) {
                                lettre = 'B';
                            }
                            else if (response[0][i]['importance'] == 1) {
                                lettre = 'C';
                            }
                            let note='';

                            if (response[0][i]['mark']=='none') {
                                note = 'En cours d\'évaluation...';
                            }
                            else {
                                if (parseInt(response[0][i]['mark']) < 2) {
                                    note = response[0][i]['mark'] + ' point';
                                }
                                else {
                                    note = response[0][i]['mark'] + ' points';
                                }
                                
                            }

                        missions.push( 
                        new MessageEmbed()
                          .setColor(color)
                          .setTitle(response[0][i]['nom'] + ' - ' + response[0][i]['titre'] + ' | ***' + note + '***')
                          .setDescription(response[0][i]['description'])
                          .addFields(
                              {name: 'Deadline', value: response[0][i]['dl'], inline: true},
                              {name: 'Rang', value: lettre, inline: true},
                              {name: 'Responsable', value: response[0][i]['author'], inline: true},
                              {name: 'Membres assignés', value: members, inline: true}
                          )
                          .setFooter({ text: 'Si vous voulez en savoir plus sur votre notation référez vous à votre responsable.' })
                        );
                        i+=1;
                    }

                    await interaction.reply({ embeds: missions, ephemeral: true });
               }
               else {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`Vous n'avez achevé aucune mission pour l'instant.\nTapez **/choose** pour choisir une mission.`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
               }

          }).catch(err => console.log(err));  

    })

    }
    }
}