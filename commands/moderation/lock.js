const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Vérouiller un salon.',
    category: 'moderation',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_CHANNELS'],
    ownerOnly: false,
    usage: 'lock',
    examples: ['lock'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: false });

        embed = new MessageEmbed()
                .setColor('#ff0004')
                .setDescription('Le salon est vérouillé.')
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}