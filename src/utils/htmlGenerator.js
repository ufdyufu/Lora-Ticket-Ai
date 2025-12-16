export function generateTranscriptHTML(transcript, ticket, guild) {
    const messages = transcript.messages.map(msg => `
        <div class="message">
            <img class="avatar" src="${msg.authorAvatar || 'https://media.discordapp.net/attachments/1442189019160252455/1450217379584933938/loralogo.png?ex=6942646f&is=694112ef&hm=5723ab231e44936f890ce2be38738284f03ee27d8c5ef5c6bb6fa61b36a82077&=&format=webp&quality=lossless'}" alt="avatar">
            <div class="content">
                <div class="header">
                    <span class="author">${escapeHtml(msg.authorName)}</span>
                    <span class="timestamp">${formatDate(msg.timestamp)}</span>
                </div>
                <div class="text">${escapeHtml(msg.content)}</div>
                ${msg.attachments.length > 0 ? `
                    <div class="attachments">
                        ${msg.attachments.map(a => `<a href="${a.url}" target="_blank">${escapeHtml(a.name)}</a>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transcript - ${ticket.ticketId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e4e4e4;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header h1 {
            color: #5865F2;
            font-size: 24px;
            margin-bottom: 16px;
        }
        .meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }
        .meta-item {
            background: rgba(255, 255, 255, 0.03);
            padding: 12px;
            border-radius: 8px;
        }
        .meta-label {
            color: #888;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .meta-value {
            font-size: 14px;
            font-weight: 500;
        }
        .summary {
            background: rgba(88, 101, 242, 0.1);
            border-left: 4px solid #5865F2;
            padding: 16px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 20px;
        }
        .summary h3 {
            color: #5865F2;
            margin-bottom: 8px;
        }
        .messages {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            padding: 16px;
        }
        .message {
            display: flex;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .message:hover {
            background: rgba(255, 255, 255, 0.03);
        }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .content {
            flex: 1;
            min-width: 0;
        }
        .content .header {
            background: none;
            padding: 0;
            margin-bottom: 4px;
            border: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .author {
            font-weight: 600;
            color: #fff;
        }
        .timestamp {
            font-size: 12px;
            color: #666;
        }
        .text {
            color: #dcddde;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .attachments {
            margin-top: 8px;
        }
        .attachments a {
            color: #5865F2;
            text-decoration: none;
            font-size: 14px;
        }
        .attachments a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            padding: 16px;
            color: #666;
            font-size: 12px;
        }
        .footer a {
            color: #5865F2;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Ticket Transcript - ${ticket.ticketId}</h1>
            <div class="meta">
                <div class="meta-item">
                    <div class="meta-label">Sunucu</div>
                    <div class="meta-value">${escapeHtml(guild.name)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Konu</div>
                    <div class="meta-value">${escapeHtml(ticket.subject)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Kategori</div>
                    <div class="meta-value">${ticket.category}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Öncelik</div>
                    <div class="meta-value">${ticket.priority}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Oluşturulma</div>
                    <div class="meta-value">${formatDate(ticket.createdAt)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Kapatılma</div>
                    <div class="meta-value">${formatDate(ticket.closedAt)}</div>
                </div>
            </div>
        </div>
        ${transcript.aiSummary ? `
        <div class="summary">
            <h3>🤖 AI Özet</h3>
            <p>${escapeHtml(transcript.aiSummary)}</p>
        </div>
        ` : ''}
        <div class="messages">
            ${messages}
        </div>
        <div class="footer">
            Powered by <a href="https://loratech.dev" target="_blank">Lora Tech</a>
        </div>
    </div>
</body>
</html>
    `.trim();
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(date) {
    return new Date(date).toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
