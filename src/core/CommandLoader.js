import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
    const commandsPath = join(__dirname, '..', 'commands');
    const commandFolders = readdirSync(commandsPath);
    const commands = [];

    for (const folder of commandFolders) {
        const folderPath = join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = join(folderPath, file);
            const command = await import(pathToFileURL(filePath).href);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                logger.info(`Loaded command: ${command.data.name}`);
            }
        }
    }

    await registerCommands(commands);
}

async function registerCommands(commands) {
    const rest = new REST().setToken(config.discord.token);

    try {
        logger.info(`Registering ${commands.length} slash commands...`);

        await rest.put(
            Routes.applicationCommands(config.discord.clientId),
            { body: commands }
        );

        logger.info('Successfully registered slash commands');
    } catch (error) {
        logger.error(`Failed to register commands: ${error.message}`);
    }
}
