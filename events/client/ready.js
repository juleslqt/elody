const Logger = require('../../utils/Logger');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv'); dotenv.config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        let guildsCount = await client.guilds.fetch();
        let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
          }).then(() => Logger.client('- database connected')).catch(err => console.log(err));          

        Logger.client(`\n------------------\n Elody is ready !\n------------------\n`)

        client.user.setPresence({ activities: [{name: 'A votre service', type: 'CUSTOM' }], status: 'online' }); // status: online|idle|invisible|dnd

        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        guild.commands.set(client.commands.map(cmd => cmd));
    }
}