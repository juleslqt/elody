const { MessageEmbed, Formatters } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {

        member.roles.add(process.env.NEW_MEMBER_ROLE_ID);



        const creationTimestamp = Formatters.time(dayjs(member.user.createdTimestamp).unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeCreationTimestamp = Formatters.time(dayjs(member.user.createdTimestamp).unix(), Formatters.TimestampStyles.RelativeTime);

        const joinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeJoinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.RelativeTime);

        const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('#ff0004')
        .setDescription(`► Nom d'utilisateur : ${member}
        ► Créé le : ${ creationTimestamp } (${ relativeCreationTimestamp })
        ► Rejoint le : ${ joinedTimestamp } (${ relativeJoinedTimestamp })
        `)
        .setTimestamp()
        .setFooter({ text: 'L\'utilisateur a rejoint le serveur !' })

        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
        logChannel.send({ embeds: [embed] });
    }
}