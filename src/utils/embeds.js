import { EmbedBuilder } from 'discord.js';
import { getLocale, t } from '../locales/index.js';

const COLORS = {
    primary: 0x5865F2,
    secondary: 0x99AAB5,
    success: 0x00D26A,
    warning: 0xFFAB00,
    danger: 0xFF4757,
    urgent: 0xE74C3C,
    info: 0x00B8D9,
    purple: 0x9B59B6,
    gold: 0xF1C40F,
    dark: 0x2C3E50
};

const PRIORITY_COLORS = {
    low: 0x00D26A,
    medium: 0x5865F2,
    high: 0xFFAB00,
    urgent: 0xFF4757
};

const BRAND = {
    name: 'Lora Ticket AI',
    icon: 'https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless',
    footer: '⚡ Powered by Lora Ticket AI'
};

const DIVIDER = '─────────────────────────';
const BULLET = '▸';

function createBaseEmbed(color = COLORS.primary) {
    return new EmbedBuilder()
        .setColor(color)
        .setFooter({ text: BRAND.footer })
        .setTimestamp();
}

export function createTicketEmbed(ticket, user, analysis, lang = 'tr') {
    const locale = getLocale(lang);
    const color = analysis.isUrgent ? COLORS.urgent : PRIORITY_COLORS[ticket.priority];
    
    const priorityIcons = {
        low: '🟢',
        medium: '🔵',
        high: '🟠',
        urgent: '🔴'
    };

    const embed = createBaseEmbed(color)
        .setAuthor({ name: `Ticket #${ticket.ticketId}`, iconURL: BRAND.icon })
        .setDescription(`
${DIVIDER}
**${ticket.subject}**
${DIVIDER}

${ticket.description || t(locale, 'embeds.noDescription')}
        `.trim())
        .addFields(
            { 
                name: `\u200B`, 
                value: `${BULLET} **${t(locale, 'fields.openedBy')}:** <@${user.id}>\n${BULLET} **${t(locale, 'fields.category')}:** \`${ticket.category}\`\n${BULLET} **${t(locale, 'fields.priority')}:** ${priorityIcons[ticket.priority]} ${t(locale, `priorities.${ticket.priority}`)}`,
                inline: false 
            }
        );

    if (analysis.isUrgent) {
        embed.addFields({
            name: `⚠️ ${t(locale, 'fields.status')}`,
            value: `\`\`\`diff\n- ${t(locale, 'embeds.urgentStatus')}\n\`\`\``,
            inline: false
        });
    }

    return embed;
}

export function createCloseEmbed(ticket, summary, lang = 'tr') {
    const locale = getLocale(lang);
    
    const embed = createBaseEmbed(COLORS.danger)
        .setAuthor({ name: t(locale, 'embeds.ticketClosed'), iconURL: BRAND.icon })
        .setDescription(`
${DIVIDER}
\`\`\`\nTicket #${ticket.ticketId} ${t(locale, 'embeds.ticketClosedDesc', { id: '' }).trim()}\n\`\`\`
${DIVIDER}

${BULLET} **${t(locale, 'fields.subject')}:** ${ticket.subject}
${BULLET} **${t(locale, 'fields.category')}:** \`${ticket.category}\`
${BULLET} **${t(locale, 'fields.duration')}:** ⏱️ ${calculateDuration(ticket.createdAt, ticket.closedAt, lang)}
        `.trim());

    if (summary) {
        embed.addFields({ 
            name: `📝 ${t(locale, 'embeds.aiSummary')}`, 
            value: `\`\`\`\n${summary.substring(0, 1000)}\n\`\`\``, 
            inline: false 
        });
    }

    return embed;
}

export function createLogEmbed(ticket, closedBy, summary, lang = 'tr') {
    const locale = getLocale(lang);
    
    const priorityIcons = {
        low: '🟢',
        medium: '🔵',
        high: '🟠',
        urgent: '🔴'
    };

    const sentimentEmoji = ticket.sentimentScore >= 70 ? '😊' : ticket.sentimentScore >= 40 ? '😐' : '😔';

    const embed = createBaseEmbed(COLORS.dark)
        .setAuthor({ name: `📋 Ticket Log #${ticket.ticketId}`, iconURL: BRAND.icon })
        .setDescription(`
${DIVIDER}
**${ticket.subject}**
${DIVIDER}
        `.trim())
        .addFields(
            { 
                name: `👥 ${t(locale, 'embedFields.users')}`, 
                value: `${BULLET} **${t(locale, 'fields.openedBy')}:** <@${ticket.userId}>\n${BULLET} **${t(locale, 'fields.closedBy')}:** <@${closedBy.id}>`,
                inline: true 
            },
            { 
                name: `📊 ${t(locale, 'embedFields.details')}`, 
                value: `${BULLET} **${t(locale, 'fields.category')}:** \`${ticket.category}\`\n${BULLET} **${t(locale, 'fields.priority')}:** ${priorityIcons[ticket.priority]} ${t(locale, `priorities.${ticket.priority}`)}`,
                inline: true 
            },
            { 
                name: `📈 ${t(locale, 'embedFields.statistics')}`, 
                value: `${BULLET} **${t(locale, 'fields.sentimentScore')}:** ${sentimentEmoji} \`${ticket.sentimentScore}/100\`\n${BULLET} **${t(locale, 'fields.duration')}:** ⏱️ ${calculateDuration(ticket.createdAt, ticket.closedAt, lang)}`,
                inline: true 
            }
        );

    if (summary) {
        embed.addFields({ 
            name: `\n📝 ${t(locale, 'embeds.aiSummary')}`, 
            value: `\`\`\`\n${summary.substring(0, 1000)}\n\`\`\``, 
            inline: false 
        });
    }

    return embed;
}

export function createPanelEmbed(guildConfig) {
    const locale = getLocale(guildConfig.language || 'tr');
    const categories = guildConfig.categories
        .map(c => `${c.emoji} \`${c.name}\` ${BULLET} ${t(locale, `categories.${c.name}`) || c.description}`)
        .join('\n');

    return createBaseEmbed(COLORS.primary)
        .setAuthor({ name: BRAND.name, iconURL: BRAND.icon })
        .setTitle(`🎫 ${t(locale, 'embeds.panelTitle')}`)
        .setDescription(`
${t(locale, 'embeds.panelDesc')}

${DIVIDER}

**📁 ${t(locale, 'fields.category')}**

${categories}

${DIVIDER}

> 💡 *${t(locale, 'embedFields.panelHint')}*
        `.trim())
}

export function createGhostEmbed(response, lang = 'tr') {
    const locale = getLocale(lang);
    return createBaseEmbed(COLORS.purple)
        .setAuthor({ name: `👻 ${t(locale, 'embeds.ghostTitle')}`, iconURL: BRAND.icon })
        .setDescription(`
${DIVIDER}

${response}

${DIVIDER}

> 🔒 *${t(locale, 'embeds.ghostFooter')}*
        `.trim());
}

function calculateDuration(startDate, endDate, lang = 'tr') {
    const locale = getLocale(lang);
    const diff = new Date(endDate) - new Date(startDate);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours} ${t(locale, 'time.hours')} ${minutes} ${t(locale, 'time.minutes')}`;
    }
    return `${minutes} ${t(locale, 'time.minutes')}`;
}
