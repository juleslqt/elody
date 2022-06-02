// const prefix = '!';

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        if (message.author.bot) return;
        // if (!message.content.startsWith(prefix)) return;

        // const args = message.content.slice(prefix.length).trim().split(/ +/g);
        // const cmdName = args.shift().toLowerCase();
        // if (cmdName.length == 0) return;

        // let cmd = client.commands.get(cmdName);
        // if (!cmd) return message.reply("Cette commande n'existe pas !");

        // if (cmd.owneronly) {
        //     if (message.author.id != process.env.OWNER_ID) {
        //         message.reply('Vous ne pouvez pas utiliser cette commande.');
        //     }
        // }

        // if (!message.member.permissions.has([cmd.permissions])) return message.reply('Vous n\'avez pas les permissions requises pour réaliser cette action.');

        // if (cmd) cmd.run(client, message, args);
    }
}