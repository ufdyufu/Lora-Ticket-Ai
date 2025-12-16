import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Ticket } from '../models/Ticket.js';
import { Transcript } from '../models/Transcript.js';
import { Guild } from '../models/Guild.js';
import { aiService } from './AIService.js';
import { createTicketEmbed, createCloseEmbed, createLogEmbed } from '../utils/embeds.js';
import { generateTranscriptHTML } from '../utils/htmlGenerator.js';
import { getLocale, t } from '../locales/index.js';
import { logger } from '../config/logger.js';

class TicketService {
    async createTicket(interaction, subject, description, category = 'support') {
        const { guild, user } = interaction;
        
        const guildConfig = await Guild.getOrCreate(guild.id);
        const ticketId = await Ticket.generateTicketId(guild.id);
        
        let analysis = { priority: 'medium', sentiment: 50, isUrgent: false, suggestedResponse: null };
        
        if (guildConfig.settings.aiEnabled && description) {
            const categories = guildConfig.categories.map(c => c.name);
            analysis = await aiService.analyzeTicket(description, categories, guildConfig.language || 'tr');
            
            if (guildConfig.settings.autoRouting && analysis.category !== category) {
                category = analysis.category;
            }
        }

        const channelName = this.generateChannelName(ticketId, user.username, analysis.isUrgent);
        
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: guildConfig.ticketCategoryId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles
                    ]
                },
                ...(guildConfig.supportRoleId ? [{
                    id: guildConfig.supportRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages
                    ]
                }] : [])
            ]
        });

        const ticket = await Ticket.create({
            ticketId,
            guildId: guild.id,
            userId: user.id,
            channelId: ticketChannel.id,
            category,
            priority: analysis.priority,
            sentimentScore: analysis.sentiment,
            subject,
            description
        });

        await Transcript.create({
            ticketId,
            guildId: guild.id,
            messages: []
        });

        const lang = guildConfig.language || 'tr';
        const locale = getLocale(lang);
        const embed = createTicketEmbed(ticket, user, analysis, lang);
        const message = await ticketChannel.send({
            content: analysis.isUrgent && guildConfig.seniorRoleId 
                ? `<@&${guildConfig.seniorRoleId}> 🚨 ${t(locale, 'ticket.urgent')}` 
                : `<@${user.id}>`,
            embeds: [embed],
            components: this.getTicketComponents(lang)
        });

        if (analysis.suggestedResponse && guildConfig.settings.aiEnabled) {
            await ticketChannel.send({
                content: analysis.suggestedResponse
            });
        }

        logger.info(`Ticket created: ${ticketId} by ${user.tag}`);
        return { ticket, channel: ticketChannel };
    }

    async closeTicket(interaction, reason = 'Çözüldü') {
        const { channel, user, guild } = interaction;
        
        const ticket = await Ticket.findOne({ channelId: channel.id, status: { $in: ['open', 'locked'] } });
        if (!ticket) return null;

        const guildConfig = await Guild.getOrCreate(guild.id);
        const transcript = await Transcript.findOne({ ticketId: ticket.ticketId });

        let summary = null;
        if (guildConfig.settings.aiEnabled && transcript?.messages.length > 0) {
            summary = await aiService.generateSummary(transcript.messages, guildConfig.language || 'tr');
        }

        ticket.status = 'closed';
        ticket.closedBy = user.id;
        ticket.closedAt = new Date();
        ticket.summary = summary;
        await ticket.save();

        if (guildConfig.settings.transcriptEnabled && transcript) {
            transcript.aiSummary = summary;
            transcript.htmlContent = generateTranscriptHTML(transcript, ticket, guild);
            await transcript.save();
        }

        const lang = guildConfig.language || 'tr';

        if (guildConfig.logChannelId) {
            const logChannel = guild.channels.cache.get(guildConfig.logChannelId);
            if (logChannel) {
                const logEmbed = createLogEmbed(ticket, user, summary, lang);
                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        if (guildConfig.settings.dmOnClose) {
            try {
                const ticketUser = await guild.members.fetch(ticket.userId);
                const closeEmbed = createCloseEmbed(ticket, summary, lang);
                await ticketUser.send({ embeds: [closeEmbed] });
            } catch (error) {
                logger.warn(`Could not DM user ${ticket.userId}: ${error.message}`);
            }
        }

        await channel.send({
            embeds: [createCloseEmbed(ticket, summary, lang)],
            components: []
        });

        setTimeout(() => {
            channel.delete().catch(error => {
                logger.error(`Failed to delete channel: ${error.message}`);
            });
        }, 5000);

        logger.info(`Ticket closed: ${ticket.ticketId} by ${user.tag}`);
        return ticket;
    }

    async lockTicket(channel) {
        const ticket = await Ticket.findOne({ channelId: channel.id, status: 'open' });
        if (!ticket) return null;

        ticket.status = 'locked';
        await ticket.save();

        await channel.permissionOverwrites.edit(ticket.userId, {
            SendMessages: false
        });

        return ticket;
    }

    async unlockTicket(channel) {
        const ticket = await Ticket.findOne({ channelId: channel.id, status: 'locked' });
        if (!ticket) return null;

        ticket.status = 'open';
        await ticket.save();

        await channel.permissionOverwrites.edit(ticket.userId, {
            SendMessages: true
        });

        return ticket;
    }

    async addUserToTicket(channel, userId) {
        await channel.permissionOverwrites.edit(userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });
    }

    async removeUserFromTicket(channel, userId) {
        await channel.permissionOverwrites.delete(userId);
    }

    generateChannelName(ticketId, username, isUrgent) {
        const prefix = isUrgent ? '🔴-acil' : 'ticket';
        const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
        return `${prefix}-${sanitizedUsername}-${ticketId.toLowerCase()}`;
    }

    getTicketComponents(lang = 'tr') {
        const locale = getLocale(lang);
        return [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel(t(locale, 'buttons.close'))
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒'),
                new ButtonBuilder()
                    .setCustomId('ticket_lock')
                    .setLabel(t(locale, 'buttons.lock'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔐'),
                new ButtonBuilder()
                    .setCustomId('ticket_claim')
                    .setLabel(t(locale, 'buttons.claim'))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✋'),
                new ButtonBuilder()
                    .setCustomId('ticket_unlock')
                    .setLabel(t(locale, 'buttons.unlock'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔓')
            )
        ];
    }
}

export const ticketService = new TicketService();
