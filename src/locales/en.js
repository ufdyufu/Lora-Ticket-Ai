export default {
    code: 'en',
    name: 'English',

    ticket: {
        created: 'Ticket created: {channel}',
        closed: 'Closing ticket...',
        locked: 'Ticket locked.',
        unlocked: 'Ticket unlocked.',
        claimed: 'Ticket claimed by {user}.',
        notFound: 'Ticket not found.',
        alreadyOpen: 'You already have an open ticket: {channel}',
        onlyInTicket: 'This command can only be used in ticket channels.',
        userAdded: '{user} added to ticket.',
        userRemoved: '{user} removed from ticket.',
        renamed: 'Channel renamed to **{name}**.',
        priorityChanged: 'Priority changed to **{priority}**.',
        noPermission: 'You do not have permission for this action.',
        urgent: 'Urgent ticket!'
    },

    priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent'
    },

    statuses: {
        open: 'Open',
        closed: 'Closed',
        locked: 'Locked',
        archived: 'Archived'
    },

    categories: {
        support: 'Technical support',
        sales: 'Sales and pricing',
        billing: 'Invoices and payments',
        other: 'Other inquiries'
    },

    embeds: {
        ticketTitle: 'Ticket {id}',
        ticketClosed: 'Ticket Closed',
        ticketClosedDesc: 'Ticket **{id}** has been closed successfully.',
        ticketLog: 'Ticket Log - {id}',
        panelTitle: 'Create Support Ticket',
        panelDesc: 'Click the button below to create a new support ticket.',
        ghostTitle: 'AI Assistant Suggestion',
        ghostFooter: 'This message is only visible to you',
        analyzeTitle: 'Ticket Analysis',
        routingSuggestion: 'Routing Suggestion',
        routingDesc: 'This ticket could be moved to **{category}** category.\nReason: {reason}',
        suggestedResponse: 'Suggested Response',
        aiSummary: 'AI Summary',
        noDescription: 'No description provided.',
        urgentStatus: '**This ticket has been marked as urgent!**'
    },

    fields: {
        openedBy: 'Opened By',
        closedBy: 'Closed By',
        category: 'Category',
        priority: 'Priority',
        status: 'Status',
        subject: 'Subject',
        duration: 'Duration',
        sentimentScore: 'Sentiment Score',
        suggestedCategory: 'Suggested Category',
        isUrgent: 'Is Urgent?',
        assignedTo: 'Assigned To',
        createdAt: 'Created At'
    },

    buttons: {
        close: 'Close',
        lock: 'Lock',
        unlock: 'Unlock',
        claim: 'Claim',
        createTicket: 'Create Ticket',
        sendResponse: 'Send this response',
        cancel: 'Cancel'
    },

    modal: {
        title: 'Create Support Ticket',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Briefly describe your issue',
        descriptionLabel: 'Detailed Description',
        descriptionPlaceholder: 'Describe your issue in detail...'
    },

    setup: {
        panelCreated: 'Ticket panel created in {channel}.',
        categorySet: 'Ticket category set to **{name}**.',
        logChannelSet: 'Log channel set to {channel}.',
        supportRoleSet: 'Support role set to **{role}**.',
        seniorRoleSet: 'Senior support role set to **{role}**.',
        settingsUpdated: 'Settings updated:',
        languageSet: 'Language set to **{language}**.'
    },

    settings: {
        ai: 'AI',
        autoRouting: 'Auto Routing',
        sentimentAnalysis: 'Sentiment Analysis',
        transcript: 'Transcript',
        dmNotification: 'DM Notification'
    },

    ai: {
        onlyStaff: 'This command is only available for support staff.',
        disabled: 'AI features are disabled on this server.',
        noMessages: 'No messages found to analyze.',
        responseNotFound: 'Response not found or expired.',
        responseSent: 'Response sent.',
        defaultResponse: 'Hello! Your request has been received, we will assist you shortly.',
        summaryFailed: 'Failed to generate summary.',
        responseFailed: 'Failed to generate response. Please try again.'
    },

    time: {
        hours: 'hours',
        minutes: 'minutes'
    },

    common: {
        yes: 'Yes',
        no: 'No',
        error: 'An error occurred.',
        footer: 'Powered by Lora Tech',
        active: 'ACTIVE',
        disabled: 'DISABLED',
        noResults: 'No results found.'
    },

    analyze: {
        title: 'AI Ticket Analysis',
        reportTitle: 'Ticket #{id} Analysis Report',
        results: 'Analysis Results',
        suggestedCategory: 'Suggested Category',
        urgentYes: 'YES',
        urgentNo: 'NO',
        routingSuggestion: 'Routing Suggestion',
        canBeMovedTo: 'Can be moved to {category} category',
        confidence: 'Confidence',
        reason: 'Reason',
        suggestedResponse: 'Suggested Response'
    },

    knowledge: {
        title: 'Knowledge Base',
        setupStarted: 'Setup Started',
        scanningChannels: 'Scanning server channels...',
        mayTakeTime: 'This may take a few minutes.',
        setupComplete: 'Setup Complete!',
        contentIndexed: 'Server content has been successfully indexed.',
        statistics: 'Statistics',
        channelsScanned: 'Channels Scanned',
        itemsIndexed: 'Items Indexed',
        autoIndexNote: 'New messages will be automatically indexed',
        channelScan: 'Channel Scan',
        scanComplete: 'Scan Complete',
        channel: 'Channel',
        indexed: 'Indexed',
        items: 'items',
        statusTitle: 'Knowledge Base Status',
        generalInfo: 'General Info',
        totalItems: 'Total Items',
        lastScan: 'Last Scan',
        notScannedYet: 'Not scanned yet',
        contentDistribution: 'Content Distribution',
        products: 'Products',
        services: 'Services',
        faqs: 'FAQs',
        recentItems: 'Recent Items',
        none: 'None',
        cleared: 'Knowledge Base Cleared',
        allContentDeleted: 'All indexed content has been deleted.',
        useSetupToAdd: 'Use `/knowledge setup` to add new content.',
        autoIndexing: 'Auto Indexing',
        autoIndexEnabled: 'New messages will be automatically indexed.',
        systemContinues: 'System will continue running in the background.',
        autoIndexDisabled: 'New messages will not be indexed.',
        useManualScan: 'Use `/knowledge scan` for manual scanning.',
        searchResults: 'Search Results',
        query: 'Query',
        resultsFound: '{count} items found',
        noSearchResults: 'No search results found.',
        price: 'Price'
    },

    interaction: {
        categorySelected: 'Category selected: {category}',
        responseCancelled: 'Response cancelled.'
    },

    embedFields: {
        users: 'Users',
        details: 'Details',
        statistics: 'Statistics',
        panelHint: 'Click the button below to create a support ticket.'
    },

    defaults: {
        welcomeMessage: 'Hello! Our support team will assist you shortly.',
        supportDesc: 'Technical support',
        salesDesc: 'Sales and pricing',
        billingDesc: 'Invoices and payments',
        otherDesc: 'Other inquiries'
    },

    aiPrompts: {
        ticketAnalysis: 'You are a support ticket analysis assistant. Analyze the user message and return the following in JSON format:\n- category: Most suitable category ({categories})\n- priority: Priority level (low, medium, high, urgent)\n- sentiment: Sentiment score (0-100, 0=very negative, 100=very positive)\n- isUrgent: Does it require urgent attention (true/false)\n- suggestedResponse: Suggested initial response to the user\n\nReturn only JSON, no additional explanation.',
        summarySystem: 'You are a support ticket summary assistant. Analyze the conversation and create a summary in this format:\n\n**Issue:** [The problem the user faced]\n**Solution:** [The applied solution or outcome]\n**Notes:** [Important details or follow-up items]\n\nBe brief and concise.',
        ghostSystem: 'You are an experienced support specialist. You help staff by reading ticket history.\nPrepare professional, polite, and solution-oriented responses.\nYour response should be ready to send directly to the user.',
        ghostQuestion: 'Ticket History:\n{context}\n\nStaff Question: {question}\n\nWhat response should be given to the user in this situation?',
        autoResponseSystem: 'You are a helpful support assistant. Respond to user questions briefly and concisely.\n- Try to help the user\n- If you cannot answer, tell the user that a staff member will help\n- Keep your response to 2-3 sentences maximum\n- Be professional and polite',
        knowledgeContext: 'Use the following server information to respond:\n{context}',
        contextualKnowledge: 'Use the server knowledge base to provide accurate information:\n{context}',
        previousConversation: 'Previous conversation:\n{context}\n\nUser\'s last message: {message}',
        routingSystem: 'Analyze the ticket content and suggest routing to the correct department.\nCurrent category: {currentCategory}\nAvailable categories: {categories}\n\nReturn in JSON format:\n- shouldReroute: boolean\n- suggestedCategory: string\n- confidence: number (0-1)\n- reason: string',
        defaultResponse: 'Hello! Your request has been received, we will assist you shortly.',
        summaryFailed: 'Failed to generate summary.',
        responseFailed: 'Failed to generate response. Please try again.'
    }
};
