const Logger = require('../../utils/Logger');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageActionRow, MessageButton } = require('discord.js');
let postList = [];
let posteId = 'undefined';
let postes = [];
let nomPoste = [];
let poles = [];
let nomPole = [];

mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  }).then(async (connection) => {
    connection.execute(`SELECT * FROM postes;`).then((response) => {
        response[0].forEach((line) => {

            postList.push(`${line['nom_poste'] + line['pole_poste'] + ';' + line['id']}`);

            if (!nomPoste.includes(line['nom_poste'])) {
                postes.push({
                    name: line['nom_poste'], 
                    value: line['nom_poste']
                });
                nomPoste.push(line['nom_poste']);
            };

            if (!nomPole.includes(line['pole_poste'])) {
                poles.push({
                    name: line['pole_poste'], 
                    value: line['pole_poste']
                });
                nomPole.push(line['pole_poste']);
            };
        })
    }).catch(err => Logger.error(err));
  }).catch(err => Logger.error(err));  


  const button = new MessageActionRow()
      .addComponents(
  
          new MessageButton()
              .setURL('https://odysseedegustation.com/newmembers.php')
              .setLabel('Envoyer')
              .setStyle('LINK'),
      )

module.exports = {
    name: 'new-user',
    description: 'Ajouter un nouvel utilisateur à ce serveur Discord.',
    category: 'admin',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'new-user [nom] [prenom] [poste] [pôle]',
    examples: ['new-user Sardou Michel Designer Communication'],
    options: [
        {
            name: 'nom',
            description: 'Nom du nouvel arrivant.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'prenom',
            description: 'Prénom du nouvel arrivant.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'email',
            description: 'Adresse email personnelle du nouvel arrivant.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'poste',
            description: 'Poste du nouvel arrivant au sein de l\'Odyssée.',
            type: 'STRING',
            required: true,
            choices:  postes
        },
        {
            name: 'pole',
            description: 'Pôle du nouvel arrivant.',
            type: 'STRING',
            required: true,
            choices:  poles
        }
    ],
    async runInteraction(client,interaction) {
        const nom = interaction.options.getString('nom');
        const prenom = interaction.options.getString('prenom');
        const email = interaction.options.getString('email');
        const poste = interaction.options.getString('poste');
        const pole = interaction.options.getString('pole');
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const welcomeChannel = guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);

        guild.invites.create(welcomeChannel, {maxUses: 1, unique: true, maxAge: 604800, reason: `Bonjour ${prenom},\nJe vous invite à rejoindre le serveur Discord de l'Odyssée !`})
        .then(async invite => {
            let inviteCode = invite.code;

            await mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE,
              }).then(async (connection) => {
    
                postList.forEach((id) => {
                    if ((poste+pole) == id.split(';')[0]) {
                        posteId = id.split(';')[1];
                    }
                });
    
                if (posteId == 'undefined') {
                    interaction.reply({ content: `Le poste ${poste} n'existe pas dans le pôle ${pole}`, ephemeral: true });
                }
                else {
                    await connection.execute(`INSERT INTO members (nom, prenom, email, inviteCode, id_poste) VALUES (${'\''+ nom +'\''}, ${'\''+ prenom +'\''}, ${'\''+ email +'\''}, ${'\''+ inviteCode +'\''}, ${'\''+ posteId +'\''});`);
                    await interaction.reply({ content: `Cliquez sur ce bouton pour envoyer l'invitation à ${ prenom + ' ' + nom } !`, components: [button],  ephemeral: true });
                    return process.exit();
                }
                
              }).catch(err => console.log(err));

        })
        .catch(err => console.log(err));

    }
}