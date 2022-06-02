const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const client = new Client({ intents: 1539, partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT']});
const Logger = require('./utils/Logger');

['commands', 'buttons', 'selects']
.forEach(x => client[x] = new Collection());

console.log('\n\n\n');

['CommandUtil', 'EventUtil', 'ButtonUtil', 'SelectUtil']
.forEach( handler => { require(`./utils/handlers/${handler}`)(client); });

process.on('exit', code => { Logger.client(`Code: ${code}\n---------------------\n Elody s'est éteinte\n---------------------\n `) });
process.on('uncaughtException', (err, origin) => { Logger.error(`UNCAUGHT_EXCEPTION: ${err}`); console.log( `Origin: ${origin}`) });
process.on('unhandledRejection', (reason, promise) => { Logger.warn(`UNHANDLED_REJECTION: ${reason}\n\n${promise}`) });
process.on('warning', (...args) => { Logger.warn(...args) });


client.login(process.env.DISCORD_TOKEN);
