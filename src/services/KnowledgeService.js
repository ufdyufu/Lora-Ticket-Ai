import { ServerKnowledge } from '../models/ServerKnowledge.js';
import { logger } from '../config/logger.js';

const PRICE_PATTERNS = [
    /(\d+(?:[.,]\d+)?)\s*(?:TL|₺|tl|lira)/gi,
    /(\d+(?:[.,]\d+)?)\s*(?:\$|USD|usd|dolar)/gi,
    /(\d+(?:[.,]\d+)?)\s*(?:€|EUR|eur|euro)/gi,
    /fiyat[ıi]?\s*:?\s*(\d+(?:[.,]\d+)?)/gi,
    /price\s*:?\s*(\d+(?:[.,]\d+)?)/gi
];

const PRODUCT_KEYWORDS = [
    'ürün', 'product', 'satılık', 'satış', 'paket', 'plan',
    'fiyat', 'price', 'tl', 'usd', '₺', '$', 'indirim',
    'kampanya', 'stok', 'adet', 'lisans', 'key', 'hesap'
];

const SERVICE_KEYWORDS = [
    'hizmet', 'service', 'destek', 'support', 'kurulum',
    'setup', 'yapılandırma', 'config', 'danışmanlık',
    'eğitim', 'training', 'bakım', 'maintenance'
];

const FAQ_KEYWORDS = [
    'sss', 'faq', 'soru', 'cevap', 'nasıl', 'nedir',
    'how', 'what', 'why', 'ne zaman', 'when', 'neden'
];

const RULE_KEYWORDS = [
    'kural', 'rule', 'yasak', 'banned', 'izin', 'allowed',
    'zorunlu', 'required', 'uyarı', 'warning', 'ceza', 'ban'
];

const ANNOUNCEMENT_KEYWORDS = [
    'duyuru', 'announcement', 'güncelleme', 'update',
    'yeni', 'new', 'önemli', 'important', 'dikkat', 'attention'
];

class KnowledgeService {
    constructor() {
        this.processingQueue = new Map();
    }

    detectContentType(content) {
        const contentLower = content.toLowerCase();
        
        let scores = {
            product: 0,
            service: 0,
            faq: 0,
            rule: 0,
            announcement: 0,
            general: 0
        };

        PRODUCT_KEYWORDS.forEach(kw => {
            if (contentLower.includes(kw)) scores.product += 2;
        });

        SERVICE_KEYWORDS.forEach(kw => {
            if (contentLower.includes(kw)) scores.service += 2;
        });

        FAQ_KEYWORDS.forEach(kw => {
            if (contentLower.includes(kw)) scores.faq += 2;
        });

        RULE_KEYWORDS.forEach(kw => {
            if (contentLower.includes(kw)) scores.rule += 2;
        });

        ANNOUNCEMENT_KEYWORDS.forEach(kw => {
            if (contentLower.includes(kw)) scores.announcement += 2;
        });

        PRICE_PATTERNS.forEach(pattern => {
            pattern.lastIndex = 0;
            if (pattern.test(content)) scores.product += 3;
        });

        const maxScore = Math.max(...Object.values(scores));
        if (maxScore < 2) return 'general';

        return Object.entries(scores).find(([, score]) => score === maxScore)[0];
    }

    extractPrice(content) {
        for (const pattern of PRICE_PATTERNS) {
            const match = content.match(pattern);
            if (match) {
                return match[0];
            }
        }
        return null;
    }

