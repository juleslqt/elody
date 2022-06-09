const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Supprimer un nombre défini de messages sur un salon en ciblant optionnellement un utilisateur.',
    category: 'responsables',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_MESSAGES'],
    ownerOnly: false,
    usage: 'clear [amount] <@target>',
    examples: ['clear 50', 'clear 50 @Michel Sardou'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'amount',
            description: 'Le nombre de messages à supprimer. (Doit être compris entre 1 et 100)',
            type: 'NUMBER',
            required: true,
        },
        {
            name: 'target',
            description: 'Choisir un utilisateur pour lequel supprimer les messages.',
            type: 'USER',
            required: false,
        }
    ],
    async runInteraction(client,interaction) {
        const amountToDelete = interaction.options.getNumber('amount');
        if (amountToDelete < 1 || 100 < amountToDelete) {
            embed = new MessageEmbed()
                .setColor('#778899')
                .setDescription('Le nombre de messages à supprimer doit être compris entre 1 et 100.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const target = interaction.options.getMember('target');

        const messageToDelete = await interaction.channel.messages.fetch();

        if (target) {
            let i = 0;
            const filteredTargetMessage = [];
            (await messageToDelete).filter(msg => {
                if (msg.author.id == target.id && amountToDelete > i) {
                    filteredTargetMessage.push(msg); i++;
                }
            });

            await interaction.channel.bulkDelete(filteredTargetMessage, true).then(messages => {
                embed = new MessageEmbed()
                    .setColor('#ff0004')
                    .setDescription(`J'ai supprimé ${messages.size} message(s) de l'utilisateur ${target}`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
            })
        } 
        else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(messages => {
            embed = new MessageEmbed()
                .setColor('#ff0004')
                .setDescription(`J'ai supprimé ${messages.size} message(s) sur ce salon.`)
            return interaction.reply({ embeds: [embed], ephemeral: true });
            })
        }
    }
}