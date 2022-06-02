const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const buttons = new MessageActionRow()
    .addComponents(

        new MessageButton()
            .setCustomId('accept-button')
            .setLabel('Accepter')
            .setStyle('SUCCESS'),

        new MessageButton()
            .setCustomId('refuse-button')
            .setLabel('Refuser')
            .setStyle('DANGER'),

    )

const WelcomeEmbed = new MessageEmbed()
    .setTitle('Bienvenue !')
    .setDescription('.')
    .setFooter({ text: 'Bienvenue sur le serveur !' })
    .setTimestamp()

module.exports = {
    name: 'welcome',
    description: 'Message d\'accueil.',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'welcome',
    examples: ['welcome'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {
        await interaction.reply({ embeds: [WelcomeEmbed], components: [buttons] });
    }
}