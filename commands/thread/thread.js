const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'thread',
    description: 'Gestion des fils.',
    category: 'thread',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_THREADS'],
    ownerOnly: false,
    usage: 'thread [join|archive|unarchive|delete]',
    examples: ['thread join', 'thread archive'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'join',
            description: 'Ajouter un membre à ce fil.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'L\'utilisateur que vous souhaitez ajouter à ce fil.',
                    type: 'USER',
                    required: true
                },
            ]
        },
        {
            name: 'archive',
            description: 'Archiver ce fil.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'unarchive',
            description: 'Désarchiver ce fil.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'delete',
            description: 'Supprimer ce fil.',
            type: 'SUB_COMMAND',
        }
    ],
    async runInteraction(client,interaction) {
        let thread = interaction.channel;

        embed = new MessageEmbed()
            .setColor('#778899')
            .setDescription(`Cette commande ne peut être réalisée que dans un fil.`)

        if (!thread.isThread()) return interaction.reply({ embeds: [embed], ephemeral: true });

        if (interaction.options.getSubcommand() === 'join') {
            const user = interaction.options.getMember('target');
            if (thread.joinable) await thread.add(user);
            interaction.reply(`${user} a rejoint le fil ${thread.name}`);
        }
        // else if (interaction.options.getSubcommand() === 'leave') {
        //     const user = interaction.options.getMember('target');
        //     if (thread.fetch(user)) await thread.remove(user.id);
        //     interaction.reply(`${user} a quitté le fil ${thread.name}`);
        // }
        else if (interaction.options.getSubcommand() === 'archive') {
            await interaction.reply(`Le fil ${thread.name} a été archivé.`);
            await thread.setArchived(true);
        }
        else if (interaction.options.getSubcommand() === 'unarchive') {
            await thread.setArchived(false);
            await interaction.reply(`Le fil ${thread.name} a été désarchivé.`);
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            await thread.parent.send({ content: `Le fil ${thread.name} a été supprimé.` });
            await thread.delete();
        }
    }
}