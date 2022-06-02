const ms = require('ms');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'mute',
    description: 'Rend un utilisateur muet pendant un certain temps.',
    category: 'moderation',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MODERATE_MEMBERS'],
    ownerOnly: false,
    usage: 'mute [@member] [duration] [reason]',
    examples: ['mute @Michel Sardou 5 minutes raison'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'target',
            description: 'L\'utilisateur à rendre muet.',
            type: 'USER',
            required: true,
        },
        {
            name: 'duration',
            description: 'La durée pendant laquelle l\'utilisateur sera muet.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'reason',
            description: 'La raison pour laquelle l\'utilisateur sera muet.',
            type: 'STRING',
            required: true,
        }
    ],
    async runInteraction(client,interaction) {
        const target = interaction.options.getMember('target');
        const duration = interaction.options.getString('duration');
        const convertedTime = ms(duration);
        const reason = interaction.options.getString('reason');

        if (!target.moderatable) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Ce membre ne peut pas être rendu muet.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        };
        if (!convertedTime) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Spécifiez une durée valable. (exemple : "2 minutes")')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        target.timeout(convertedTime, reason);

        embed = new MessageEmbed()
                .setColor('#ff0004')
                .setDescription(`Le membre ${target} a été rendu muet pour ${duration} car ${reason} !`)
        return interaction.reply({ embeds: [embed], ephemeral: true });

    }
}