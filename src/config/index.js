import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env file');
    process.exit(1);
}

export const config = {
    discord: {
        token: process.env.DISCORD_TOKEN,
        clientId: process.env.DISCORD_CLIENT_ID
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lora-tickets'
    },
    lora: {
        apiKey: process.env.LORA_API_KEY,
        baseUrl: process.env.LORA_API_BASE_URL || 'https://api.loratech.dev/v1',
        model: process.env.LORA_MODEL || 'gemini-2.0-flash'
    },
    ticket: {
        categories: ['support', 'sales', 'billing', 'other'],
        priorities: ['low', 'medium', 'high', 'urgent'],
        statuses: ['open', 'closed', 'archived', 'locked']
    }
};
