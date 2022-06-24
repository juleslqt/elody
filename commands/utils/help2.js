const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const commandCategoryFolder = readdirSync('./commands');
let commandFolder = [];
commandCategoryFolder.forEach(category => {
    commandFolder[category] = readdirSync('./commands/' + category);
});

const contextDescription = {
    Informations: 'Affiche les informations de l\'utilisateur'
}

module.exports = {
    name: 'help',
    description: 'Informations sur le fonctionnement du serveur Discord et d\'Elody.',
    category: 'utils',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'help <commande>',
    examples: ['help', 'help ping', 'help poll'],
    run(client, message, args) {

    },
    options: [
        {
            name: 'commande',
            description: 'Nom de la commande.',
            type: 'STRING',
            required: false
        }
    ],
    async runInteraction(client,interaction) {

        const cmdName = interaction.options.getString('commande');

        let helpEmbed = new MessageEmbed()
        .setTitle('Comment le serveur fonctionne ?')
        .addFields(
            {name: 'Règles', value: "1. Restez courtois et utilisez un langage approprié au cadre associatif.\n2. Ne partagez pas les conversations et informations avec des personnes extérieures à l'association.\n4. Aucune conversation personnelle n'est acceptée sur ce serveur.\n3. Si vous ne pouvez pas envoyer de message dans un canal textuel, créez un fil et utilisez le sujet de votre conversation comme titre.", inline: true},
            // {name: 'Rang', value: lettre, inline: true},
            // {name: 'Responsable', value: reponse[0][0]['author'], inline: true},
            // {name: 'Membres assignés', value: members, inline: false}
        )

    }
        
}