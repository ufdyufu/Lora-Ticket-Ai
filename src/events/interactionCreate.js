import { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder
} from 'discord.js';
import { ticketService } from '../services/TicketService.js';
import { Ticket } from '../models/Ticket.js';
import { Guild } from '../models/Guild.js';
import { getLocale, t } from '../locales/index.js';

export const name = 'interactionCreate';
export const once = false;

export async function execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
        await handleCommand(interaction, client);
    } else if (interaction.isButton()) {
        await handleButton(interaction, client);
    } else if (interaction.isModalSubmit()) {
        await handleModal(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
        await handleSelectMenu(interaction, client);
    }
}

async function handleCommand(interaction, client) {
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
        client.logger.warn(`Unknown command: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        client.logger.error(`Command error (${interaction.commandName}): ${error.message}`);
        
        const guildConfig = interaction.guild ? await Guild.getOrCreate(interaction.guild.id) : null;
        const locale = getLocale(guildConfig?.language || 'tr');
        const errorMessage = { 
            content: t(locale, 'common.error'), 
            ephemeral: true 
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
}

async function handleButton(interaction, client) {
    const { customId } = interaction;

    try {
        switch (customId) {
            case 'ticket_create':
                await showTicketModal(interaction);
                break;
            case 'ticket_close':
                await handleTicketClose(interaction);
                break;
            case 'ticket_lock':
                await handleTicketLock(interaction);
                break;
            case 'ticket_unlock':
                await handleTicketUnlock(interaction);
                break;
            case 'ticket_claim':
                await handleTicketClaim(interaction);
                break;
            case 'ghost_dismiss':
                const dismissGuildConfig = await Guild.getOrCreate(interaction.guild.id);
                const dismissLocale = getLocale(dismissGuildConfig?.language || 'tr');
                await interaction.update({ content: `❌ ${t(dismissLocale, 'interaction.responseCancelled')}`, embeds: [], components: [] });
                break;
            default:
                if (customId.startsWith('ghost_send_')) {
                    await handleGhostSend(interaction);
                }
        }
    } catch (error) {
        client.logger.error(`Button error (${customId}): ${error.message}`);
        const guildConfig = await Guild.getOrCreate(interaction.guild.id);
        const locale = getLocale(guildConfig?.language || 'tr');
        const errorMessage = { content: t(locale, 'common.error'), ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage).catch(() => {});
        } else {
            await interaction.reply(errorMessage).catch(() => {});
        }
    }
}

async function handleModal(interaction, client) {
    const { customId } = interaction;

    try {
        if (customId === 'ticket_modal') {
            await handleTicketCreate(interaction);
        }
    } catch (error) {
        client.logger.error(`Modal error (${customId}): ${error.message}`);
        const guildConfig = await Guild.getOrCreate(interaction.guild.id);
        const locale = getLocale(guildConfig?.language || 'tr');
        const errorMessage = { content: t(locale, 'common.error'), ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage).catch(() => {});
        } else {
            await interaction.reply(errorMessage).catch(() => {});
        }
    }
}

async function handleSelectMenu(interaction, client) {
    const { customId, values } = interaction;

    try {
        if (customId === 'ticket_category') {
            const guildConfig = await Guild.getOrCreate(interaction.guild.id);
            const locale = getLocale(guildConfig?.language || 'tr');
            await interaction.update({ content: t(locale, 'interaction.categorySelected', { category: values[0] }), components: [] });
        }
    } catch (error) {
        client.logger.error(`Select menu error: ${error.message}`);
    }
}

async function showTicketModal(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');

    const modal = new ModalBuilder()
        .setCustomId('ticket_modal')
        .setTitle(t(locale, 'modal.title'));

    const subjectInput = new TextInputBuilder()
        .setCustomId('ticket_subject')
        .setLabel(t(locale, 'modal.subjectLabel'))
        .setPlaceholder(t(locale, 'modal.subjectPlaceholder'))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('ticket_description')
        .setLabel(t(locale, 'modal.descriptionLabel'))
        .setPlaceholder(t(locale, 'modal.descriptionPlaceholder'))
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

    modal.addComponents(
        new ActionRowBuilder().addComponents(subjectInput),
        new ActionRowBuilder().addComponents(descriptionInput)
    );

    await interaction.showModal(modal);
}

async function handleTicketCreate(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');

    const subject = interaction.fields.getTextInputValue('ticket_subject');
    const description = interaction.fields.getTextInputValue('ticket_description');

    const existingTicket = await Ticket.findOne({
        guildId: interaction.guild.id,
        userId: interaction.user.id,
        status: { $in: ['open', 'locked'] }
    });

    if (existingTicket) {
        return await interaction.editReply({
            content: t(locale, 'ticket.alreadyOpen', { channel: `<#${existingTicket.channelId}>` })
        });
    }

    const { ticket, channel } = await ticketService.createTicket(
        interaction,
        subject,
        description
    );

    await interaction.editReply({
        content: t(locale, 'ticket.created', { channel: `<#${channel.id}>` })
    });
}

