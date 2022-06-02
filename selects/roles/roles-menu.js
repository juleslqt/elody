module.exports = {
    name: 'roles-menu',
    async runInteraction(client,interaction) {
        await interaction.member.roles.add(interaction.values);
        await interaction.reply({content: 'Félicitations, vous avez été assigné à un poste !', ephemeral: true })
    }
};