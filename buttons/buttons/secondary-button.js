module.exports = {
    name: 'secondary-button',
    async runInteraction(client,interaction) {
        interaction.reply({content: 'Je suis le bouton Secondary !'})
    }
}