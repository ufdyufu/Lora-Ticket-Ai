import mongoose from 'mongoose';
import { getLocale, t } from '../locales/index.js';

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    ticketCategoryId: {
        type: String
    },
    logChannelId: {
        type: String
    },
    supportRoleId: {
        type: String
    },
    seniorRoleId: {
        type: String
    },
    ticketPanelChannelId: {
        type: String
    },
    ticketPanelMessageId: {
        type: String
    },
    language: {
        type: String,
        enum: ['tr', 'en'],
        default: 'tr'
    },
    welcomeMessage: {
        type: String,
        default: null
    },
    categories: [{
        name: {
            type: String,
            required: true
        },
        emoji: {
            type: String,
            default: '📋'
        },
        description: {
            type: String
        }
    }],
    settings: {
        aiEnabled: {
            type: Boolean,
            default: true
        },
        autoRouting: {
            type: Boolean,
            default: true
        },
        sentimentAnalysis: {
            type: Boolean,
            default: true
        },
        transcriptEnabled: {
            type: Boolean,
            default: true
        },
        dmOnClose: {
            type: Boolean,
            default: true
        },
        knowledgeEnabled: {
            type: Boolean,
            default: true
        },
        autoIndexing: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

guildSchema.statics.getOrCreate = async function(guildId, lang = 'tr') {
    let guild = await this.findOne({ guildId });
    if (!guild) {
        const locale = getLocale(lang);
        guild = await this.create({
            guildId,
            language: lang,
            categories: [
                { name: 'support', emoji: '🛠️', description: t(locale, 'defaults.supportDesc') },
                { name: 'sales', emoji: '💰', description: t(locale, 'defaults.salesDesc') },
                { name: 'billing', emoji: '📄', description: t(locale, 'defaults.billingDesc') },
                { name: 'other', emoji: '📋', description: t(locale, 'defaults.otherDesc') }
            ]
        });
    }
    return guild;
};

export const Guild = mongoose.model('Guild', guildSchema);
