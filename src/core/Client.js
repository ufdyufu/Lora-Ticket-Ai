import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';
import { loadEvents } from './EventLoader.js';
import { loadCommands } from './CommandLoader.js';
import { connectDatabase } from './Database.js';

export class LoraClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User
            ]
        });

        this.commands = new Collection();
        this.config = config;
        this.logger = logger;
    }

    async initialize() {
        try {
            await connectDatabase();
            await loadCommands(this);
            await loadEvents(this);
            await this.login(config.discord.token);
        } catch (error) {
            logger.error(`Initialization failed: ${error.message}`);
            process.exit(1);
        }
    }
}
