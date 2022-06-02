
module.exports = {
    name: 'emit',
    description: 'Emettre un événement au choix.',
    category: 'admin',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'emit [eventName]',
    examples: ['emit guildMemberAdd'],
    run: (client, message, args) => {

    },
    options: [
        {
            name: 'event',
            description: 'Choisir un événement à émettre.',
            type: 'STRING',
            required: true,
            choices:  [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                }
            ]
        }
    ],
    runInteraction: (client,interaction) => {
        const eventChoice = interaction.options.getString('event');

        if (eventChoice == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Evénement "guildMemberAdd" émis !', ephemeral: true });
        }
        else {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: 'Evénement "guildMemberRemove" émis !', ephemeral: true });
        }
    }
}