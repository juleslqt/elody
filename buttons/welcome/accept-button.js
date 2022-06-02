module.exports = {
    name: 'accept-button',
    async runInteraction(client,interaction) {
        await interaction.member.roles.add('948375760664690778');
        await interaction.reply({content: 'Bienvenue sur à l\'Odyssée !', ephemeral: true })
    }
}