    extractTitle(content) {
        const lines = content.split('\n').filter(l => l.trim());
        
        for (const line of lines) {
            const cleaned = line.replace(/[*_~`#]/g, '').trim();
            if (cleaned.length > 5 && cleaned.length < 100) {
                return cleaned;
            }
        }
        
        const firstSentence = content.split(/[.!?\n]/)[0].trim();
        if (firstSentence.length > 5 && firstSentence.length < 100) {
            return firstSentence;
        }
        
        return content.substring(0, 80).trim() + (content.length > 80 ? '...' : '');
    }

    extractKeywords(content) {
        const words = content.toLowerCase()
            .replace(/[^\wığüşöçİĞÜŞÖÇ\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3);
        
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }

    calculateImportance(content, channelName = '') {
        let importance = 1;
        
        if (content.length > 200) importance += 1;
        if (content.length > 500) importance += 1;
        
        const importantChannels = ['duyuru', 'announcement', 'önemli', 'important', 'ürün', 'product', 'fiyat', 'price'];
        if (importantChannels.some(kw => channelName.toLowerCase().includes(kw))) {
            importance += 1;
        }
        
        if (content.includes('**') || content.includes('##')) importance += 1;
        
        return Math.min(importance, 5);
    }

    async processMessage(message) {
        try {
            const content = message.content;
            
            if (!content || content.length < 20) return null;
            
            if (content.startsWith('/') || content.startsWith('!')) return null;
            
            const type = this.detectContentType(content);
            if (type === 'general' && content.length < 50) return null;

            const item = {
                type,
                title: this.extractTitle(content),
                content: content.substring(0, 2000),
                price: this.extractPrice(content),
                keywords: this.extractKeywords(content),
                sourceChannelId: message.channel.id,
                sourceMessageId: message.id,
                importance: this.calculateImportance(content, message.channel.name),
                lastUpdated: new Date()
            };

            return item;
        } catch (error) {
            logger.error(`Knowledge processing error: ${error.message}`);
            return null;
        }
    }

    async indexMessage(guildId, message) {
        try {
            const item = await this.processMessage(message);
            if (!item) return false;

            const knowledge = await ServerKnowledge.getOrCreate(guildId);
            await knowledge.addItem(item);
            
            logger.debug(`Indexed message ${message.id} as ${item.type}`);
            return true;
        } catch (error) {
            logger.error(`Index message error: ${error.message}`);
            return false;
        }
    }

    async scanChannel(channel, limit = 100) {
        try {
            const messages = await channel.messages.fetch({ limit });
            let indexedCount = 0;

            for (const [, message] of messages) {
                if (message.author.bot) continue;
                
                const success = await this.indexMessage(channel.guild.id, message);
                if (success) indexedCount++;
            }

            const knowledge = await ServerKnowledge.getOrCreate(channel.guild.id);
            const channelIndex = knowledge.indexedChannels.findIndex(
                c => c.channelId === channel.id
            );

            const channelData = {
                channelId: channel.id,
                channelName: channel.name,
                lastIndexed: new Date(),
                messageCount: indexedCount
            };

            if (channelIndex >= 0) {
                knowledge.indexedChannels[channelIndex] = channelData;
            } else {
                knowledge.indexedChannels.push(channelData);
            }

            await knowledge.save();
            
            logger.info(`Scanned channel ${channel.name}: ${indexedCount} items indexed`);
            return indexedCount;
        } catch (error) {
            logger.error(`Scan channel error: ${error.message}`);
            return 0;
        }
    }

    async fullScan(guild, options = {}) {
        const { excludeCategories = [], maxChannels = 20 } = options;
        
        try {
            const knowledge = await ServerKnowledge.getOrCreate(guild.id);
            let totalIndexed = 0;
            let channelsScanned = 0;

            const textChannels = guild.channels.cache
                .filter(c => c.type === 0)
                .filter(c => !excludeCategories.includes(c.parentId))
                .first(maxChannels);

            const scanPromises = Array.from(textChannels.values()).map(async channel => {
                try {
                    const permissions = channel.permissionsFor(guild.members.me);
                    if (!permissions?.has('ViewChannel') || !permissions?.has('ReadMessageHistory')) {
                        return 0;
                    }
                    return await this.scanChannel(channel, 50);
                } catch (err) {
                    logger.warn(`Could not scan channel ${channel.name}: ${err.message}`);
                    return 0;
                }
            });

            const results = await Promise.all(scanPromises);
            totalIndexed = results.reduce((sum, n) => sum + n, 0);
            channelsScanned = results.filter(n => n > 0).length;

            knowledge.stats.lastFullScan = new Date();
            knowledge.updateStats();
            await knowledge.save();

            logger.info(`Full scan complete: ${channelsScanned} channels, ${totalIndexed} items`);
            return { channelsScanned, totalIndexed };
        } catch (error) {
            logger.error(`Full scan error: ${error.message}`);
            return { channelsScanned: 0, totalIndexed: 0 };
        }
    }

    async getContext(guildId, query) {
        try {
            const knowledge = await ServerKnowledge.getOrCreate(guildId);
            
            const relevantItems = knowledge.search(query, 5);
            
            if (relevantItems.length === 0) {
                return null;
            }

            let context = '**Sunucu Bilgi Tabanı:**\n\n';
            
            relevantItems.forEach((item, index) => {
                context += `${index + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
                context += `   ${item.content.substring(0, 200)}${item.content.length > 200 ? '...' : ''}\n`;
                if (item.price) context += `   💰 Fiyat: ${item.price}\n`;
                context += '\n';
            });

            return context;
        } catch (error) {
            logger.error(`Get context error: ${error.message}`);
            return null;
        }
    }

    async getStats(guildId) {
        try {
            const knowledge = await ServerKnowledge.getOrCreate(guildId);
            return {
                totalItems: knowledge.stats.totalItems,
                products: knowledge.stats.productsCount,
                services: knowledge.stats.servicesCount,
                faqs: knowledge.stats.faqCount,
                lastScan: knowledge.stats.lastFullScan,
                channels: knowledge.indexedChannels.length
            };
        } catch (error) {
            logger.error(`Get stats error: ${error.message}`);
            return null;
        }
    }
}

export const knowledgeService = new KnowledgeService();
