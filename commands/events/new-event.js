const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const moment = require('moment');
// const dateformat = import('dateformat');
// const { dateformat } = require('dateformat');
const { MessageEmbed } = require('discord.js');

let currentDate = new Date();
const years = [{ name: '' + currentDate.getFullYear(), value: '' + currentDate.getFullYear() },{ name: '' + (currentDate.getFullYear() + 1), value: '' + (currentDate.getFullYear() + 1) },{ name: '' + (currentDate.getFullYear() + 2), value: '' + (currentDate.getFullYear() + 2) },{ name: '' + (currentDate.getFullYear() + 3), value: '' + (currentDate.getFullYear() + 3) },{ name: '' + (currentDate.getFullYear() + 4), value: '' + (currentDate.getFullYear() + 4) }];

let events = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
      await connection.execute(`SELECT * FROM events WHERE end_date > TIME(CURDATE() + INTERVAL 2 DAY) ORDER BY id DESC `).then(async (response) => {
        response[0].forEach(event => {

            events.push(event['nom'].toLowerCase());

        })
      })
  }).catch(err => console.log(err));

module.exports = {
    name: 'new-event',
    description: 'Crée un nouvel événement.',
    category: 'events',
    roles:[process.env.ED_ROLE_ID,process.env.LF_ROLE_ID,process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_EVENTS'],
    ownerOnly: false,
    usage: 'new-event [event_name] [deadline_day] [deadline_month] [deadline_year] [deadline_hour] [deadline_minutes]',
    examples: ['new-event Gala 12 6 2001 18 30'],
    options: [
        {
            name: 'event_name',
            description: 'Nom de l\'événement.',
            type: 'STRING',
            required: true
        },
        {
            name: 'event_description',
            description: 'description de l\'événement.',
            type: 'STRING',
            required: true
        },
        {
            name: 'event_location',
            description: 'Nom de l\'événement.',
            type: 'STRING',
            required: true
        },
        {
            name: 'start_day',
            description: 'Jour de début de l\'événement.',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'start_month',
            description: 'Mois de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'Janvier',value:'01'},{name:'Février',value:'02'},{name:'Mars',value:'03'},{name:'Avril',value:'04'},{name:'Mai',value:'05'},{name:'Juin',value:'06'},{name:'Juillet',value:'07'},{name:'Août',value:'08'},{name:'Septembre',value:'09'},{name:'Octobre',value:'10'},{name:'Novembre',value:'11'},{name:'Décembre',value:'12'}]
        },
        {
            name: 'start_year',
            description: 'Année de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: years
        },
        {
            name: 'start_hour',
            description: 'Heure de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:'01',value:'01'},{name:'02',value:'02'},{name:'03',value:'03'},{name:'04',value:'04'},{name:'05',value:'05'},{name:'06',value:'06'},{name:'07',value:'07'},{name:'08',value:'08'},{name:'09',value:'09'},{name:10,value:'10'},{name:11,value:'11'},{name:12,value:'12'},{name:13,value:'13'},{name:14,value:'14'},{name:15,value:'15'},{name:16,value:'16'},{name:17,value:'17'},{name:18,value:'18'},{name:19,value:'19'},{name:20,value:'20'},{name:21,value:'21'},{name:22,value:'22'},{name:23,value:'23'}]
        },
        {
            name: 'start_minute',
            description: 'Minute de début de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:15,value:'15'},{name:30,value:'30'},{name:45,value:'45'}]
        },
        {
            name: 'end_day',
            description: 'Jour de fin de l\'événement.',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'end_month',
            description: 'Mois de fin de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'Janvier',value:'01'},{name:'Février',value:'02'},{name:'Mars',value:'03'},{name:'Avril',value:'04'},{name:'Mai',value:'05'},{name:'Juin',value:'06'},{name:'Juillet',value:'07'},{name:'Août',value:'08'},{name:'Septembre',value:'09'},{name:'Octobre',value:'10'},{name:'Novembre',value:'11'},{name:'Décembre',value:'12'}]
        },
        {
            name: 'end_year',
            description: 'Année de fin de l\'événement.',
            type: 'STRING',
            required: true,
            choices: years
        },
        {
            name: 'end_hour',
            description: 'Heure de fin de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:'01',value:'01'},{name:'02',value:'02'},{name:'03',value:'03'},{name:'04',value:'04'},{name:'05',value:'05'},{name:'06',value:'06'},{name:'07',value:'07'},{name:'08',value:'08'},{name:'09',value:'09'},{name:10,value:'10'},{name:11,value:'11'},{name:12,value:'12'},{name:13,value:'13'},{name:14,value:'14'},{name:15,value:'15'},{name:16,value:'16'},{name:17,value:'17'},{name:18,value:'18'},{name:19,value:'19'},{name:20,value:'20'},{name:21,value:'21'},{name:22,value:'22'},{name:23,value:'23'}]
        },
        {
            name: 'end_minute',
            description: 'Minute de fin de l\'événement.',
            type: 'STRING',
            required: true,
            choices: [{name:'00',value:'00'},{name:15,value:'15'},{name:30,value:'30'},{name:45,value:'45'}]
        },
        
    ],
    async runInteraction(client,interaction) {

        const name = interaction.options.getString('event_name');
        const description = interaction.options.getString('event_description');
        const location = interaction.options.getString('event_location');

        let start_day = interaction.options.getNumber('start_day');
        const start_month = interaction.options.getString('start_month');
        const start_year = interaction.options.getString('start_year');
        const start_hour = interaction.options.getString('start_hour');
        const start_minute = interaction.options.getString('start_minute');

        let end_day = interaction.options.getNumber('end_day');
        const end_month = interaction.options.getString('end_month');
        const end_year = interaction.options.getString('end_year');
        const end_hour = interaction.options.getString('end_hour');
        const end_minute = interaction.options.getString('end_minute');

        let date_test = [];
        let event_id = 0;
        

        if (events.includes(name.toLowerCase())) {
            return interaction.reply({ content: 'L\'événement ' + name + ' existe déjà.', ephemeral: true });
        }

        let date_start = start_year + '-' + start_month + '-' + start_day + '-' + start_hour + '-' + start_minute;
        let date_end = end_year + '-' + end_month + '-' + end_day + '-' + end_hour + '-' + end_minute;;
        
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

        date_start = date_verificator(date_start);
        date_end = date_verificator(date_end);

        if (new Date(date_test[0]) < new Date ) {
            let details = date_test[0].split('-');
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('La date de début de l\'événement (' + details[2] + '/' + details[1] + '/' + details[0] + ') est déjà passée.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else if (new Date(date_test[1]) < new Date ) {
            let details = date_test[1].split('-');
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('La date de fin de l\'événement (' + details[2] + '/' + details[1] + '/' + details[0] + ') est déjà passée.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else if (new Date(date_end).getTime() <= new Date(date_start).getTime() ) {
            embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription(`L'événement se fini avant même d'avoir commencé.`)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
            }).then(async (connection) => {

            let responseEmbed = new MessageEmbed()
            
            let missionEmbed = new MessageEmbed()

            await client.guilds.cache.get(process.env.GUILD_ID).scheduledEvents            
                .create({
                        name: name,
                        privacyLevel: 'GUILD_ONLY',
                        scheduledStartTime: date_start,
                        scheduledEndTime: date_end,
                        description: description,
                        entityType:'EXTERNAL',
                        entityMetadata: {location: location}
                
                }).then(async event => {

                    responseEmbed
                    .setTitle(`Evénement ${event.name} créé !`)
                    .setColor('#007eff')
                    .setDescription('Vous pouvez désormais y assigner des missions en tapant **/new-mission**')

                    missionEmbed
                    .setColor('#007eff')
                    .setTitle(`Ici vous trouverez toutes les missions relatives à l\'événement __${event.name}__ en tapant **/refresh**.`)
                    .setDescription('Vous pouvez choisir une mission en tapant **/choose**.');

                    await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
                    
                    const guild = client.guilds.cache.get(process.env.GUILD_ID);
                    const membersRole = await guild.roles.fetch(process.env.MEMBERS_ROLE_ID);
                    const presidenceRole = await guild.roles.fetch(process.env.PRESIDENCE_ROLE_ID);

                    await guild.channels.create('EVENT - ' + event.name, {
                        type: 'GUILD_CATEGORY',
                        permissionOverwrites: [
                            {
                                id: process.env.MEMBERS_ROLE_ID,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: process.env.NEW_MEMBER_ROLE_ID,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: process.env.GUILD_ID,
                                deny: ['VIEW_CHANNEL'],
                            }
                        ],
                      }).then(async channel => {

                        await channel.setPosition(0);

                        let mission_channel_id = "";

                        await guild.channels.create('Présidence', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.PRESIDENCE_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Secrétariat', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.SECRETARIAT_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Trésorerie', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.TRESORERIE_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Communication', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.COMMUNICATION_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Production Vidéo', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.PRODUCTION_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Evénement dégustation', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.ED_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Levée de fonds', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.LF_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Partenariat', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.PARTENARIAT_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('Informatique', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.INFORMATIQUE_ROLE_ID,
                                    allow: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                }
                            ],
                        });

                        await guild.channels.create('MISSIONS', {
                            type: 'GUILD_TEXT',
                            parent: channel,
                            permissionOverwrites: [
                                {
                                    id: process.env.MEMBERS_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.NEW_MEMBER_ROLE_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.GUILD_ID,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.LF_ROLE_ID,
                                    allow: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: process.env.ED_ROLE_ID,
                                    allow: ['VIEW_CHANNEL'],
                                }
                            ],
                        }).then(async missionChannel => {
                            mission_channel_id = await missionChannel.id;
                            const query = `INSERT INTO events (nom, start_date, end_date, lieu, description, discord_id, discord_category_id, mission_channel_id) VALUES ('${name}', '${date_start}', '${date_end}', '${location}', '${description}', '${await event.id}', '${await channel.id}', '${mission_channel_id}');`;
                            await connection.execute(query);    
                            await missionChannel.send({ embeds: [missionEmbed] });
                            return process.exit();
                        });
                        
                      })

                })
            });
        }


        


    }
}