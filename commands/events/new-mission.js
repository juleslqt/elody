const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
// const dateformat = import('dateformat');
// const { dateformat } = require('dateformat');
const { MessageEmbed } = require('discord.js');

let currentDate = new Date();
const years = [{ name: '' + currentDate.getFullYear(), value: '' + currentDate.getFullYear() },{ name: '' + (currentDate.getFullYear() + 1), value: '' + (currentDate.getFullYear() + 1) },{ name: '' + (currentDate.getFullYear() + 2), value: '' + (currentDate.getFullYear() + 2) },{ name: '' + (currentDate.getFullYear() + 3), value: '' + (currentDate.getFullYear() + 3) },{ name: '' + (currentDate.getFullYear() + 4), value: '' + (currentDate.getFullYear() + 4) }];

let missions = [];
let missions_sort = [];
let events = [];
let events_id = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT * FROM missions WHERE deadline > TIME(CURDATE() + INTERVAL 2 DAY) ORDER BY id DESC `).then(async (response) => {
        response[0].forEach(mission => {

            missions.push(mission['titre'].toLowerCase());
            missions_sort.push(mission['event_mission_channel_id']);

        })
      })
  }).catch(err => console.log(err));

  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT * FROM events WHERE end_date > TIME(CURDATE() + INTERVAL 2 DAY) ORDER BY id DESC `).then(async (response) => {
        response[0].forEach(event => {

            events.push({ name: event['nom'], value: event['mission_channel_id'] });
            events_id.push( event['mission_channel_id'], event['id'], event['discord_id'] );

        })
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'new-mission',
    description: 'Crée une nouvelle mission associée à événement.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID,process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_EVENTS'],
    ownerOnly: false,
    usage: 'new-mission [event_name] [deadline_day] [deadline_month] [deadline_year] [deadline_hour] [deadline_minutes] [description] [level] [mission_name]',
    examples: ['new-mission [Le Novo] 12 Juin 2001 18 30 [Domestiquer 100 pigeons] A [Opération Faucon]'],
    options: [
        {
            name: 'event_name',
            description: 'Nom de l\'événement associé.',
            type: 'STRING',
            required: true,
            choices: events
        },
        {
            name: 'deadline_day',
            description: 'Jour de début de l\'événement.',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'deadline_month',
            description: 'Mois de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'Janvier',value:'01'},{name:'Février',value:'02'},{name:'Mars',value:'03'},{name:'Avril',value:'04'},{name:'Mai',value:'05'},{name:'Juin',value:'06'},{name:'Juillet',value:'07'},{name:'Août',value:'08'},{name:'Septembre',value:'09'},{name:'Octobre',value:'10'},{name:'Novembre',value:'11'},{name:'Décembre',value:'12'}]
        },
        {
            name: 'deadline_year',
            description: 'Année de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: years
        },
        {
            name: 'deadline_hour',
            description: 'Heure de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:'01',value:'01'},{name:'02',value:'02'},{name:'03',value:'03'},{name:'04',value:'04'},{name:'05',value:'05'},{name:'06',value:'06'},{name:'07',value:'07'},{name:'08',value:'08'},{name:'09',value:'09'},{name:10,value:'10'},{name:11,value:'11'},{name:12,value:'12'},{name:13,value:'13'},{name:14,value:'14'},{name:15,value:'15'},{name:16,value:'16'},{name:17,value:'17'},{name:18,value:'18'},{name:19,value:'19'},{name:20,value:'20'},{name:21,value:'21'},{name:22,value:'22'},{name:23,value:'23'}]
        },
        {
            name: 'deadline_minute',
            description: 'Minute de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:15,value:'15'},{name:30,value:'30'},{name:45,value:'45'}]
        },
        {
            name: 'mission_description',
            description: 'Description de la mission.',
            type: 'STRING',
            required: true
        },
        {
            name: 'mission_staff',
            description: 'Nombre de membres assignés à la mission.',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'mission_level',
            description: 'Importance de la mission.',
            type: 'STRING',
            required: true,
            choices: [{name:'S',value:'05'},{name:'A',value:'03'},{name:'B',value:'02'},{name:'C',value:'01'}]
        },
        {
            name: 'mission_name',
            description: 'Nom de la mission.',
            type: 'STRING',
            required: true
        }
        
    ],
    async runInteraction(client,interaction) {

        if (events.length == 0) {
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('Veuillez d\'abord créer un événement en tapant **/new-event**.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const event_name = interaction.options.getString('event_name');

        let deadline_day = interaction.options.getNumber('deadline_day');
        const deadline_month = interaction.options.getString('deadline_month');
        const deadline_year = interaction.options.getString('deadline_year');
        const deadline_hour = interaction.options.getString('deadline_hour');
        const deadline_minute = interaction.options.getString('deadline_minute');

        const mission_description = interaction.options.getString('mission_description');
        const mission_staff = interaction.options.getNumber('mission_staff');
        const mission_level = interaction.options.getString('mission_level');
        const mission_name = interaction.options.getString('mission_name');

        let date_test = [];

        if (missions.includes(mission_name.toLowerCase())) {
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('Une mission dite **' + mission_name + '** existe déjà.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let deadline = deadline_year + '-' + deadline_month + '-' + deadline_day + '-' + deadline_hour + '-' + deadline_minute;

        
        function date_verificator(date) {

            detached_date = date.split('-');
            let year = detached_date[0];
            let month = detached_date[1];
            let day = detached_date[2];
            let hour = detached_date[3];
            let minute = detached_date[4];

            while (!moment(date, 'YYYY-MM-DD',true).isValid()) {
                if (!moment(date, 'YYYY-MM-DD',true).isValid()) {
                    day-=1;
                }
                
                date = year + '-' + month + '-' + day;
            };

            
            date_test.push( new String(year + '-' + month + '-' + day) );
            date = date + ' ' + hour + ':' + minute + ':00';
            return date;
        }

        deadline = date_verificator(deadline);

        if (new Date(date_test[0]) < new Date ) {
            let details = date_test[0].split('-');
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('La deadline de la mission (' + details[2] + '/' + details[1] + '/' + details[0] + ') est déjà passée.')
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        else {
            mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
            }).then(async (connection) => {


            let discord_event_id = await events_id[events_id.indexOf(event_name)+2];
            let event = await client.guilds.cache.get(process.env.GUILD_ID).scheduledEvents.fetch(discord_event_id);

            let event_id = await events_id[events_id.indexOf(event_name)+1];

            const responseEmbed = new MessageEmbed()
            .setTitle(`La mission dite "${mission_name}" a été créée !`)
            .setColor('#007eff')
            .setDescription('Les membres du pôle événementiel peuvent maintenant s\'y inscrire dans le cannal **mission** de l\'événement **' + await event.name + '**.' );


                  await connection.execute(`SELECT event_mission_id FROM missions WHERE event_mission_channel_id=${event_name} ORDER BY id DESC LIMIT 1`)
                  .then(async (response) => {
                      let number;
                      if (response[0][0]) {
                          number = response[0][0]['event_mission_id'].slice(2);
                      }
                      else {
                          number = '00';
                      }
                    let i = parseInt(number) + 1;
                    

                    i = i+'';
                    if (i.length == 1) {
                        i = '0' + i;
                    }
                    let mission_id = event_id + i;

                    const query = `INSERT INTO missions (event_mission_id, titre, description, staff, deadline, importance, event_mission_channel_id, author) VALUES ('${mission_id}', '${mission_name}', '${mission_description}', '${mission_staff}', '${deadline}', '${mission_level}', '${event_name}', '${await interaction.member.displayName}' );`;
                    await connection.execute(query);
                    await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
                    return process.exit();

                    });
        

            });
                        
        }

    }
};