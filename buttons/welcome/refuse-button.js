module.exports = {
    name: 'refuse-button',
    async runInteraction(client,interaction) {
        
        await interaction.member.kick('Cette utilisateur ne peut pas avoir accès au serveur.');

        try {
            interaction.member.send('L\'accès au serveur Discord de l\'Odyssée t\'as été refusé.');
        }
        catch(e) {
            interaction.reply(`Le membre ${interaction.member.displayName} n'a pas eu accès au serveur.`);
        }

        await interaction.reply({content: 'Bienvenue sur à l\'Odyssée !', ephemeral: true });
    }
}