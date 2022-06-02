const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'sondage',
    description: 'Créer un sondage.',
    category: 'utils',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'sondage [subject] [description] [emoji]',
    examples: ['sondage [Lundi ou Vendredi ?] [Concernant la réunion de la semaine prochaine.] [Lundi,Vendredi]'],
    options: [
        {
            name: 'subject',
            description: 'Sujet du sondage.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'description',
            description: 'Description du sondage.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'answers',
            description: 'Réponses possibles au sondage séparées par des virgules (10 maximum).',
            type: 'STRING',
            required: true,
        },
    ],
    async runInteraction(client,interaction) {
        const pollTitle = interaction.options.getString('subject');
        let pollContent = interaction.options.getString('description') + '\n';
        const pollAnswers = interaction.options.getString('answers').split(',');
        
        const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
        let i = 0;

        await pollAnswers.slice(0,10).forEach( async answer => {
            answer = (answer[0].toUpperCase() + answer.slice(1)).trim()
            let option = `\n${emojis[i]} : ${answer}\n`;
            pollContent = pollContent + option;
            i++;
        });

        const embed = new MessageEmbed()
        .setTitle(pollTitle)
        .setColor('#378A41')
        .setDescription(pollContent)
        .setTimestamp()
        .setFooter({ text: `Sondage créé par ${interaction.member.displayName}` })

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });

        i = 0;
        await pollAnswers.forEach( async answer => {
            poll.react(emojis[i]);
            i++;
        });
        
    }
}