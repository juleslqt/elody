module.exports = {
    name: 'success-button',
    async runInteraction(client,interaction) {
        interaction.reply({content: 'Je suis le bouton Success !'})
    }
}