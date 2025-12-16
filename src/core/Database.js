import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export async function connectDatabase(retries = 0) {
    try {
        await mongoose.connect(config.mongodb.uri, {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000
        });
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
        if (retries < MAX_RETRIES) {
            logger.info(`Retrying connection in ${RETRY_DELAY / 1000}s... (${retries + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return connectDatabase(retries + 1);
        }
        throw error;
    }
}

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
});

mongoose.connection.on('error', (error) => {
    logger.error(`MongoDB error: ${error.message}`);
});
