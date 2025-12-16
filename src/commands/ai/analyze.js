import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Ticket } from '../../models/Ticket.js';
import { Transcript } from '../../models/Transcript.js';
import { Guild } from '../../models/Guild.js';
import { aiService } from '../../services/AIService.js';
import { getLocale, t } from '../../locales/index.js';

export const data = new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Ticket içeriğini AI ile analiz et');

export async function execute(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const lang = guildConfig.language || 'tr';
    const locale = getLocale(lang);
    
    const hasPermission = (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has('Administrator');

    if (!hasPermission) {
        return await interaction.reply({
            content: t(locale, 'ai.onlyStaff'),
            ephemeral: true
        });
    }

    const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
    
    if (!ticket) {
        return await interaction.reply({
            content: t(locale, 'ticket.onlyInTicket'),
            ephemeral: true
        });
    }

    if (!guildConfig.settings.aiEnabled) {
        return await interaction.reply({
            content: t(locale, 'ai.disabled'),
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    const transcript = await Transcript.findOne({ ticketId: ticket.ticketId });
    const messages = transcript?.messages || [];

    if (messages.length === 0) {
        return await interaction.editReply({
            content: t(locale, 'ai.noMessages')
        });
    }

    const categories = guildConfig.categories.map(c => c.name);
    const lastMessages = messages.slice(-10).map(m => m.content).join('\n');
    
    const analysis = await aiService.analyzeTicket(lastMessages, categories, lang);
    const routing = await aiService.suggestRouting(lastMessages, ticket.category, categories, lang);

    const priorityIcons = {
        low: '🟢',
        medium: '🔵',
        high: '🟠',
        urgent: '🔴'
    };

    const sentimentEmoji = analysis.sentiment >= 70 ? '😊' : analysis.sentiment >= 40 ? '😐' : '😔';
    const priorityIcon = priorityIcons[analysis.priority.toLowerCase()] || '🔵';

    const embed = new EmbedBuilder()
        .setColor(analysis.isUrgent ? 0xFF4757 : 0x5865F2)
        .setAuthor({ name: `🔍 ${t(locale, 'analyze.title')}`, iconURL: interaction.guild.iconURL() })
        .setDescription(`
─────────────────────────
\`\`\`fix
${t(locale, 'analyze.reportTitle', { id: ticket.ticketId })}
\`\`\`
─────────────────────────
        `.trim())
        .addFields(
            { 
                name: `📊 ${t(locale, 'analyze.results')}`, 
                value: `▸ **${t(locale, 'analyze.suggestedCategory')}:** \`${analysis.category}\`\n▸ **${t(locale, 'fields.priority')}:** ${priorityIcon} ${t(locale, `priorities.${analysis.priority.toLowerCase()}`)}\n▸ **${t(locale, 'fields.sentimentScore')}:** ${sentimentEmoji} \`${analysis.sentiment}/100\`\n▸ **${t(locale, 'fields.isUrgent')}:** ${analysis.isUrgent ? `\`🔴 ${t(locale, 'analyze.urgentYes')}\`` : `\`🟢 ${t(locale, 'analyze.urgentNo')}\``}`,
                inline: false 
            }
        )
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    if (routing.shouldReroute && routing.confidence > 0.7) {
        embed.addFields({
            name: `🔄 ${t(locale, 'analyze.routingSuggestion')}`,
            value: `\`\`\`diff\n+ ${t(locale, 'analyze.canBeMovedTo', { category: routing.suggestedCategory })}\n\`\`\`▸ **${t(locale, 'analyze.confidence')}:** \`${Math.round(routing.confidence * 100)}%\`\n▸ **${t(locale, 'analyze.reason')}:** ${routing.reason}`,
            inline: false
        });
    }

    if (analysis.suggestedResponse) {
        embed.addFields({
            name: `💬 ${t(locale, 'analyze.suggestedResponse')}`,
            value: `\`\`\`\n${analysis.suggestedResponse.substring(0, 900)}\n\`\`\``,
            inline: false
        });
    }

    await interaction.editReply({ embeds: [embed] });
}
