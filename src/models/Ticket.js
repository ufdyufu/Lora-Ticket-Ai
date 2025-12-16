import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    channelId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'support'
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'archived', 'locked'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sentimentScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    summary: {
        type: String
    },
    assignedTo: {
        type: String
    },
    closedBy: {
        type: String
    },
    closedAt: {
        type: Date
    }
}, {
    timestamps: true
});

ticketSchema.statics.generateTicketId = async function(guildId) {
    const lastTicket = await this.findOne({ guildId }).sort({ createdAt: -1 });
    const lastNum = lastTicket ? parseInt(lastTicket.ticketId.split('-')[1]) : 0;
    return `T-${(lastNum + 1).toString().padStart(4, '0')}`;
};

ticketSchema.index({ guildId: 1, status: 1 });
ticketSchema.index({ guildId: 1, userId: 1 });

export const Ticket = mongoose.model('Ticket', ticketSchema);
