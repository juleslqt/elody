
module.exports = {
    name: 'collector',
    description: 'collector',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'collector',
    examples: ['collector'],
    async run(client, message, args) {
        const filter = (reaction, user) => {
            return reaction.emoji.name === '❤' && user.id === message.author.id;
        };

        await message.react('❤');

        const collector = message.createReactionCollector({ filter, time: 10000 });

        collector.on('collect', (reaction, user) => {
            message.channel.send(`${user.tag} a réagis avec ${reaction.emoji.name} !`)
        });

        collector.on('end', collected => {
            if (collected.size == 1) message.channel.send("L'auteur du message a réagi !")
            else message.channel.send("L'auteur du message n'a pas réagi !");
        });
    },
    async runInteraction(client,interaction) {
        interaction.reply('Tapez le message \`Discord\`');
        const filter = msg => msg.content.includes("Discord");
        const collector = interaction.channel.createMessageCollector({ filter, time: 10000 });


        collector.on('end', collected => {
            interaction.followUp(`${collected.size} messages collectés !`);
        })
    }
}