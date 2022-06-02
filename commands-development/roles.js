const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const selectMenu = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('roles-menu')
            .setPlaceholder('Choisir un rôle dans la liste.')
            .setMinValues(1)
            .setMaxValues(3)
            .addOptions([
                {
                    label: 'Membre',
                    value: '948375760664690778',
                    description: 'Devenir membre.'
                },
                {
                    label: 'Responsable',
                    value: '948704944666595388',
                    description: 'Devenir responsable.'
                },
                {
                    label: 'Invité',
                    value: '958820255310950420',
                    description: 'Devenir un invité.'
                }
            ])
    )

module.exports = {
    name: 'roles',
    description: 'roles',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'roles',
    examples: ['roles'],
    async run(client, message, args) {

    },
    async runInteraction(client,interaction) {
        await interaction.reply({ content: 'Choisir vos postes.', components: [selectMenu] });
    }
}