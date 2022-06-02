const { MessageEmbed, Formatters } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(client, member) {

        // const fetchGuild = await client.getGuild(member.guild);
        const fetchKickLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK'
        });

        const kickLog = fetchKickLog.entries.first();
        const { target, reason } = kickLog;
        let isMemberKick = false;
        let realReason = '';

        if (target.id === member.id) isMemberKick = true;
        if (reason != null) {realReason = 'pour la raison suivante :' + reason;} else {realReason = '';};

        const creationTimestamp = Formatters.time(dayjs(member.user.createdTimestamp).unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeCreationTimestamp = Formatters.time(dayjs(member.user.createdTimestamp).unix(), Formatters.TimestampStyles.RelativeTime);

        const joinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeJoinedTimestamp = Formatters.time(dayjs(member.joinedTimestamp).unix(), Formatters.TimestampStyles.RelativeTime);

        const leftTimestamp = Formatters.time(dayjs().unix(), Formatters.TimestampStyles.ShortDateTime);
        const relativeLeftTimestamp = Formatters.time(dayjs().unix(), Formatters.TimestampStyles.RelativeTime);

        const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('#ff0004')
        .setDescription(`► Nom d'utilisateur : ${member.displayName}
        ► Créé le : ${ creationTimestamp } (${ relativeCreationTimestamp })
        ► Rejoint le : ${ joinedTimestamp } (${ relativeJoinedTimestamp })
        ► Quitté le :  ${ leftTimestamp } (${ relativeLeftTimestamp })
        ${isMemberKick ? `► A été expulsé ${realReason}` : '' } 
        `)
        .setTimestamp()
        .setFooter({ text: 'L\'utilisateur a quitté le serveur !' })

        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
        logChannel.send({ embeds: [embed] });
    }
}