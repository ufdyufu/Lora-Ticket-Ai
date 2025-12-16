import { 
    SlashCommandBuilder, 
    PermissionFlagsBits,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import { Guild } from '../../models/Guild.js';
import { createPanelEmbed } from '../../utils/embeds.js';
import { getLocale, t, locales } from '../../locales/index.js';

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Ticket sistemini yapılandır')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('panel')
            .setDescription('Ticket panelini oluştur')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Panel kanalı')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('category')
            .setDescription('Ticket kategorisini ayarla')
            .addChannelOption(option =>
                option
                    .setName('category')
                    .setDescription('Ticket kanallarının oluşturulacağı kategori')
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('logs')
            .setDescription('Log kanalını ayarla')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Log kanalı')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('roles')
            .setDescription('Destek rollerini ayarla')
            .addRoleOption(option =>
                option
                    .setName('support')
                    .setDescription('Destek ekibi rolü')
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName('senior')
                    .setDescription('Kıdemli destek rolü (acil ticketlar için)')
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('language')
            .setDescription('Bot dilini ayarla / Set bot language')
            .addStringOption(option =>
                option
                    .setName('lang')
                    .setDescription('Dil / Language')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Türkçe', value: 'tr' },
                        { name: 'English', value: 'en' }
                    )
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('settings')
            .setDescription('Bot ayarlarını yapılandır')
            .addBooleanOption(option =>
                option
                    .setName('ai')
                    .setDescription('AI özelliklerini etkinleştir')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('routing')
                    .setDescription('Otomatik yönlendirmeyi etkinleştir')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('sentiment')
                    .setDescription('Duygu analizini etkinleştir')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('transcripts')
                    .setDescription('Transcript kayıtlarını etkinleştir')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('dm')
                    .setDescription('Kapatıldığında DM gönder')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('knowledge')
                    .setDescription('Bilgi tabanı sistemini etkinleştir')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName('autoindex')
                    .setDescription('Otomatik içerik indexlemeyi etkinleştir')
                    .setRequired(false)
            )
    );

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);

    const locale = getLocale(guildConfig.language || 'tr');

    switch (subcommand) {
        case 'panel':
            await setupPanel(interaction, guildConfig, locale);
            break;
        case 'category':
            await setupCategory(interaction, guildConfig, locale);
            break;
        case 'logs':
            await setupLogs(interaction, guildConfig, locale);
            break;
        case 'roles':
            await setupRoles(interaction, guildConfig, locale);
            break;
        case 'language':
            await setupLanguage(interaction, guildConfig);
            break;
        case 'settings':
            await setupSettings(interaction, guildConfig, locale);
            break;
    }
}

async function setupPanel(interaction, guildConfig, locale) {
    const channel = interaction.options.getChannel('channel');

    const embed = createPanelEmbed(guildConfig);
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_create')
            .setLabel(t(locale, 'buttons.createTicket'))
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎫')
    );

    const message = await channel.send({ embeds: [embed], components: [button] });

    guildConfig.ticketPanelChannelId = channel.id;
    guildConfig.ticketPanelMessageId = message.id;
    await guildConfig.save();

    await interaction.reply({
        content: `✅ ${t(locale, 'setup.panelCreated', { channel: `<#${channel.id}>` })}`,
        ephemeral: true
    });
}

async function setupCategory(interaction, guildConfig, locale) {
    const category = interaction.options.getChannel('category');

    guildConfig.ticketCategoryId = category.id;
    await guildConfig.save();

    await interaction.reply({
        content: `✅ ${t(locale, 'setup.categorySet', { name: category.name })}`,
        ephemeral: true
    });
}

async function setupLogs(interaction, guildConfig, locale) {
    const channel = interaction.options.getChannel('channel');

    guildConfig.logChannelId = channel.id;
    await guildConfig.save();

    await interaction.reply({
        content: `✅ ${t(locale, 'setup.logChannelSet', { channel: `<#${channel.id}>` })}`,
        ephemeral: true
    });
}

async function setupRoles(interaction, guildConfig, locale) {
    const supportRole = interaction.options.getRole('support');
    const seniorRole = interaction.options.getRole('senior');

    guildConfig.supportRoleId = supportRole.id;
    if (seniorRole) {
        guildConfig.seniorRoleId = seniorRole.id;
    }
    await guildConfig.save();

    let response = `✅ ${t(locale, 'setup.supportRoleSet', { role: supportRole.name })}`;
    if (seniorRole) {
        response += `\n✅ ${t(locale, 'setup.seniorRoleSet', { role: seniorRole.name })}`;
    }

    await interaction.reply({ content: response, ephemeral: true });
}

async function setupLanguage(interaction, guildConfig) {
    const lang = interaction.options.getString('lang');
    
    guildConfig.language = lang;
    await guildConfig.save();

    const locale = getLocale(lang);
    await interaction.reply({
        content: `✅ ${t(locale, 'setup.languageSet', { language: locale.name })}`,
        ephemeral: true
    });
}

async function setupSettings(interaction, guildConfig, locale) {
    const ai = interaction.options.getBoolean('ai');
    const routing = interaction.options.getBoolean('routing');
    const sentiment = interaction.options.getBoolean('sentiment');
    const transcripts = interaction.options.getBoolean('transcripts');
    const dm = interaction.options.getBoolean('dm');
    const knowledge = interaction.options.getBoolean('knowledge');
    const autoindex = interaction.options.getBoolean('autoindex');

    if (ai !== null) guildConfig.settings.aiEnabled = ai;
    if (routing !== null) guildConfig.settings.autoRouting = routing;
    if (sentiment !== null) guildConfig.settings.sentimentAnalysis = sentiment;
    if (transcripts !== null) guildConfig.settings.transcriptEnabled = transcripts;
    if (dm !== null) guildConfig.settings.dmOnClose = dm;
    if (knowledge !== null) guildConfig.settings.knowledgeEnabled = knowledge;
    if (autoindex !== null) guildConfig.settings.autoIndexing = autoindex;

    await guildConfig.save();

    const settings = [
        `${t(locale, 'settings.ai')}: ${guildConfig.settings.aiEnabled ? '✅' : '❌'}`,
        `${t(locale, 'settings.autoRouting')}: ${guildConfig.settings.autoRouting ? '✅' : '❌'}`,
        `${t(locale, 'settings.sentimentAnalysis')}: ${guildConfig.settings.sentimentAnalysis ? '✅' : '❌'}`,
        `${t(locale, 'settings.transcript')}: ${guildConfig.settings.transcriptEnabled ? '✅' : '❌'}`,
        `${t(locale, 'settings.dmNotification')}: ${guildConfig.settings.dmOnClose ? '✅' : '❌'}`,
        `${t(locale, 'knowledge.title')}: ${guildConfig.settings.knowledgeEnabled ? '✅' : '❌'}`,
        `${t(locale, 'knowledge.autoIndexing')}: ${guildConfig.settings.autoIndexing ? '✅' : '❌'}`
    ].join('\n');

    await interaction.reply({
        content: `✅ ${t(locale, 'setup.settingsUpdated')}\n${settings}`,
        ephemeral: true
    });
}
