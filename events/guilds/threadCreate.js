module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(client, thread) {

        if (thread.isText()) thread.join();

        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
        logChannel.send(`Nouveau fil créé dans le canal ${thread.parent.name} : ${thread.name} !`);
    }
}