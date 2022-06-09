module.exports = {
    name: 'unlock',
    description: 'Dévérouiller un salon.',
    category: 'responsables',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_CHANNELS'],
    ownerOnly: false,
    usage: 'unlock',
    examples: ['unlock'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true });
        embed = new MessageEmbed()
            .setColor('#ff0004')
            .setDescription('Le salon est dévérouillé.')
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}