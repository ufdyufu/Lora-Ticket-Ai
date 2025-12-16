import { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} from 'discord.js';
import { Ticket } from '../../models/Ticket.js';
import { Transcript } from '../../models/Transcript.js';
import { Guild } from '../../models/Guild.js';
import { aiService } from '../../services/AIService.js';
import { knowledgeService } from '../../services/KnowledgeService.js';
import { createGhostEmbed } from '../../utils/embeds.js';
import { getLocale, t } from '../../locales/index.js';
import { randomUUID } from 'crypto';

export const data = new SlashCommandBuilder()
    .setName('ask-ai')
    .setDescription('AI asistandan yardım al (Ghost Mode)')
    .addStringOption(option =>
        option
            .setName('question')
            .setDescription('AI\'a sormak istediğiniz soru')
            .setRequired(true)
    );

export async function execute(interaction, client) {
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

    const question = interaction.options.getString('question');
    const transcript = await Transcript.findOne({ ticketId: ticket.ticketId });
    const messages = transcript?.messages || [];

    let knowledgeContext = null;
    if (guildConfig.settings.knowledgeEnabled) {
        knowledgeContext = await knowledgeService.getContext(interaction.guild.id, question);
    }

    const response = await aiService.getContextualResponse(messages, question, knowledgeContext, lang);
    const responseId = randomUUID();

    if (!client.ghostResponses) {
        client.ghostResponses = new Map();
    }
    
    if (client.ghostResponses.size >= 100) {
        const firstKey = client.ghostResponses.keys().next().value;
        client.ghostResponses.delete(firstKey);
    }
    
    client.ghostResponses.set(responseId, response);

    setTimeout(() => {
        client.ghostResponses.delete(responseId);
    }, 300000);

    const embed = createGhostEmbed(response, lang);
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`ghost_send_${responseId}`)
            .setLabel(t(locale, 'buttons.sendResponse'))
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📤'),
        new ButtonBuilder()
            .setCustomId('ghost_dismiss')
            .setLabel(t(locale, 'buttons.cancel'))
            .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
}
