import { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import { Guild } from '../../models/Guild.js';
import { getLocale, t } from '../../locales/index.js';

export const data = new SlashCommandBuilder()
    .setName('lora')
    .setDescription('LORA API bilgileri / LORA API information')
    .addSubcommand(subcommand =>
        subcommand
            .setName('info')
            .setDescription('LORA API hakkında bilgi / About LORA API')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('models')
            .setDescription('Desteklenen modeller / Supported models')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('pricing')
            .setDescription('Fiyatlandırma planları / Pricing plans')
    );

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const lang = guildConfig.language || 'tr';

    switch (subcommand) {
        case 'info':
            await showInfo(interaction, lang);
            break;
        case 'models':
            await showModels(interaction, lang);
            break;
        case 'pricing':
            await showPricing(interaction, lang);
            break;
    }
}

async function showInfo(interaction, lang) {
    const embed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setAuthor({ name: 'LORA API', iconURL: 'https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless' })
        .setDescription(`
─────────────────────────
${lang === 'tr' 
    ? '> 🚀 *Tek bir API üzerinden birden fazla AI modeline erişim sağlayan güçlü bir platform.*'
    : '> 🚀 *A powerful platform providing access to multiple AI models through a single API.*'}
─────────────────────────
        `.trim())
        .addFields(
            {
                name: lang === 'tr' ? '✨ Özellikler' : '✨ Features',
                value: lang === 'tr'
                    ? '▸ Çoklu model desteği\n▸ OpenAI uyumlu API\n▸ Uygun fiyatlandırma\n▸ Türkçe destek'
                    : '▸ Multi-model support\n▸ OpenAI compatible API\n▸ Affordable pricing\n▸ 24/7 Support',
                inline: true
            },
            {
                name: lang === 'tr' ? '🌐 Sağlayıcılar' : '🌐 Providers',
                value: '\`Google Gemini\`\n\`xAI Grok\`\n\`Anthropic Claude\`\n\`Meta Llama\`\n\`Kimi K2\`',
                inline: true
            }
        )
        .setImage('https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless')
        .setFooter({ text: '⚡ loratech.dev' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel(lang === 'tr' ? 'API Key Al' : 'Get API Key')
            .setStyle(ButtonStyle.Link)
            .setURL('https://api.loratech.dev')
            .setEmoji('🔑'),
        new ButtonBuilder()
            .setLabel(lang === 'tr' ? 'Ana Site' : 'Main Site')
            .setStyle(ButtonStyle.Link)
            .setURL('https://loratech.dev')
            .setEmoji('😎')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function showModels(interaction, lang) {
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ name: lang === 'tr' ? '🤖 Desteklenen Modeller' : '🤖 Supported Models', iconURL: 'https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless' })
        .setDescription(`
─────────────────────────
        `.trim())
        .addFields(
            {
                name: '🔵 Google Gemini',
                value: '\`\`\`\ngemini-2.5-pro\ngemini-2.5-flash\ngemini-2.5-flash-lite\n\`\`\`',
                inline: true
            },
            {
                name: '⚡ xAI Grok',
                value: '\`\`\`\ngrok-4-1-fast-reasoning\ngrok-4-fast\ngrok-code-fast-1\n\`\`\`',
                inline: true
            },
            {
                name: '🟣 Anthropic Claude',
                value: '\`\`\`\nclaude-4.5-sonnet\nclaude-4.5-haiku\n\`\`\`',
                inline: true
            },
            {
                name: '🦙 Meta Llama',
                value: '\`\`\`\nllama-4-maverick\nllama-4-scout\n\`\`\`',
                inline: true
            },
            {
                name: '🌐 OpenAI OSS',
                value: '\`\`\`\ngpt-oss-120b\ngpt-oss-20b\n\`\`\`',
                inline: true
            },
            {
                name: '🔮 Kimi K2',
                value: '\`\`\`\nkimi-k2\n\`\`\`',
                inline: true
            }
        )
        .setFooter({ text: lang === 'tr' ? '⚡ Tüm modeller için: loratech.dev' : '⚡ All models at: loratech.dev' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel(lang === 'tr' ? 'Tüm Modelleri Gör' : 'View All Models')
            .setStyle(ButtonStyle.Link)
            .setURL('https://api.loratech.dev')
            .setEmoji('🔍')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function showPricing(interaction, lang) {
    const embed = new EmbedBuilder()
        .setColor(0x00D26A)
        .setAuthor({ name: lang === 'tr' ? '💰 Fiyatlandırma Planları' : '💰 Pricing Plans', iconURL: 'https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless' })
        .setDescription(`
─────────────────────────
> ${lang === 'tr' 
    ? '💫 *İhtiyacınıza uygun planı seçin. Tüm planlar aninda aktif olur.*'
    : '💫 *Choose the plan that fits your needs. All plans activate instantly.*'}
─────────────────────────
        `.trim())
        .addFields(
            {
                name: '🎓 ' + (lang === 'tr' ? 'Öğrenci' : 'Student'),
                value: `\`\`\`fix\n$5/ay\n\`\`\`${lang === 'tr'
                    ? '▸ 5,000 istek/ay\n▸ Gemini 2.5 Pro\n▸ Email destek'
                    : '▸ 5,000 requests/month\n▸ Gemini 2.5 Pro\n▸ Email support'}`,
                inline: true
            },
            {
                name: '🚀 ' + (lang === 'tr' ? 'Başlangıç' : 'Starter'),
                value: `\`\`\`fix\n$8/ay\n\`\`\`${lang === 'tr'
                    ? '▸ 1,500 istek/ay\n▸ Grok 4 modelleri\n▸ Streaming'
                    : '▸ 1,500 requests/month\n▸ Grok 4 models\n▸ Streaming'}`,
                inline: true
            },
            {
                name: '💼 ' + (lang === 'tr' ? 'Temel' : 'Basic'),
                value: `\`\`\`fix\n$15/ay\n\`\`\`${lang === 'tr'
                    ? '▸ 5,000 istek/ay\n▸ Gemini + Grok\n▸ Analitik'
                    : '▸ 5,000 requests/month\n▸ Gemini + Grok\n▸ Analytics'}`,
                inline: true
            },
            {
                name: '👑 ' + (lang === 'tr' ? 'Profesyonel' : 'Professional'),
                value: `\`\`\`diff\n+ $40/ay\n\`\`\`${lang === 'tr'
                    ? '▸ 15,000 istek/ay\n▸ Tüm modeller\n▸ Öncelikli destek'
                    : '▸ 15,000 requests/month\n▸ All models\n▸ Priority support'}`,
                inline: true
            }
        )
        .setFooter({ text: lang === 'tr' ? '⚡ Token bazlı ödeme de mevcuttur' : '⚡ Pay-as-you-go also available' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel(lang === 'tr' ? 'Planları İncele' : 'View Plans')
            .setStyle(ButtonStyle.Link)
            .setURL('https://api.loratech.dev')
            .setEmoji('💳'),
        new ButtonBuilder()
            .setLabel(lang === 'tr' ? 'Hemen Başla' : 'Get Started')
            .setStyle(ButtonStyle.Link)
            .setURL('https://api.loratech.dev/customer/register')
            .setEmoji('🚀')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
}
