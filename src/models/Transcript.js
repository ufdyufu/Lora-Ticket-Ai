import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorAvatar: {
        type: String
    },
    content: {
        type: String
    },
    attachments: [{
        url: String,
        name: String
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const transcriptSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    guildId: {
        type: String,
        required: true
    },
    messages: [messageSchema],
    htmlContent: {
        type: String
    },
    aiSummary: {
        type: String
    }
}, {
    timestamps: true
});

transcriptSchema.methods.addMessage = function(message) {
    this.messages.push({
        authorId: message.author.id,
        authorName: message.author.username,
        authorAvatar: message.author.displayAvatarURL(),
        content: message.content,
        attachments: message.attachments.map(a => ({ url: a.url, name: a.name })),
        timestamp: message.createdAt
    });
    return this.save();
};

export const Transcript = mongoose.model('Transcript', transcriptSchema);
