

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Imposer un temps en secondes entre l\'envoie de chaque message',
    category: 'responsables',
    roles:[process.env.RESPONSABLES_ROLE_ID],
    permissions: ['MANAGE_MESSAGES'],
    ownerOnly: false,
    usage: 'slowmode [amount_in_seconds]',
    examples: ['slowmode 15', 'slowmode 0'],
    async run(client, message, args) {

    },
    options: [
        {
            name: 'amount_in_seconds',
            description: 'Le nombre de secondes requis entre chaque message.',
            type: 'NUMBER',
            required: true,
        }
    ],
    async runInteraction(client,interaction) {
        const value = interaction.options.getNumber('amount_in_seconds');

        if (value == 0) {
            await interaction.channel.setRateLimitPerUser(value);
            embed = new MessageEmbed()
                .setColor('#ff0004')
                .setDescription('Mode lent désactivé.')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else  {
            await interaction.channel.setRateLimitPerUser(value);
            embed = new MessageEmbed()
                .setColor('#ff0004')
                .setDescription(`${value} secondes sont désormais requises entre chaque message`)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        
    }
    
}