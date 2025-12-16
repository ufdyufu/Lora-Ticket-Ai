import { Ticket } from '../models/Ticket.js';
import { Transcript } from '../models/Transcript.js';
import { Guild } from '../models/Guild.js';
import { aiService } from '../services/AIService.js';
import { knowledgeService } from '../services/KnowledgeService.js';
import { logger } from '../config/logger.js';

const guildConfigCache = new Map();
const CACHE_TTL = 60000;
const aiResponseCooldown = new Map();
const AI_COOLDOWN = 30000;

async function getCachedGuildConfig(guildId) {
    const cached = guildConfigCache.get(guildId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    const config = await Guild.getOrCreate(guildId);
    guildConfigCache.set(guildId, { data: config, timestamp: Date.now() });
    return config;
}

export const name = 'messageCreate';
export const once = false;

export async function execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const guildConfig = await getCachedGuildConfig(message.guild.id);

    if (guildConfig.settings.autoIndexing && guildConfig.settings.knowledgeEnabled) {
        try {
            await knowledgeService.indexMessage(message.guild.id, message);
        } catch (error) {
            logger.debug(`Knowledge index skipped: ${error.message}`);
        }
    }

    const ticket = await Ticket.findOne({ 
        channelId: message.channel.id,
        status: { $in: ['open', 'locked'] }
    });

    if (!ticket) return;

    const transcript = await Transcript.findOne({ ticketId: ticket.ticketId });
    
    if (transcript) {
        transcript.messages.push({
            authorId: message.author.id,
            authorName: message.author.username,
            authorAvatar: message.author.displayAvatarURL(),
            content: message.content,
            attachments: message.attachments.map(a => ({ url: a.url, name: a.name })),
            timestamp: message.createdAt
        });
        await transcript.save();
    }

    if (ticket.status === 'open' && !ticket.assignedTo && message.author.id === ticket.userId) {
        if (guildConfig.settings.aiEnabled) {
            try {
                const messages = transcript?.messages || [];
                
                const cooldownKey = `${message.guild.id}-${message.channel.id}`;
                const lastResponse = aiResponseCooldown.get(cooldownKey);
                const canRespond = !lastResponse || Date.now() - lastResponse > AI_COOLDOWN;

                if (messages.length > 0 && message.content.trim().length > 0 && canRespond) {
                    await message.channel.sendTyping();
                    
                    let knowledgeContext = null;
                    if (guildConfig.settings.knowledgeEnabled) {
                        knowledgeContext = await knowledgeService.getContext(message.guild.id, message.content);
                    }
                    
                    const response = await aiService.getAutoResponse(messages, message.content, knowledgeContext, guildConfig.language || 'tr');
                    
                    if (response) {
                        await message.channel.send({
                            content: `🤖 **AI Asistan:** ${response}\n\n*Bir yetkili en kısa sürede size yardımcı olacaktır.*`
                        });
                        aiResponseCooldown.set(cooldownKey, Date.now());
                    }
                }
            } catch (error) {
                logger.error(`AI auto-response failed: ${error.message}`);
            }
        }
    }
}
