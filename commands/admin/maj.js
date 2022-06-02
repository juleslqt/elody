const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'maj',
    description: 'Mise à jour.',
    category: 'admin',
    roles:[process.env.PRESIDENCE_ROLE_ID],
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'maj',
    examples: ['maj'],
    run: (client, message, args) => {

    },
    runInteraction: (client,interaction) => {
        embed = new MessageEmbed()
            .setColor('#ff0004')
            .setTitle(`Bienvenue !`)
            .setDescription(`Vous faites désormais partie de l'**Odyssée** !\nJe suis **Elody**, je suis un bot qui gère le serveur Discord de l'**Odyssée**. N'hésitez pas à taper **/help** pour mieux comprendre comment je fonctionne mais avant ça...\n\n**Qui êtes-vous ?**\nTapez **/new** suivi du **code** que vous avez **copié** puis appuyez sur **Enter**.`)
        return interaction.channel.send({ embeds: [embed]});

    }
}