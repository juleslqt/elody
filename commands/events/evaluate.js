const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');


module.exports = {
    name: 'evaluate',
    description: 'Evaluer une tâche achevée par un membre.',
    category: 'events',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: '/evaluate',
    examples: ['/evaluate'],
    async runInteraction(client,interaction) {

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

        if (eventRoles.includes(role_name)) {
            query = `SELECT *, missions.description as mission_description, missions.id as mission_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM missions JOIN events ON event_mission_channel_id=mission_channel_id WHERE author='${interaction.member.displayName}' AND assigned_members_id LIKE '%,%' AND avancement=1 AND mark='none' ORDER BY events.id DESC LIMIT 1;`;

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(query).then(async (response) => {

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
                          .setFooter({ text: id + '   '.repeat(50) + '.' })
                        );
                        i+=1;
                    }

                    await interaction.reply({ embeds: missions, components: marks, ephemeral: true });
               }
               else {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`Aucune mission n'a été achevée pour l'instant.`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
               }

          }).catch(err => console.log(err));  

    })
        }
        else {
            query = `SELECT *, date_format(deadline, '%d/%m à %H:%i') as dl FROM plan_action WHERE pole='${role_name}' AND avancement=1 AND mark='none' ORDER BY id DESC LIMIT 1;`;

            // console.log(query);

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
        }
}
}