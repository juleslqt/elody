const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
let moment = require('moment') ;
const { MessageEmbed } = require('discord.js');

let members = [];
let poles = [];
let projects = [];
let currentDate = new Date();
const years = [{ name: '' + currentDate.getFullYear(), value: '' + currentDate.getFullYear() },{ name: '' + (currentDate.getFullYear() + 1), value: '' + (currentDate.getFullYear() + 1) },{ name: '' + (currentDate.getFullYear() + 2), value: '' + (currentDate.getFullYear() + 2) },{ name: '' + (currentDate.getFullYear() + 3), value: '' + (currentDate.getFullYear() + 3) },{ name: '' + (currentDate.getFullYear() + 4), value: '' + (currentDate.getFullYear() + 4) }];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT nom, prenom, pole_poste FROM members JOIN postes ON members.id_poste=postes.id ;`).then(async (response) => {
        response[0].forEach(member => {

            members.push({ name: member['prenom'] + ' ' + member['nom'], value: member['prenom'] + ' ' + member['nom'] });
            poles[member['prenom'] + ' ' + member['nom']]=member['pole_poste'];

        })
      })
  }).catch(err => console.log(err));

  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute('SELECT * FROM projects WHERE fin > CURDATE() ORDER BY id DESC LIMIT 10').then(async (response) => {
        response[0].forEach(project => {

            projects.push({ name: project['nom'], value: project['id'] });

        })
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'new-task',
    description: 'Crée une nouvelle tâche pour un membre sélectionné.',
    category: 'responsables',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'new-task [description] [responsable] [priority] [project] [deadline_day] [deadline_month] [deadline_year] [deadline_hour] [deadline_minutes] ',
    examples: ['new-task Faire la vaisselle Michel Sardou OUI Gala 12 6 2001 18 30 '],
    options: [
        {
            name: 'description',
            description: 'Décrivez la tâche à accomplir',
            type: 'STRING',
            required: true
        },
        {
            name: 'responsable',
            description: 'Personne qui doit accomplir cette tâche',
            type: 'STRING',
            required: true,
            choices: members
        },
        {
            name: 'priority',
            description: 'La tâche est-elle prioritaire ?',
            type: 'NUMBER',
            required: true,
            choices: [{name:'OUI',value:1},{name:'NON',value:0}]
        },
        {
            name: 'project',
            description: 'La tâche contribue-t-elle à un projet ?',
            type: 'NUMBER',
            required: true,
            choices: projects
        },
        {
            name: 'deadline_day',
            description: 'Jour durant lequelle la tâche devra être accomplie',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'deadline_month',
            description: 'Mois durant lequelle la tâche devra être accomplie',
            type: 'STRING',
            required: true,
            choices: [{name:'Janvier',value:'01'},{name:'Février',value:'02'},{name:'Mars',value:'03'},{name:'Avril',value:'04'},{name:'Mai',value:'05'},{name:'Juin',value:'06'},{name:'Juillet',value:'07'},{name:'Août',value:'08'},{name:'Septembre',value:'09'},{name:'Octobre',value:'10'},{name:'Novembre',value:'11'},{name:'Décembre',value:'12'}]
        },
        {
            name: 'deadline_year',
            description: 'Année durant laquelle la tâche devra être accomplie',
            type: 'STRING',
            required: true,
            choices: years
        },
        {
            name: 'deadline_hour',
            description: 'Heure à laquelle la tâche devra être accomplie',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:'01',value:'01'},{name:'02',value:'02'},{name:'03',value:'03'},{name:'04',value:'04'},{name:'05',value:'05'},{name:'06',value:'06'},{name:'07',value:'07'},{name:'08',value:'08'},{name:'09',value:'09'},{name:10,value:'10'},{name:11,value:'11'},{name:12,value:'12'},{name:13,value:'13'},{name:14,value:'14'},{name:15,value:'15'},{name:16,value:'16'},{name:17,value:'17'},{name:18,value:'18'},{name:19,value:'19'},{name:20,value:'20'},{name:21,value:'21'},{name:22,value:'22'},{name:23,value:'23'}]
        },
        {
            name: 'deadline_minute',
            description: 'Minute à laquelle la tâche devra être accomplie',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:15,value:'15'},{name:30,value:'30'},{name:45,value:'45'}]
        },
        
    ],
    async runInteraction(client,interaction) {

        const description = interaction.options.getString('description');
        let day = interaction.options.getNumber('deadline_day');
        const month = interaction.options.getString('deadline_month');
        const year = interaction.options.getString('deadline_year');
        const hour = interaction.options.getString('deadline_hour');
        const minute = interaction.options.getString('deadline_minute');
        const responsable = interaction.options.getString('responsable');
        const priority = interaction.options.getNumber('priority');
        const project = interaction.options.getNumber('project');

        let dateTest = year + '-' + month + '-' + day;
        
        while (!moment(dateTest, 'YYYY-MM-DD',true).isValid()) {
            day-=1;
            dateTest = year + '-' + month + '-' + day;
        };

        const deadline = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            const responseEmbed = new MessageEmbed()
            .setTitle('Tâche ajoutée au plan d\'action !')
            .setDescription(`Un message privé a été envoyé pour avertir ${responsable}.`)

            let setPriority = '';

            if (priority==1) {
                setPriority = ' | **Prioritaire**';
            }

            let setProject = '';

            if (project != 0) {
                projects.forEach(line => {
                    if (line['value']==project) {
                        setProject = 'En lien avec le projet : ' + line['name'];
                    }
                })
                
            }

            const privateEmbed = new MessageEmbed()
            .setTitle('Nouvelle tâche ajoutée à votre plan d\'action !')
            .addFields(
                { name: 'Pour le ' + day + '/' + month + ' à ' + hour + ':' + minute + setPriority, value: '\u200B', inline: false },
                { name: '\u200B', value: description, inline: false }
                
            )
            .setFooter({text: setProject })
            

            await connection.execute(`INSERT INTO plan_action (task, responsable, pole, deadline, priority, project_id) VALUES ('${description}', '${responsable}', '${poles[responsable]}', '${deadline}', ${priority}, ${project}) ;`);
            const guild = await client.guilds.cache.get(process.env.GUILD_ID);
            const list = await guild.members.list({ limit: guild.memberCount });
            const member = await list.find(member => member.displayName === responsable);
            const DM = await member.createDM();
            DM.send({ embeds: [privateEmbed] });
            await interaction.reply({ embeds: [responseEmbed], ephemeral: true })
            return process.exit();
            });


    }
}