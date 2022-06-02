const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');

let options = [{
    name: 'view',
    description: 'Choisissez si vous voulez voir le plan d\'action personnel ou général.',
    type: 'STRING',
    required: true,
    choices: [{name:'Personnel', value:'Personnel'}, {name:'Général', value:'Général'}]
}];

let projects = [];
mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      const query = 'SELECT * FROM projects WHERE fin > CURDATE() ORDER BY id DESC LIMIT 10';
      await connection.execute(query)
      .then(reponse => {
          if (reponse[0][1]) {

              reponse[0].forEach(project => {
                //   if (project['id']!='1') {
                      projects.push({ name: project['nom'], value: project['id'] });
                //   }
                  
              });

              options.push({
                name: 'project',
                description: 'Vous pouvez choisir un projet en particulier.',
                type: 'NUMBER',
                choices: projects
              });
              
          }
      })
  });

module.exports = {
    name: 'plan-action',
    description: 'Expose un plan d\'action',
    category: 'plan-action',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'plan-action [Personnel|Général] [Projet]',
    examples: ['plan-action'],
    options: options,
    async runInteraction(client,interaction) {

        const view = interaction.options.getString('view');

        const roles = ['Présidence', 'Communication', 'Secrétariat', 'Trésorerie', 'Production Vidéo', 'Informatique'];
        let role_name = '';
        let i = 0;

        while (i < interaction.member.roles.cache.size) {
            let role = await interaction.member.roles.cache.at(i);
                if (roles.includes(await role.name)) {
                    role_name = await role.name;  
                    i+= interaction.member.roles.cache.size;
                }
            
            i+=1;
        }
            
        

        let project = '';
        if (interaction.options.getNumber('project')) {
            project = 'AND project_id=' + interaction.options.getNumber('project');
        }
        else {
            project = '';
        }

        let query='';
        if (view == 'Personnel') {
            query = `SELECT *, plan_action.id as task_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM plan_action JOIN projects ON project_id = projects.id WHERE responsable ='${interaction.member.displayName}' ${project} AND pole='${role_name}' AND avancement!=1 ORDER BY priority DESC, deadline LIMIT 9;`;
        }
        else {
            query = `SELECT *, plan_action.id as task_id, date_format(deadline, '%d/%m à %H:%i') as dl FROM plan_action JOIN projects ON project_id = projects.id WHERE pole='${role_name}' ${project} AND avancement!=1 ORDER BY priority DESC, deadline LIMIT 9;`;
        }

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {
            connection.execute(query).then(reponse => {

                if (reponse[0][0]) {
                    let fields = [];

                    reponse[0].forEach(task => {

                        if (task['priority']==1) {
                            priority = ' | **Prioritaire**';
                        }
                        else {
                            if (new Date() > task['deadline']) {
                                priority = ' | **Deadline dépassée**';
                            }
                            else {
                                priority = '';
                            }
                            
                        }

                        fields.push(
                            { name: 'Pour le ' + task['dl'] + priority, value: '\u200B', inline: false },
                            { name: '\u200B', value: task['task'], inline: false },   
                            
                            task['task_id'],
                            task['priority'],
                            task['deadline'],
                            task['responsable'],
                            task['nom']
                        );

                    });

                    let planAction = [];
                    if (view == 'Personnel') {
                        planAction.push(
                            new MessageEmbed()
                            .setTitle(`Voici votre plan d\'action ${interaction.member.displayName.split(' ')[0]} !`)
                            .setColor('#ff0004')
                        );
                    }
                    else {
                        planAction.push(
                            new MessageEmbed()
                            .setTitle(`Voici le plan d\'action général de votre pôle !`)
                            .setColor('#ff0004')
                        );
                    }
                    

                    let i=0;
                    while (i < fields.length) {
                        if (fields[i+3]==1) {
                            color = '#ff0004';
                        }
                        else {
                            if (new Date() > fields[i+4]) {
                                color = '#FFD800';
                            }
                            else {
                                color = '#4C4C4C';
                            }
                            
                        }
                        
                        if (view == 'Personnel') {
                            planAction.push(
                            new MessageEmbed()
                            .setColor(color)
                            .addFields(
                                fields[i],
                                fields[i+1],
                            )
                            .addFields({ name: '\u200B', value: '__' }, { name: 'Projet : ', value: `${fields[i+6]}` })
                            .setFooter({ text: `Une fois cette tâche accomplie tapez /realized ${fields[i+2]}` })
                            );
                        }
                        else {
                            planAction.push(
                            new MessageEmbed()
                            .setColor(color)
                            .addFields(
                                fields[i],
                                fields[i+1],
                            )
                            .addFields({ name: '\u200B', value: '__' },{ name: 'Projet : ', value: `${fields[i+6]}`, inline: true }, { name: 'Membre assigné :', value: `${fields[i+5]}`, inline: true })
                            .setFooter({ text: `Une fois cette tâche accomplie tapez /realized ${fields[i+2]}` })
                            );
                        }
                        
                        i+=7;
                    }

                    interaction.reply({ embeds: planAction, ephemeral: true });

                }
                else {

                    let msg='';
                    if (view == 'Personnel') {
                        msg = 'Aucune tâche ne vous est assignée pour le moment.';
                    }
                    else {
                        msg = 'Aucune tâche n\'a été publiée pour le moment.';
                    }

                    embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription(msg)
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

            })
          });

    }
}