async function handleTicketClose(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');
    
    const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
    const isOwner = ticket && ticket.userId === interaction.user.id;
    const hasPermission = isOwner ||
        (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has('Administrator');

    if (!hasPermission) {
        return await interaction.reply({
            content: t(locale, 'ticket.noPermission'),
            ephemeral: true
        });
    }

    await interaction.reply({ content: `🔒 ${t(locale, 'ticket.closed')}` });
    await ticketService.closeTicket(interaction);
}

async function handleTicketLock(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');
    
    const hasPermission = (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has('Administrator');

    if (!hasPermission) {
        return await interaction.reply({
            content: t(locale, 'ticket.noPermission'),
            ephemeral: true
        });
    }

    const ticket = await ticketService.lockTicket(interaction.channel);
    
    if (ticket) {
        await interaction.reply({ content: `🔐 ${t(locale, 'ticket.locked')}` });
    } else {
        await interaction.reply({ content: t(locale, 'ticket.notFound'), ephemeral: true });
    }
}

async function handleTicketUnlock(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');
    
    const hasPermission = (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has('Administrator');

    if (!hasPermission) {
        return await interaction.reply({
            content: t(locale, 'ticket.noPermission'),
            ephemeral: true
        });
    }

    const ticket = await ticketService.unlockTicket(interaction.channel);
    
    if (ticket) {
        await interaction.reply({ content: `🔓 ${t(locale, 'ticket.unlocked')}` });
    } else {
        await interaction.reply({ content: t(locale, 'ticket.notFound'), ephemeral: true });
    }
}

async function handleTicketClaim(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');
    
    const hasPermission = (guildConfig.supportRoleId && interaction.member.roles.cache.has(guildConfig.supportRoleId)) ||
        interaction.member.permissions.has('Administrator');

    if (!hasPermission) {
        return await interaction.reply({
            content: t(locale, 'ticket.noPermission'),
            ephemeral: true
        });
    }

    const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
    
    if (!ticket) {
        return await interaction.reply({ content: t(locale, 'ticket.notFound'), ephemeral: true });
    }

    ticket.assignedTo = interaction.user.id;
    await ticket.save();

    await interaction.reply({
        content: `✋ ${t(locale, 'ticket.claimed', { user: `<@${interaction.user.id}>` })}`
    });
}

async function handleGhostSend(interaction) {
    const guildConfig = await Guild.getOrCreate(interaction.guild.id);
    const locale = getLocale(guildConfig?.language || 'tr');

    const responseId = interaction.customId.replace('ghost_send_', '');
    const cachedResponse = interaction.client.ghostResponses?.get(responseId);
    
    if (!cachedResponse) {
        return await interaction.reply({
            content: t(locale, 'ai.responseNotFound'),
            ephemeral: true
        });
    }

    await interaction.channel.send({ content: cachedResponse });
    await interaction.update({
        content: `✅ ${t(locale, 'ai.responseSent')}`,
        embeds: [],
        components: []
    });

    interaction.client.ghostResponses?.delete(responseId);
}
