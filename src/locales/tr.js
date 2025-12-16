export default {
    code: 'tr',
    name: 'Türkçe',

    ticket: {
        created: 'Ticket oluşturuldu: {channel}',
        closed: 'Ticket kapatılıyor...',
        locked: 'Ticket kilitlendi.',
        unlocked: 'Ticket kilidi açıldı.',
        claimed: 'Ticket {user} tarafından üstlenildi.',
        notFound: 'Ticket bulunamadı.',
        alreadyOpen: 'Zaten açık bir ticket\'ınız var: {channel}',
        onlyInTicket: 'Bu komut sadece ticket kanallarında kullanılabilir.',
        userAdded: '{user} ticketa eklendi.',
        userRemoved: '{user} tickettan çıkarıldı.',
        renamed: 'Kanal adı **{name}** olarak değiştirildi.',
        priorityChanged: 'Öncelik **{priority}** olarak değiştirildi.',
        noPermission: 'Bu işlem için yetkiniz yok.',
        urgent: 'Acil ticket!'
    },

    priorities: {
        low: 'Düşük',
        medium: 'Orta',
        high: 'Yüksek',
        urgent: 'Acil'
    },

    statuses: {
        open: 'Açık',
        closed: 'Kapalı',
        locked: 'Kilitli',
        archived: 'Arşivlenmiş'
    },

    categories: {
        support: 'Teknik destek',
        sales: 'Satış ve fiyatlandırma',
        billing: 'Fatura ve ödeme',
        other: 'Diğer konular'
    },

    embeds: {
        ticketTitle: 'Ticket {id}',
        ticketClosed: 'Ticket Kapatıldı',
        ticketClosedDesc: 'Ticket **{id}** başarıyla kapatıldı.',
        ticketLog: 'Ticket Log - {id}',
        panelTitle: 'Destek Talebi Oluştur',
        panelDesc: 'Aşağıdaki butona tıklayarak yeni bir destek talebi oluşturabilirsiniz.',
        ghostTitle: 'AI Asistan Önerisi',
        ghostFooter: 'Bu mesaj sadece size görünür',
        analyzeTitle: 'Ticket Analizi',
        routingSuggestion: 'Yönlendirme Önerisi',
        routingDesc: 'Bu ticket **{category}** kategorisine taşınabilir.\nSebep: {reason}',
        suggestedResponse: 'Önerilen Yanıt',
        aiSummary: 'AI Özet',
        noDescription: 'Açıklama girilmedi.',
        urgentStatus: '**Bu ticket acil olarak işaretlendi!**'
    },

    fields: {
        openedBy: 'Açan',
        closedBy: 'Kapatan',
        category: 'Kategori',
        priority: 'Öncelik',
        status: 'Durum',
        subject: 'Konu',
        duration: 'Süre',
        sentimentScore: 'Duygu Skoru',
        suggestedCategory: 'Önerilen Kategori',
        isUrgent: 'Acil mi?',
        assignedTo: 'Üstlenen',
        createdAt: 'Oluşturulma'
    },

    buttons: {
        close: 'Kapat',
        lock: 'Kilitle',
        unlock: 'Kilidi Aç',
        claim: 'Üstlen',
        createTicket: 'Ticket Oluştur',
        sendResponse: 'Bu yanıtı gönder',
        cancel: 'İptal'
    },

    modal: {
        title: 'Destek Talebi Oluştur',
        subjectLabel: 'Konu Başlığı',
        subjectPlaceholder: 'Sorununuzu kısaca özetleyin',
        descriptionLabel: 'Detaylı Açıklama',
        descriptionPlaceholder: 'Sorununuzu detaylı bir şekilde açıklayın...'
    },

    setup: {
        panelCreated: 'Ticket paneli {channel} kanalında oluşturuldu.',
        categorySet: 'Ticket kategorisi **{name}** olarak ayarlandı.',
        logChannelSet: 'Log kanalı {channel} olarak ayarlandı.',
        supportRoleSet: 'Destek rolü **{role}** olarak ayarlandı.',
        seniorRoleSet: 'Kıdemli destek rolü **{role}** olarak ayarlandı.',
        settingsUpdated: 'Ayarlar güncellendi:',
        languageSet: 'Dil **{language}** olarak ayarlandı.'
    },

    settings: {
        ai: 'AI',
        autoRouting: 'Otomatik Yönlendirme',
        sentimentAnalysis: 'Duygu Analizi',
        transcript: 'Transcript',
        dmNotification: 'DM Bildirimi'
    },

    ai: {
        onlyStaff: 'Bu komut sadece destek ekibi için kullanılabilir.',
        disabled: 'AI özellikleri bu sunucuda devre dışı.',
        noMessages: 'Analiz edilecek mesaj bulunamadı.',
        responseNotFound: 'Yanıt bulunamadı veya süresi doldu.',
        responseSent: 'Yanıt gönderildi.',
        defaultResponse: 'Merhaba! Talebiniz alındı, en kısa sürede size yardımcı olacağız.',
        summaryFailed: 'Özet oluşturulamadı.',
        responseFailed: 'Yanıt oluşturulamadı. Lütfen tekrar deneyin.'
    },

    time: {
        hours: 'saat',
        minutes: 'dakika'
    },

    common: {
        yes: 'Evet',
        no: 'Hayır',
        error: 'Bir hata oluştu.',
        footer: 'Powered by Lora Tech',
        active: 'AKTİF',
        disabled: 'DEVRE DIŞI',
        noResults: 'Sonuç bulunamadı.'
    },

    analyze: {
        title: 'AI Ticket Analizi',
        reportTitle: 'Ticket #{id} Analiz Raporu',
        results: 'Analiz Sonuçları',
        suggestedCategory: 'Önerilen Kategori',
        urgentYes: 'EVET',
        urgentNo: 'HAYIR',
        routingSuggestion: 'Yönlendirme Önerisi',
        canBeMovedTo: '{category} kategorisine taşınabilir',
        confidence: 'Güven',
        reason: 'Sebep',
        suggestedResponse: 'Önerilen Yanıt'
    },

    knowledge: {
        title: 'Bilgi Tabanı',
        setupStarted: 'Kurulum Başlatıldı',
        scanningChannels: 'Sunucu kanalları taranıyor...',
        mayTakeTime: 'Bu işlem birkaç dakika sürebilir.',
        setupComplete: 'Kurulum Tamamlandı!',
        contentIndexed: 'Sunucu içerikleri başarıyla indexlendi.',
        statistics: 'İstatistikler',
        channelsScanned: 'Taranan Kanal',
        itemsIndexed: 'Indexlenen Öğe',
        autoIndexNote: 'Yeni mesajlar otomatik olarak indexlenecek',
        channelScan: 'Kanal Tarama',
        scanComplete: 'Tarama Tamamlandı',
        channel: 'Kanal',
        indexed: 'Indexlenen',
        items: 'öğe',
        statusTitle: 'Bilgi Tabanı Durumu',
        generalInfo: 'Genel Bilgiler',
        totalItems: 'Toplam Öğe',
        lastScan: 'Son Tarama',
        notScannedYet: 'Henüz taranmadı',
        contentDistribution: 'İçerik Dağılımı',
        products: 'Ürünler',
        services: 'Hizmetler',
        faqs: 'SSS',
        recentItems: 'Son Eklenenler',
        none: 'Yok',
        cleared: 'Bilgi Tabanı Temizlendi',
        allContentDeleted: 'Tüm indexlenmiş içerikler silindi.',
        useSetupToAdd: 'Yeni içerik eklemek için `/knowledge setup` kullanın.',
        autoIndexing: 'Otomatik İndexleme',
        autoIndexEnabled: 'Yeni mesajlar otomatik olarak indexlenecek.',
        systemContinues: 'Sistem arka planda çalışmaya devam edecek.',
        autoIndexDisabled: 'Yeni mesajlar indexlenmeyecek.',
        useManualScan: 'Manuel tarama için `/knowledge scan` kullanın.',
        searchResults: 'Arama Sonuçları',
        query: 'Sorgu',
        resultsFound: '{count} öğe bulundu',
        noSearchResults: 'Arama sonucu bulunamadı.',
        price: 'Fiyat'
    },

    interaction: {
        categorySelected: 'Kategori seçildi: {category}',
        responseCancelled: 'Yanıt iptal edildi.'
    },

    embedFields: {
        users: 'Kullanıcılar',
        details: 'Detaylar',
        statistics: 'İstatistikler',
        panelHint: 'Aşağıdaki butona tıklayarak destek talebi oluşturabilirsiniz.'
    },

    defaults: {
        welcomeMessage: 'Merhaba! Destek ekibimiz en kısa sürede size yardımcı olacaktır.',
        supportDesc: 'Teknik destek',
        salesDesc: 'Satış ve fiyatlandırma',
        billingDesc: 'Fatura ve ödeme',
        otherDesc: 'Diğer konular'
    },

    aiPrompts: {
        ticketAnalysis: 'Sen bir destek ticket analiz asistanısın. Kullanıcının mesajını analiz et ve şu bilgileri JSON formatında döndür:\n- category: En uygun kategori ({categories})\n- priority: Öncelik seviyesi (low, medium, high, urgent)\n- sentiment: Duygu skoru (0-100, 0=çok negatif, 100=çok pozitif)\n- isUrgent: Acil müdahale gerekiyor mu (true/false)\n- suggestedResponse: Kullanıcıya verilebilecek ilk yanıt önerisi\n\nSadece JSON döndür, başka açıklama ekleme.',
        summarySystem: 'Sen bir destek ticket özet asistanısın. Verilen konuşmayı analiz et ve şu formatta özet çıkar:\n\n**Sorun:** [Kullanıcının karşılaştığı sorun]\n**Çözüm:** [Uygulanan çözüm veya sonuç]\n**Notlar:** [Önemli detaylar veya takip gerektiren konular]\n\nKısa ve öz ol.',
        ghostSystem: 'Sen deneyimli bir destek uzmanısın. Ticket geçmişini okuyarak yetkililere yardımcı oluyorsun.\nProfesyonel, nazik ve çözüm odaklı yanıtlar hazırla.\nYanıtın doğrudan kullanıcıya gönderilebilecek şekilde olsun.',
        ghostQuestion: 'Ticket Geçmişi:\n{context}\n\nYetkili Sorusu: {question}\n\nBu durumda kullanıcıya nasıl bir yanıt verilmeli?',
        autoResponseSystem: 'Sen yardımsever bir destek asistanısın. Kullanıcının sorusuna kısa ve öz bir şekilde yanıt ver.\n- Kullanıcıya yardımcı olmaya çalış\n- Eğer soruyu cevaplayamıyorsan, kullanıcıya bir yetkili yardım edeceğini söyle\n- Yanıtın maksimum 2-3 cümle olsun\n- Profesyonel ve nazik ol',
        knowledgeContext: 'Aşağıdaki sunucu bilgilerini kullanarak yanıt ver:\n{context}',
        contextualKnowledge: 'Sunucu bilgi tabanını kullanarak doğru bilgiler ver:\n{context}',
        previousConversation: 'Önceki konuşma:\n{context}\n\nKullanıcının son mesajı: {message}',
        routingSystem: 'Ticket içeriğini analiz et ve doğru departmana yönlendirme öner.\nMevcut kategori: {currentCategory}\nMevcut kategoriler: {categories}\n\nJSON formatında döndür:\n- shouldReroute: boolean\n- suggestedCategory: string\n- confidence: number (0-1)\n- reason: string',
        defaultResponse: 'Merhaba! Talebiniz alındı, en kısa sürede size yardımcı olacağız.',
        summaryFailed: 'Özet oluşturulamadı.',
        responseFailed: 'Yanıt oluşturulamadı. Lütfen tekrar deneyin.'
    }
};
