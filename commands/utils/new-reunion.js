const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'new-reunion',
    description: 'Crée une nouvelle réunion.',
    category: 'reunion',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['MANAGE_THREADS'],
    ownerOnly: false,
    usage: 'new-reunion [Title]',
    examples: ['new-reunion Novo 1', 'thread Astoria 4'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'title',
            description: 'Titre de la réunion',
            type: 'STRING',
            required: true
        }
    ],
    async runInteraction(client,interaction) {

        const title = 'Réunion - ' + interaction.options.getString('title');

        const thread = await interaction.channel.threads.create({
            name: title,
            autoArchiveDuration: 72*60,
            reason: 'Nouvelle réunion',
        });

        const reunionEmbed = new MessageEmbed()
            .setTitle(`${title} `)
            .setTimestamp()

        const responseEmbed = new MessageEmbed()
            .setTitle(`${title} créé !`)
            .setDescription(`Rendez-vous dans le fil **${title}** pour lancer votre réunion.`)

        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });

        await thread.send({ embeds: [reunionEmbed] })

    }
}
