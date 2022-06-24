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
    name: 'help2',
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
            {name: 'Règles', value: "**1.** Restez courtois et utilisez un langage approprié au cadre associatif.\n**2.** Ne partagez pas les conversations et informations avec des personnes extérieures à l'association.\n**3.** Aucune conversation personnelle n'est acceptée sur ce serveur.\n**4.** Si vous ne pouvez pas envoyer de message dans un canal textuel, créez un fil et utilisez le sujet de votre conversation comme titre.\n> Vous pouvez créer un fil en cliquant sur l'icône # en à droite de votre écran d'ordinateur, sur téléphone vous devez restez appuyé sur un message puis appuyer sur \"Créer un fil\".", inline: false},
            {name: '\u200B', value: '\u200B', inline: false},
            {name: 'Structure', value: "Le serveur est divisé en 3 catégories qui représentent les différents pôles de l'associations :", inline: false},
            {name: 'Général', value: "*Canal général*\n> Un canal textuel qui réunit tous les membres de l'association, il sert principalement aux grandes annonces et à communiquer avec tous les membres cependant éviter de surcharger ce canal de messages.\n*Agenda*\n> Un canal textuel dans lequel sont publiés tous les événements ajoutés à l'agenda Google de l'Odyssée tels que les réunions.\n *Brainstorming*\n> Un canal textuel qui vous permet de donner vos idées concernant l'association, par exemple un projet ou encore une idée de publication Instagram.", inline: false},
            {name: '__', value: '\u200B', inline: false},
            {name: 'Salons de réunions', value: "*Réunion générale*\n> C'est ici que se déroulent les réunions générales à distance\n*Canal réunion*\n> Des canaux de réunions si celui de votre pôle est occupé ou si vous souhaitez faire une réunion inter-pôle.", inline: false},
            {name: '__', value: '\u200B', inline: false},
            {name: 'Votre pôle', value: "*Groupe privé*\n> Un canal textuel qui vous permet de communiquer avec tous les membres de votre pôle. Seul le responsable peut envoyer des messages dans ce canal, les membres doivent créer des fils pour pouvoir envoyer des messages.\n*Réunion pôle*\n> C'est ici que se dérouleront les réunions de votre pôle à distance.", inline: false}
            // {name: '__', value: '\u200B', inline: false}
        )

        interaction.reply({ embeds: [helpEmbed], ephemeral: true });

    }
        
}