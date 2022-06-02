const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'emoji',
    description: 'Poster un emoji.',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'emoji',
    examples: ['emoji'],
    run(client, message, args) {

    },
    async runInteraction(client,interaction) {

        const emoji = await interaction.reply({ content: 'Emoji !', fetchReply: true });
        await emoji.react('😂');
        await emoji.react('😍');
        await emoji.react('😒');
        await emoji.react('😁');
    }
}