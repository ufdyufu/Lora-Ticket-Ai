import { 
    SlashCommandBuilder, 
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} from 'discord.js';
import { Guild } from '../../models/Guild.js';
import { ServerKnowledge } from '../../models/ServerKnowledge.js';
import { knowledgeService } from '../../services/KnowledgeService.js';
import { getLocale, t } from '../../locales/index.js';

const DIVIDER = '─────────────────────────';

export const data = new SlashCommandBuilder()
    .setName('knowledge')
    .setDescription('Sunucu bilgi tabanı yönetimi')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('setup')
            .setDescription('Bilgi tabanını otomatik kur ve tüm kanalları tara')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('scan')
            .setDescription('Belirli bir kanalı tara')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Taranacak kanal')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('status')
            .setDescription('Bilgi tabanı durumunu görüntüle')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('clear')
            .setDescription('Bilgi tabanını temizle')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('toggle')
            .setDescription('Otomatik indexlemeyi aç/kapat')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('search')
            .setDescription('Bilgi tabanında ara')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('Arama sorgusu')
                    .setRequired(true)
            )
    );

export async function execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const lang = guildConfig.language || 'tr';
    const locale = getLocale(lang);

    switch (subcommand) {
        case 'setup':
            await handleSetup(interaction, locale);
            break;
        case 'scan':
            await handleScan(interaction, locale);
            break;
        case 'status':
            await handleStatus(interaction, locale);
            break;
        case 'clear':
            await handleClear(interaction, locale);
            break;
        case 'toggle':
            await handleToggle(interaction, guildConfig, locale);
            break;
        case 'search':
            await handleSearch(interaction, locale);
            break;
    }
}

async function handleSetup(interaction, locale) {
    await interaction.deferReply();
    
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ name: t(locale, 'knowledge.title'), iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
\`\`\`fix
🔄 ${t(locale, 'knowledge.setupStarted')}
\`\`\`
${DIVIDER}

▸ ${t(locale, 'knowledge.scanningChannels')}
▸ ${t(locale, 'knowledge.mayTakeTime')}
        `.trim())
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });

    const result = await knowledgeService.fullScan(interaction.guild);

    const completeEmbed = new EmbedBuilder()
        .setColor(0x00D26A)
        .setAuthor({ name: t(locale, 'knowledge.title'), iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
\`\`\`diff
+ ${t(locale, 'knowledge.setupComplete')}
\`\`\`
${DIVIDER}

${t(locale, 'knowledge.contentIndexed')}
        `.trim())
        .addFields(
            { 
                name: `📊 ${t(locale, 'knowledge.statistics')}`, 
                value: `▸ **${t(locale, 'knowledge.channelsScanned')}:** \`${result.channelsScanned}\`\n▸ **${t(locale, 'knowledge.itemsIndexed')}:** \`${result.totalIndexed}\``,
                inline: false 
            }
        )
        .setFooter({ text: `⚡ ${t(locale, 'knowledge.autoIndexNote')}` })
        .setTimestamp();

    await interaction.editReply({ embeds: [completeEmbed] });
}

