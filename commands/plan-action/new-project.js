const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
// const dateformat = import('dateformat');
// const { dateformat } = require('dateformat');
const { MessageEmbed } = require('discord.js');

let currentDate = new Date();
const years = [{ name: '' + currentDate.getFullYear(), value: '' + currentDate.getFullYear() },{ name: '' + (currentDate.getFullYear() + 1), value: '' + (currentDate.getFullYear() + 1) },{ name: '' + (currentDate.getFullYear() + 2), value: '' + (currentDate.getFullYear() + 2) },{ name: '' + (currentDate.getFullYear() + 3), value: '' + (currentDate.getFullYear() + 3) },{ name: '' + (currentDate.getFullYear() + 4), value: '' + (currentDate.getFullYear() + 4) }];

let projects = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT nom FROM projects WHERE fin > CURDATE() ORDER BY id DESC `).then(async (response) => {
        response[0].forEach(project => {

            projects.push(project['nom'].toLowerCase());

        })
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'new-project',
    description: 'Crée un nouveau projet dans le plan d\'action.',
    category: 'responsables',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'new-project [project_name] [deadline_day] [deadline_month] [deadline_year] [deadline_hour] [deadline_minutes]',
    examples: ['new-project Gala 12 6 2001 18 30'],
    options: [
        {
            name: 'project_name',
            description: 'Nom du projet.',
            type: 'STRING',
            required: true
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

        const name = interaction.options.getString('project_name');
        let day = interaction.options.getNumber('deadline_day');
        const month = interaction.options.getString('deadline_month');
        const year = interaction.options.getString('deadline_year');
        const hour = interaction.options.getString('deadline_hour');
        const minute = interaction.options.getString('deadline_minute');

        if (projects.includes(name.toLowerCase())) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Le projet ' + name + ' existe déjà.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let dateTest = year + '-' + month + '-' + day;
        
        
        while (!moment(dateTest, 'YYYY-MM-DD',true).isValid()) {
            day-=1;
            dateTest = year + '-' + month + '-' + day;
        };

        const deadline = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';


        if (new Date(dateTest) < new Date ) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('La date de fin de projet (' + day + '/' + month + '/' + year + ' à ' + hour + ':' + minute + ') est déjà passée.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
            }).then(async (connection) => {

            const responseEmbed = new MessageEmbed()
            .setTitle('Nouveau projet créé !')
            .setDescription(`Vous pouvez désormais sélectionner le projet **${name}** en ajoutant une tâche au plan d'action. Tapez **ctrl + R** s'il n'apparaît pas.`)
            

            await connection.execute(`INSERT INTO projects (nom, fin) VALUES ('${name}', '${deadline}') ;`);
            await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
            return process.exit();
            });
        }


        


    }
}