import { ActivityType } from 'discord.js';

export const name = 'ready';
export const once = true;

export async function execute(client) {
    client.logger.info(`Logged in as ${client.user.tag}`);
    client.logger.info(`Serving ${client.guilds.cache.size} guilds`);

    client.user.setPresence({
        activities: [{
            name: 'Destek Talepleri',
            type: ActivityType.Watching
        }],
        status: 'online'
    });
}