async function handleScan(interaction, locale) {
    await interaction.deferReply();
    
    const channel = interaction.options.getChannel('channel');
    const indexed = await knowledgeService.scanChannel(channel, 100);

    const embed = new EmbedBuilder()
        .setColor(0x00D26A)
        .setAuthor({ name: t(locale, 'knowledge.channelScan'), iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
\`\`\`diff
+ ${t(locale, 'knowledge.scanComplete')}
\`\`\`
${DIVIDER}

▸ **${t(locale, 'knowledge.channel')}:** <#${channel.id}>
▸ **${t(locale, 'knowledge.indexed')}:** \`${indexed}\` ${t(locale, 'knowledge.items')}
        `.trim())
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
}

async function handleStatus(interaction, locale) {
    const stats = await knowledgeService.getStats(interaction.guild.id);
    const knowledge = await ServerKnowledge.getOrCreate(interaction.guild.id);

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ name: `📊 ${t(locale, 'knowledge.statusTitle')}`, iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
        `.trim())
        .addFields(
            { 
                name: `📦 ${t(locale, 'knowledge.generalInfo')}`, 
                value: `▸ **${t(locale, 'knowledge.totalItems')}:** \`${stats?.totalItems || 0}\`\n▸ **${t(locale, 'knowledge.channelsScanned')}:** \`${stats?.channels || 0}\`\n▸ **${t(locale, 'knowledge.lastScan')}:** ${stats?.lastScan ? `<t:${Math.floor(new Date(stats.lastScan).getTime() / 1000)}:R>` : `\`${t(locale, 'knowledge.notScannedYet')}\``}`,
                inline: true 
            },
            { 
                name: `📋 ${t(locale, 'knowledge.contentDistribution')}`, 
                value: `▸ **${t(locale, 'knowledge.products')}:** \`${stats?.products || 0}\`\n▸ **${t(locale, 'knowledge.services')}:** \`${stats?.services || 0}\`\n▸ **${t(locale, 'knowledge.faqs')}:** \`${stats?.faqs || 0}\``,
                inline: true 
            }
        )
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    if (knowledge.items.length > 0) {
        const preview = knowledge.items.slice(0, 5).map((item, i) => 
            `${i + 1}. [${item.type.toUpperCase()}] ${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}`
        ).join('\n');
        
        embed.addFields({ name: `\n📋 ${t(locale, 'knowledge.recentItems')}`, value: `\`\`\`\n${preview || t(locale, 'knowledge.none')}\n\`\`\``, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
}

async function handleClear(interaction, locale) {
    const knowledge = await ServerKnowledge.getOrCreate(interaction.guild.id);
    
    knowledge.items = [];
    knowledge.indexedChannels = [];
    knowledge.stats = {
        totalItems: 0,
        productsCount: 0,
        servicesCount: 0,
        faqCount: 0
    };
    await knowledge.save();

    const embed = new EmbedBuilder()
        .setColor(0xFF4757)
        .setAuthor({ name: t(locale, 'knowledge.title'), iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
\`\`\`diff
- ${t(locale, 'knowledge.cleared')}
\`\`\`
${DIVIDER}

▸ ${t(locale, 'knowledge.allContentDeleted')}
▸ ${t(locale, 'knowledge.useSetupToAdd')}
        `.trim())
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleToggle(interaction, guildConfig, locale) {
    guildConfig.settings.autoIndexing = !guildConfig.settings.autoIndexing;
    await guildConfig.save();

    const status = guildConfig.settings.autoIndexing;
    const embed = new EmbedBuilder()
        .setColor(status ? 0x00D26A : 0xFF4757)
        .setAuthor({ name: t(locale, 'knowledge.autoIndexing'), iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
\`\`\`${status ? `diff\n+ ${t(locale, 'common.active')}` : `diff\n- ${t(locale, 'common.disabled')}`}\`\`\`
${DIVIDER}

${status 
    ? `▸ ${t(locale, 'knowledge.autoIndexEnabled')}\n▸ ${t(locale, 'knowledge.systemContinues')}`
    : `▸ ${t(locale, 'knowledge.autoIndexDisabled')}\n▸ ${t(locale, 'knowledge.useManualScan')}`}
        `.trim())
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSearch(interaction, locale) {
    const query = interaction.options.getString('query');
    const knowledge = await ServerKnowledge.getOrCreate(interaction.guild.id);
    
    const results = knowledge.search(query, 5);

    if (results.length === 0) {
        return await interaction.reply({
            content: `❌ ${t(locale, 'knowledge.noSearchResults')}`,
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor(0x00B8D9)
        .setAuthor({ name: `🔍 ${t(locale, 'knowledge.searchResults')}`, iconURL: interaction.guild.iconURL() })
        .setDescription(`
${DIVIDER}
**${t(locale, 'knowledge.query')}:** \`${query}\`
**${t(locale, 'knowledge.resultsFound', { count: results.length })}**
${DIVIDER}
        `.trim())
        .setFooter({ text: '⚡ Powered by Lora Ticket AI' })
        .setTimestamp();

    results.forEach((item, i) => {
        const typeEmoji = { product: '🛍️', service: '💼', faq: '❓', general: '📄' };
        embed.addFields({
            name: `${typeEmoji[item.type] || '📄'} ${item.title.substring(0, 50)}`,
            value: `\`\`\`\n${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}\n\`\`\`${item.price ? `💰 **${t(locale, 'knowledge.price')}:** \`${item.price}\`` : ''}`,
            inline: false
        });
    });

    await interaction.reply({ embeds: [embed] });
}
