const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'mark',
    async runInteraction(client,interaction) {
        const value = (await interaction.values[0]).split(',');

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async connection => {

            const query1 = `SELECT importance, assigned_members_id FROM missions WHERE id=${value[1]}`;
            await connection.execute(query1).then(async reponse => {
                let mark = '';
                const level = reponse[0][0]['importance'];
                if (value[0]=='3') {
                    if (level=='5') {
                        mark = '1'; 
                    }
                    else if (level=='3') {
                        mark = '1';
                    }
                    else if (level=='2') {
                        mark = '1';
                    }
                    else {
                        mark = '0';
                    }
                }
                else if (value[0]=='2') {
                    if (level=='5') {
                        mark = '2'; 
                    }
                    else if (level=='3') {
                        mark = '2';
                    }
                    else if (level=='2') {
                        mark = '1';
                    }
                    else {
                        mark = '0';
                    }
                }
                else {
                    mark = level + '';
                }

                const query2 = `UPDATE missions SET mark='${mark}' WHERE id=${value[1]}`;
                await connection.execute(query2);

                let query3 = `UPDATE members SET score=score+${mark} WHERE `;
                const guild = client.guilds.cache.get(process.env.GUILD_ID);
                const members_id = reponse[0][0]['assigned_members_id'].split(',');
                let o=0;

                while (o < members_id.length) {
                    if (members_id[o]!='') {

                        if (o > 0) {
                            query3 = query3 + ' OR ';
                        }
                        query3 = query3 + `discord_id='${members_id[o]}'`; 
                    }
                    
                    o+=1;
                }

                await connection.execute(query3);


                const query4 = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE author='${interaction.member.displayName}' AND avancement=1 AND mark='none' AND assigned_members_id LIKE '%,%' ORDER BY events.id DESC LIMIT 1;`;

                await connection.execute(query4).then(async (response) => {

                    let missions = [];
                    let marks = [];
                    let i = 0;
                   if (response[0][0]) {
                    
                       while (i < response[0].length) {
    
                        marks.push(
                            new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('mark')
                                    .setPlaceholder(response[0][i]['nom'] + ' - ' + response[0][i]['titre'])
                                    .addOptions(
                                        {label: '100%', value: '1,' + response[0][i]['mission_id']},
                                        {label: '50%', value: '2,' + response[0][i]['mission_id']},
                                        {label: '20%', value: '3,' + response[0][i]['mission_id']},
                                    ),
                            ));
    
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
                                  {name: 'Membres assignés', value: members, inline: true}
                              )
                              .setFooter({ text: 'Numéro : ' + id })
                            );
                            i+=1;
                        }
    
                        await interaction.reply({ embeds: missions, components: marks, ephemeral: true });
                   }
                   else {
                    embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription(`Aucune autre mission n'a été achevée pour l'instant.`)
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                   }
    
              }).catch(err => console.log(err));
            })
          })
        
    }
};