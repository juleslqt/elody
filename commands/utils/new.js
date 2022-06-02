const Logger = require('../../utils/Logger');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'new',
    description: 'Assigne un poste à un nouveau membre.',
    category: 'utils',
    roles:[process.env.NEW_MEMBER_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'new INVITE_CODE',
    examples: ['new p9W2SpYB'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'code',
            description: 'Code de votre invitation.',
            type: 'STRING',
            required: true
        }
    ],
    async runInteraction(client,interaction) {

        const code = interaction.options.getString('code');

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {

            await connection.execute(`SELECT nom_poste, pole_poste, role_id, members.id, nom, prenom FROM members JOIN postes ON members.id_poste=postes.id WHERE inviteCode='${code}' ;`).then(async (response) => {

                if (response[0][0]) {
                    embed = new MessageEmbed()
                        .setColor('#ff0004')
                        .setTitle(`Bienvenue ${response[0][0]['prenom']} !`)

                    Logger.client(`New member : ${response[0][0]['nom'] + ' ' + response[0][0]['prenom'] + ' ' + response[0][0]['nom_poste'] + ' ' + response[0][0]['pole_poste'] }`);
                    await interaction.member.roles.add(response[0][0]['role_id'].split(','));
                    await interaction.reply({ embeds: [embed],  ephemeral: true });
                    await interaction.member.setNickname(`${response[0][0]['prenom']} ${response[0][0]['nom']}`);
                    await interaction.member.roles.remove([process.env.NEW_MEMBER_ROLE_ID]);
                    await connection.execute(`UPDATE members SET etat = 'ACCEPTED' WHERE id = ${response[0][0]['id']};`);
                    return process.exit();
                }
                else {
                    embed = new MessageEmbed()
                        .setColor('#778899')
                        .setTitle('Le code **' + code + '** ne correspond à aucune invitation.')
                    await interaction.reply({ embeds: [embed],  ephemeral: true });
                }

            });

          }).catch(err => console.log(err));  

    }
}