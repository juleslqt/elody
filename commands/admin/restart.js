
module.exports = {
    name: 'restart',
    description: 'Redémarrer Elody.',
    category: 'admin',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'restart',
    examples: ['restart'],
    async run(client, message, args) {
       
    },
    async runInteraction(client,interaction) {

        await interaction.reply({content: 'I\'m ready.', ephemeral: true})
        return process.exit();
    }
}