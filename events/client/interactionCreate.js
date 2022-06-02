const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {

            const cmd = client.commands.get(interaction.commandName);

            let has = false;
            cmd.roles.forEach(role => {
                if ((interaction.member.roles.cache.has(role))) {
                    has = true;
                }
            })

            if (!has) {
                embed = new MessageEmbed()
                        .setColor('#778899')
                        .setDescription(`Vous ne pouvez pas utiliser cette commande`)
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!cmd) return interaction.reply("Cette commande n'existe pas !");

            if (cmd.owneronly) {
                if (interaction.user.id != process.env.OWNER_ID) {
                    embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('Vous ne pouvez pas utiliser cette commande.')
                return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            if (!interaction.member.permissions.has([cmd.permissions])) {
                embed = new MessageEmbed()
                    .setColor('#778899')
                    .setDescription('Vous n\'avez pas les permissions requises pour réaliser cette action.')
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            cmd.runInteraction(client, interaction);
        }
        else if (interaction.isButton()) {

            const btn = client.buttons.get(interaction.customId);
            if (!btn) return interaction.reply("Ce bouton n'existe pas !");

            btn.runInteraction(client, interaction);
        }
        else if (interaction.isSelectMenu()) {

            const selectMenu = client.selects.get(interaction.customId);
            if (!selectMenu) return interaction.reply("Ce menu n'existe pas !");

            selectMenu.runInteraction(client, interaction);
        }
    }
}