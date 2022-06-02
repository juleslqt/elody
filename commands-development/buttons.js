const { MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('primary-button')
            .setLabel('Primary')
            .setStyle('PRIMARY'),

        new MessageButton()
            .setCustomId('secondary-button')
            .setLabel('Secondary')
            .setStyle('SECONDARY'),

        new MessageButton()
            .setCustomId('success-button')
            .setLabel('Success')
            .setStyle('SUCCESS'),

        new MessageButton()
            .setCustomId('danger-button')
            .setLabel('Danger')
            .setStyle('DANGER'),

        new MessageButton()
            .setURL('https://google.com')
            .setLabel('Link')
            .setStyle('LINK'),
    )

module.exports = {
    name: 'buttons',
    description: 'buttons',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'buttons',
    examples: ['buttons'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {
        await interaction.reply({ content: 'Veuillez vous inscrire à une ou plusieurs missions afin d\'obtenir au moins 3 points.', components: [buttons] });
    }
}