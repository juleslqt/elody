const { MessageEmbed, Formatters } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'Informations',
    type: 'USER',
    category: 'users',
    roles:[process.env.MEMBERS_ROLE_ID],
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'Clique droit sur un membre, puis cliquer sur \'Applications\'',
    examples: [''],
    async runInteraction(client,interaction) {

        const member = await interaction.guild.members.fetch(interaction.targetId);

        const joinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeJoinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.RelativeTime);

        const embed = new MessageEmbed()
        .setAuthor({name: `${member.user.tag} (${member.id})`, iconURL: member.user.bot ? 'https://odysseedegustation.com/Image/logo/odyssee_logo.png' : `${member.user.displayAvatarURL()}` })
        .setColor('#ff0004')
        .addFields(
            { name: 'Nom', value: `${member.displayName}`, inline: true },
            { name: 'Pôle', value: `${member.roles.cache.map(role => { if (role.name != '@everyone') {return role;} }).join(' ')}`},
            { name: 'A rejoint le serveur Discord le : ', value: `${ joinedTimestamp } (${ relativeJoinedTimestamp })`},
        )

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}