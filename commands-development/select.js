const Logger = require('../utils/Logger');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();


module.exports = {
    name: 'select',
    description: 'Récupérer des donnée de la base de données',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'select',
    examples: ['select'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {

        await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(async (connection) => {
            await connection.execute(`SELECT * FROM bot_discord;`).then((response) => {
                let content = 'Réponse de la base de données :';
                response[0].forEach((line) => {
                  content = content + `\n${line['phrase']} par ${line['user']}`;
                })
                interaction.reply({ content: content, ephemeral: true });
            }).catch(err => Logger.error(err));
          }).catch(err => Logger.error(err));  
    }
}