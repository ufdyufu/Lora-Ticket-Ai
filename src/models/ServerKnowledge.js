import mongoose from 'mongoose';

const knowledgeItemSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['product', 'service', 'faq', 'rule', 'announcement', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    keywords: [{
        type: String
    }],
    sourceChannelId: {
        type: String
    },
    sourceMessageId: {
        type: String
    },
    importance: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const serverKnowledgeSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    items: [knowledgeItemSchema],
    indexedChannels: [{
        channelId: String,
        channelName: String,
        lastIndexed: Date,
        messageCount: Number
    }],
    stats: {
        totalItems: {
            type: Number,
            default: 0
        },
        lastFullScan: {
            type: Date
        },
        productsCount: {
            type: Number,
            default: 0
        },
        servicesCount: {
            type: Number,
            default: 0
        },
        faqCount: {
            type: Number,
            default: 0
        }
    },
    settings: {
        autoIndex: {
            type: Boolean,
            default: true
        },
        indexChannels: [{
            type: String
        }],
        excludeChannels: [{
            type: String
        }],
        minMessageLength: {
            type: Number,
            default: 20
        }
    }
}, {
    timestamps: true
});

serverKnowledgeSchema.statics.getOrCreate = async function(guildId) {
    let knowledge = await this.findOne({ guildId });
    if (!knowledge) {
        knowledge = await this.create({ guildId });
    }
    return knowledge;
};

serverKnowledgeSchema.methods.addItem = function(item) {
    const existingIndex = this.items.findIndex(
        i => i.sourceMessageId === item.sourceMessageId
    );
    
    if (existingIndex >= 0) {
        Object.assign(this.items[existingIndex], item, { lastUpdated: new Date() });
    } else {
        this.items.push(item);
    }
    
    this.updateStats();
    return this.save();
};

serverKnowledgeSchema.methods.updateStats = function() {
    this.stats.totalItems = this.items.length;
    this.stats.productsCount = this.items.filter(i => i.type === 'product').length;
    this.stats.servicesCount = this.items.filter(i => i.type === 'service').length;
    this.stats.faqCount = this.items.filter(i => i.type === 'faq').length;
};

serverKnowledgeSchema.methods.search = function(query, limit = 10) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);
    
    const scored = this.items.map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        
        if (titleLower.includes(queryLower)) score += 10;
        if (contentLower.includes(queryLower)) score += 5;
        
        queryWords.forEach(word => {
            if (titleLower.includes(word)) score += 3;
            if (contentLower.includes(word)) score += 2;
            if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 4;
        });
        
        score *= item.importance;
        
        return { item, score };
    });
    
    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.item);
};

serverKnowledgeSchema.methods.getByType = function(type) {
    return this.items.filter(i => i.type === type);
};

serverKnowledgeSchema.methods.getSummary = function() {
    const products = this.getByType('product').slice(0, 5);
    const services = this.getByType('service').slice(0, 5);
    const faqs = this.getByType('faq').slice(0, 5);
    
    let summary = '';
    
    if (products.length > 0) {
        summary += '**Ürünler:**\n';
        products.forEach(p => {
            summary += `- ${p.title}${p.price ? ` (${p.price})` : ''}\n`;
        });
        summary += '\n';
    }
    
    if (services.length > 0) {
        summary += '**Hizmetler:**\n';
        services.forEach(s => {
            summary += `- ${s.title}${s.price ? ` (${s.price})` : ''}\n`;
        });
        summary += '\n';
    }
    
    if (faqs.length > 0) {
        summary += '**Sık Sorulan Sorular:**\n';
        faqs.forEach(f => {
            summary += `- ${f.title}\n`;
        });
    }
    
    return summary || 'Henüz bilgi eklenmemiş.';
};

export const ServerKnowledge = mongoose.model('ServerKnowledge', serverKnowledgeSchema);
