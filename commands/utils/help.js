const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const commandFolder = readdirSync('./commands');
const prefix = '!';

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

        console.log(cmd.roles);
        
        if (!cmdName) {
            const noArgsEmbed = new MessageEmbed()
            .setColor('#ff0004')
            .addField('Liste des commandes', `Une liste de toutes les catégories disponibles et leurs commandes.\n Pour plus d'information sur une commande, tapez \`/help <commande>\``);

            for (const category of commandFolder) {
                noArgsEmbed.addField(
                    `► ${category.toUpperCase()}`,
                    `${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => cmd.name).join(', ')}`
                )
            };

            return interaction.reply({ embeds: [noArgsEmbed], ephemeral: true });
        }

        const cmd = client.commands.get(cmdName);
        if (!cmd) return interaction.reply({content: 'Cette commande n\'existe pas.', ephemeral: true});

        return interaction.reply({content: `
\`\`\`makefile
[Help: Commande -> ${cmd.name}] ${cmd.ownerOnly ? '/!\\ Seuls les administrateurs du serveur y ont accès /!\\' : ''}

Description:
${cmd.description ? cmd.description : contextDescription[`${cmd.name}`] }

Permissions: ${cmd.permissions.join(', ')}\n
Utilisation: /${cmd.usage}\n
Exemples: /${cmd.examples.join(` | /`)}\n

---

Tapez / dans n'importe canal pour voir toutes les commandes disponibles.

\`\`\`
`, ephemeral: true });

    }
        
}