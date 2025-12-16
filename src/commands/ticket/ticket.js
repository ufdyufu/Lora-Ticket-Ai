import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Ticket } from '../../models/Ticket.js';
import { ticketService } from '../../services/TicketService.js';
import { Guild } from '../../models/Guild.js';
import { getLocale, t } from '../../locales/index.js';

export const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket yönetim komutları')
    .addSubcommand(subcommand =>
        subcommand
            .setName('close')
            .setDescription('Mevcut ticketı kapat')
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('Kapatma sebebi')
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Ticketa kullanıcı ekle')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('Eklenecek kullanıcı')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('remove')
            .setDescription('Tickettan kullanıcı çıkar')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('Çıkarılacak kullanıcı')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('rename')
            .setDescription('Ticket kanalını yeniden adlandır')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('Yeni kanal adı')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('priority')
            .setDescription('Ticket önceliğini değiştir')
            .addStringOption(option =>
                option
                    .setName('level')
                    .setDescription('Öncelik seviyesi')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Düşük', value: 'low' },
                        { name: 'Orta', value: 'medium' },
                        { name: 'Yüksek', value: 'high' },
                        { name: 'Acil', value: 'urgent' }
                    )
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('info')
            .setDescription('Ticket bilgilerini görüntüle')
    );

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig.language || 'tr');

    if (!ticket && subcommand !== 'info') {
        return await interaction.reply({
            content: t(locale, 'ticket.onlyInTicket'),
            ephemeral: true
        });
    }

    const hasPermission = (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has(PermissionFlagsBits.Administrator);

    switch (subcommand) {
        case 'close':
            if (!hasPermission) {
                return await interaction.reply({ content: t(locale, 'ticket.noPermission'), ephemeral: true });
            }
            const reason = interaction.options.getString('reason') || 'Resolved';
            await interaction.reply({ content: `🔒 ${t(locale, 'ticket.closed')}` });
            await ticketService.closeTicket(interaction, reason);
            break;

        case 'add':
            if (!hasPermission) {
                return await interaction.reply({ content: t(locale, 'ticket.noPermission'), ephemeral: true });
            }
            const userToAdd = interaction.options.getUser('user');
            await ticketService.addUserToTicket(interaction.channel, userToAdd.id);
            await interaction.reply({ content: `✅ ${t(locale, 'ticket.userAdded', { user: `<@${userToAdd.id}>` })}` });
            break;

        case 'remove':
            if (!hasPermission) {
                return await interaction.reply({ content: t(locale, 'ticket.noPermission'), ephemeral: true });
            }
            const userToRemove = interaction.options.getUser('user');
            await ticketService.removeUserFromTicket(interaction.channel, userToRemove.id);
            await interaction.reply({ content: `✅ ${t(locale, 'ticket.userRemoved', { user: `<@${userToRemove.id}>` })}` });
            break;

        case 'rename':
            if (!hasPermission) {
                return await interaction.reply({ content: t(locale, 'ticket.noPermission'), ephemeral: true });
            }
            const newName = interaction.options.getString('name');
            await interaction.channel.setName(newName);
            await interaction.reply({ content: `✅ ${t(locale, 'ticket.renamed', { name: newName })}` });
            break;

        case 'priority':
            if (!hasPermission) {
                return await interaction.reply({ content: t(locale, 'ticket.noPermission'), ephemeral: true });
            }
            const priority = interaction.options.getString('level');
            ticket.priority = priority;
            await ticket.save();
            
            await interaction.reply({ content: `✅ ${t(locale, 'ticket.priorityChanged', { priority: t(locale, `priorities.${priority}`) })}` });
            break;

        case 'info':
            if (!ticket) {
                return await interaction.reply({ content: t(locale, 'ticket.notFound'), ephemeral: true });
            }
            
            const priorityLabels = {
                low: `🟢 ${t(locale, 'priorities.low')}`,
                medium: `🟡 ${t(locale, 'priorities.medium')}`,
                high: `🟠 ${t(locale, 'priorities.high')}`,
                urgent: `🔴 ${t(locale, 'priorities.urgent')}`
            };
            const statusLabels = {
                open: `🟢 ${t(locale, 'statuses.open')}`,
                closed: `🔴 ${t(locale, 'statuses.closed')}`,
                locked: `🔒 ${t(locale, 'statuses.locked')}`,
                archived: `📦 ${t(locale, 'statuses.archived')}`
            };
            
            const info = [
                `**Ticket ID:** ${ticket.ticketId}`,
                `**${t(locale, 'fields.subject')}:** ${ticket.subject}`,
                `**${t(locale, 'fields.category')}:** ${ticket.category}`,
                `**${t(locale, 'fields.priority')}:** ${priorityLabels[ticket.priority]}`,
                `**${t(locale, 'fields.status')}:** ${statusLabels[ticket.status]}`,
                `**${t(locale, 'fields.sentimentScore')}:** ${ticket.sentimentScore}/100`,
                `**${t(locale, 'fields.openedBy')}:** <@${ticket.userId}>`,
                ticket.assignedTo ? `**${t(locale, 'fields.assignedTo')}:** <@${ticket.assignedTo}>` : null,
                `**${t(locale, 'fields.createdAt')}:** <t:${Math.floor(ticket.createdAt.getTime() / 1000)}:R>`
            ].filter(Boolean).join('\n');

            await interaction.reply({ content: info, ephemeral: true });
            break;
    }
}
