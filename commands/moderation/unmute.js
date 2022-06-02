module.exports = {
    name: 'unmute',
    description: 'Permet à un utilisateur qui a été rendu muet de parler à nouveau.',
    category: 'moderation',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MODERATE_MEMBERS'],
    ownerOnly: false,
    usage: 'unmute [@member]',
    examples: ['unmute @Michel Sardou'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'target',
            description: 'L\'utilisateur à rendre muet.',
            type: 'USER',
            required: true,
        }
    ],
    async runInteraction(client,interaction) {
        const target = interaction.options.getMember('target');

        if (!target.isCommunicationDisabled()) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Ce membre n\'a pas été rendu muet.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } 
        

        target.timeout(null);

        embed = new MessageEmbed()
            .setColor('#ff0004')
            .setDescription(`Le membre ${target} n'est plus muet !`)
        return interaction.reply({ embeds: [embed], ephemeral: true });

    }
}