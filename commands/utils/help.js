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

        const otherRoles = ['Présidence', 'Communication', 'Secrétariat', 'Trésorerie', 'Production Vidéo', 'Informatique', 'Événement dégustation', 'Levée de fonds', 'Responsables'];
        let member_roles = [];
        let i = 0;

        while (i < interaction.member.roles.cache.size) {
            let role = await interaction.member.roles.cache.at(i);
                if (otherRoles.includes(await role.name)) {
                    member_roles[await role.name] = await role.id;
                } 
            i+=1;
        }

        console.log('Roles du membre : ', member_roles);
        // console.log(commandFolder);
        console.log('Commandes : ', client.commands.filter(cmd => cmd.category == category.toLowerCase()));
        
        if (!cmdName) {
            const noArgsEmbed = new MessageEmbed()
            .setColor('#ff0004')
            .addField('Liste des commandes', `Une liste de toutes les catégories disponibles et leurs commandes.\n Pour plus d'information sur une commande, tapez \`/help <commande>\``);

            for (const category of Object.keys(commandFolder)) {
                if (category == 'events' && (Object.keys(member_roles).includes('Événement dégustation') || member_roles.includes('Levée de fonds'))) {
                    category_verificator = true;
                }
                else {
                    category_verificator = Object.keys(member_roles).includes(category);
                }

                if (category_verificator) {
                    console.log('Catégorie : ', category);
                    console.log('Commandes : ', client.commands.filter(cmd => cmd.category == category.toLowerCase()));
                noArgsEmbed.addField(
                    `► ${category.toUpperCase()}`,
                    `${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => cmd.name).join(', ')}`
                )
                }
            };

            return interaction.reply({ embeds: [noArgsEmbed], ephemeral: true });
        }

        const cmd = client.commands.get(cmdName);
        console.log(cmd.roles);
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