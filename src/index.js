import { LoraClient } from './core/Client.js';

const client = new LoraClient();

client.initialize();

process.on('unhandledRejection', (error) => {
    client.logger.error(`Unhandled rejection: ${error.message}`);
});

process.on('uncaughtException', (error) => {
    client.logger.error(`Uncaught exception: ${error.message}`);
    process.exit(1);
});
