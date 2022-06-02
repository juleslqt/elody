const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'mark_pl',
    async runInteraction(client,interaction) {
        const value = (await interaction.values[0]).split(',');

        const eventRoles = ['Événement dégustation', 'Levée de fonds'];
        const otherRoles = ['Présidence', 'Communication', 'Secrétariat', 'Trésorerie', 'Production Vidéo', 'Informatique', 'Événement dégustation', 'Levée de fonds'];
        let role_name = '';
        let i = 0;

        while (i < interaction.member.roles.cache.size) {
            let role = await interaction.member.roles.cache.at(i);
                if (otherRoles.includes(await role.name)) {
                    role_name = await role.name;  
                    i+= interaction.member.roles.cache.size;
                }
            
            i+=1;
        }

        let query;

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async connection => {

            const query1 = `SELECT priority, responsable FROM plan_action WHERE id=${value[1]}`;
            await connection.execute(query1).then(async reponse => {
                let mark = '';
                const level = reponse[0][0]['priority'];
                if (value[0]=='3') {
                    mark = '0';
                }
                else if (value[0]=='2') {
                    mark = '2';
                }
                else {
                    if (level == 1) {
                        mark = '5';
                    }
                    else {
                        mark = '3';
                    }
                }

                const query2 = `UPDATE plan_action SET mark='${mark}' WHERE id=${value[1]}`;
                await connection.execute(query2);

                const member = reponse[0][0]['responsable'].split(' ');
                let query3 = `UPDATE members SET score=score+${mark} WHERE nom='${member[1]}' AND prenom='${member[0]}'`;
                await connection.execute(query3);


                const query4 = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE author='${interaction.member.displayName}' AND avancement=1 AND mark='none' AND assigned_members_id LIKE '%,%' ORDER BY events.id DESC LIMIT 1;`;

                await connection.execute(query4).then(async (response) => {

                    query = `SELECT *, date_format(deadline, '%d/%m à %H:%i') as dl FROM plan_action WHERE pole='${role_name}' AND avancement=1 AND mark='none' ORDER BY id DESC LIMIT 1;`;

                    mysql.createConnection({
                        host: process.env.DATABASE_HOST,
                        user: process.env.DATABASE_USER,
                        password: process.env.DATABASE_PASSWORD,
                        database: process.env.DATABASE,
                      }).then(async (connection) => {
            
                        await connection.execute(query).then(async (response) => {
            
                            let tasks = [];
                            let marks = [];
                            let i = 0;
                           if (response[0][0]) {
                            
                               while (i < response[0].length) {
            
                                marks.push(
                                    new MessageActionRow()
                                    .addComponents(
                                        new MessageSelectMenu()
                                            .setCustomId('mark_pl')
                                            .setPlaceholder('Affectez une note.')
                                            .addOptions(
                                                {label: '100%', value: '1,' + response[0][i]['id']},
                                                {label: '50%', value: '2,' + response[0][i]['id']},
                                                {label: '20%', value: '3,' + response[0][i]['id']},
                                            ),
                                    ));
        
                                    let color = '#32CD32';
        
                                    if (response[0][i]['priority'] == 1) {
                                        color = '#ff0004';
                                    }
        
                                    tasks.push( 
                                    new MessageEmbed()
                                      .setColor(color)
                                      .setDescription(response[0][i]['task'])
                                      .addFields(
                                          {name: 'Deadline : ', value: response[0][i]['dl'], inline: true},
                                          {name: 'Responsable : ', value: response[0][i]['responsable'], inline: true}
                                      )
                                      .setFooter({ text: '.' + '   '.repeat(50) + '.' })
                                    );
                                    i+=1;
                                }
            
                                await interaction.reply({ embeds: tasks, components: marks, ephemeral: true });
                           }
                           else {
                            embed = new MessageEmbed()
                                .setColor('#778899')
                                .setDescription(`Aucune tâche n'a été achevée pour l'instant.`)
                            return interaction.reply({ embeds: [embed], ephemeral: true });
                           }
            
                      }).catch(err => console.log(err));  
            
                })

              }).catch(err => console.log(err));
            })
          })
        
    }
};