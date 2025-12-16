<div align="center">

# 🎫 Lora Ticket AI

### AI-Powered Discord Ticket System by Lora Technologies

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[![LORA TECH](https://img.shields.io/badge/Powered%20by-LORA%20TECHNOLOGIES-40E0D0?style=for-the-badge)](https://loratech.dev)
[![LORA API](https://img.shields.io/badge/Powered%20by-LORA%20API-FF6B6B?style=for-the-badge)](https://api.loratech.dev)

**[🇹🇷 Türkçe](#-türkçe) | [🇬🇧 English](#-english)**

---

# 🇹🇷 Türkçe

**LORA API** destekli, yapay zeka tabanlı gelişmiş Discord Ticket Botu

## ✨ Özellikler

### 🤖 Yapay Zeka Destekli
- **Akıllı Yönlendirme** - Ticket içeriğine göre otomatik kategorileme
- **Duygu Analizi** - Acil/sinirli kullanıcıları tespit eder ve önceliklendirir
- **Hayalet Asistan** - AI, yetkililere yanıt önerileri sunar (sadece yetkililer görür)
- **Otomatik Özet** - Ticket kapanışında AI özet oluşturur
- **Otomatik AI Yanıt** - Ticket üstlenilmeden kullanıcılara AI destek

### 📚 Akıllı Bilgi Tabanı
- **Otomatik İçerik Tarama** - Sunucu kanallarını otomatik indexler
- **Ürün/Hizmet Tanıma** - Fiyatları ve ürünleri otomatik tespit eder
- **SSS Çıkarımı** - Sık sorulan soruları otomatik kategorize eder
- **Bağlamsal Yanıtlar** - AI, sunucu bilgilerini kullanarak doğru cevaplar verir
- **Maliyet Optimize** - Yerel regex işleme, AI sadece gerektiğinde

### 🎫 Ticket Yönetimi
- Modal destekli modern buton tabanlı ticket oluşturma
- Öncelik seviyeleri (Düşük, Orta, Yüksek, Acil)
- Kategori bazlı organizasyon
- Kilitleme/Kilit açma özelliği
- Ticketa kullanıcı ekleme/çıkarma
- Şık HTML transcript'ler

### 📊 Loglama ve Analitik
- Detaylı ticket logları
- Duygu skoru takibi
- AI tarafından oluşturulan özetler
- HTML transcript oluşturma
- Bilgi tabanı istatistikleri

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ 
- MongoDB
- Discord Bot Token
- LORA API Key

### Kurulum

1. Repoyu klonlayın
```bash
git clone https://github.com/Lora-Technologies/lora-ticket-bot.git
cd lora-ticket-bot
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. Ortam değişkenlerini yapılandırın
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DISCORD_TOKEN=discord_bot_tokeniniz
DISCORD_CLIENT_ID=client_id_niz
MONGODB_URI=mongodb://localhost:27017/lora-tickets
LORA_API_KEY=lora_api_keyiniz
LORA_API_BASE_URL=https://api.loratech.dev/v1
LORA_MODEL=gemini-2.0-flash
```

4. Botu başlatın
```bash
npm start
```

## 📖 Komutlar

### Admin Komutları
| Komut | Açıklama |
|-------|----------|
| `/setup panel #kanal` | Ticket panelini oluştur |
| `/setup category #kategori` | Ticket kategorisini ayarla |
| `/setup logs #kanal` | Log kanalını ayarla |
| `/setup roles @destek @kıdemli` | Destek rollerini ayarla |
| `/setup language` | Bot dilini ayarla (TR/EN) |
| `/setup settings` | AI özelliklerini yapılandır |

### Ticket Komutları
| Komut | Açıklama |
|-------|----------|
| `/ticket close [sebep]` | Mevcut ticketı kapat |
| `/ticket add @kullanıcı` | Ticketa kullanıcı ekle |
| `/ticket remove @kullanıcı` | Tickettan kullanıcı çıkar |
| `/ticket rename [isim]` | Ticket kanalını yeniden adlandır |
| `/ticket priority [seviye]` | Ticket önceliğini değiştir |
| `/ticket info` | Ticket bilgilerini görüntüle |

### AI Komutları
| Komut | Açıklama |
|-------|----------|
| `/ask-ai [soru]` | AI asistandan yardım al (Hayalet Mod) |
| `/analyze` | Ticket içeriğini AI ile analiz et |

### Bilgi Tabanı Komutları
| Komut | Açıklama |
|-------|----------|
| `/knowledge setup` | Tüm sunucuyu otomatik tara ve indexle |
| `/knowledge scan #kanal` | Belirli bir kanalı tara |
| `/knowledge status` | Bilgi tabanı durumunu görüntüle |
| `/knowledge search [sorgu]` | Bilgi tabanında ara |
| `/knowledge clear` | Bilgi tabanını temizle |
| `/knowledge toggle` | Otomatik indexlemeyi aç/kapat |

### LORA API Komutları
| Komut | Açıklama |
|-------|----------|
| `/lora info` | LORA API hakkında bilgi |
| `/lora models` | Desteklenen AI modellerini listele |
| `/lora pricing` | Fiyatlandırma planlarını göster |

## 🔧 Yapılandırma

### Bot Ayarları
```javascript
{
  aiEnabled: true,         // AI özelliklerini etkinleştir
  autoRouting: true,       // Otomatik kategorileme
  sentimentAnalysis: true, // Duygu analizi
  transcriptEnabled: true, // Transcript kaydet
  dmOnClose: true,         // Kapanınca DM gönder
  knowledgeEnabled: true,  // Bilgi tabanı sistemi
  autoIndexing: true       // Otomatik içerik indexleme
}
```

### Kategoriler
Varsayılan kategoriler:
- 🛠️ **Support** - Teknik destek
- 💰 **Sales** - Satış ve fiyatlandırma
- 📄 **Billing** - Fatura ve ödeme
- 📋 **Other** - Diğer konular

---

# 🇬🇧 English

Advanced AI-Powered Discord Ticket Bot powered by **LORA API**

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Smart Routing** - Automatically categorizes tickets based on content
- **Sentiment Analysis** - Detects urgent/frustrated users and prioritizes accordingly
- **Ghost Assistant** - AI helps staff with response suggestions (only visible to staff)
- **Auto Summaries** - AI generates ticket summaries on closure
- **Auto AI Response** - AI support for users before ticket is claimed

### 📚 Smart Knowledge Base
- **Auto Content Scanning** - Automatically indexes server channels
- **Product/Service Detection** - Auto-detects prices and products
- **FAQ Extraction** - Automatically categorizes frequently asked questions
- **Contextual Responses** - AI uses server info to provide accurate answers
- **Cost Optimized** - Local regex processing, AI only when needed

### 🎫 Ticket Management
- Modern button-based ticket creation with modals
- Priority levels (Low, Medium, High, Urgent)
- Category-based organization
- Lock/Unlock functionality
- User add/remove from tickets
- Beautiful HTML transcripts

### 📊 Logging & Analytics
- Detailed ticket logs
- Sentiment scores tracking
- AI-generated summaries
- HTML transcript generation
- Knowledge base statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Discord Bot Token
- LORA API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/Lora-Technologies/lora-ticket-bot.git
cd lora-ticket-bot
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
MONGODB_URI=mongodb://localhost:27017/lora-tickets
LORA_API_KEY=your_lora_api_key
LORA_API_BASE_URL=https://api.loratech.dev/v1
LORA_MODEL=gemini-2.0-flash
```

4. Start the bot
```bash
npm start
```

## 📖 Commands

### Admin Commands
| Command | Description |
|---------|-------------|
| `/setup panel #channel` | Create ticket panel in channel |
| `/setup category #category` | Set ticket category |
| `/setup logs #channel` | Set log channel |
| `/setup roles @support @senior` | Set support roles |
| `/setup language` | Set bot language (TR/EN) |
| `/setup settings` | Configure AI features |

### Ticket Commands
| Command | Description |
|---------|-------------|
| `/ticket close [reason]` | Close current ticket |
| `/ticket add @user` | Add user to ticket |
| `/ticket remove @user` | Remove user from ticket |
| `/ticket rename [name]` | Rename ticket channel |
| `/ticket priority [level]` | Change ticket priority |
| `/ticket info` | View ticket information |

### AI Commands
| Command | Description |
|---------|-------------|
| `/ask-ai [question]` | Get AI assistance (Ghost Mode) |
| `/analyze` | Analyze ticket content with AI |

### Knowledge Base Commands
| Command | Description |
|---------|-------------|
| `/knowledge setup` | Auto-scan and index entire server |
| `/knowledge scan #channel` | Scan a specific channel |
| `/knowledge status` | View knowledge base status |
| `/knowledge search [query]` | Search the knowledge base |
| `/knowledge clear` | Clear the knowledge base |
| `/knowledge toggle` | Toggle auto-indexing on/off |

### LORA API Commands
| Command | Description |
|---------|-------------|
| `/lora info` | Information about LORA API |
| `/lora models` | List supported AI models |
| `/lora pricing` | Show pricing plans |

## 🔧 Configuration

### Bot Settings
```javascript
{
  aiEnabled: true,         // Enable/disable AI features
  autoRouting: true,       // Auto-categorize tickets
  sentimentAnalysis: true, // Detect user sentiment
  transcriptEnabled: true, // Save ticket transcripts
  dmOnClose: true,         // DM user when ticket closes
  knowledgeEnabled: true,  // Knowledge base system
  autoIndexing: true       // Auto content indexing
}
```

### Categories
Default categories:
- 🛠️ **Support** - Technical support
- 💰 **Sales** - Sales and pricing
- 📄 **Billing** - Invoices and payments
- 📋 **Other** - General inquiries

---

<div align="center">

## 🤖 LORA API Hakkında / About LORA API

</div>

Bu bot **[LORA API](https://loratech.dev)** ile güçlendirilmiştir. LORA API, tek bir API üzerinden birden fazla AI modeline erişim sağlar.

This bot is powered by **[LORA API](https://loratech.dev)**. LORA API provides access to multiple AI models through a single API.

<div align="center">

### Desteklenen Modeller / Supported Models

| Provider | Models |
|----------|--------|
| 🔵 **Google Gemini** | gemini-2.5-pro, gemini-2.5-flash |
| ⚡ **xAI Grok** | grok-4, grok-4-fast |
| 🟣 **Anthropic Claude** | claude-4.5-sonnet, claude-4.5-haiku |
| 🦙 **Meta Llama** | llama-4-maverick, llama-4-scout |
| 🌐 **OpenAI OSS** | gpt-oss-120b, gpt-oss-20b |
| 🔮 **Kimi K2** | kimi-k2 |

### Fiyatlandırma / Pricing

| Plan | Fiyat/Price | İstek/Requests |
|------|-------------|----------------|
| 🎓 Öğrenci/Student | $5/ay | 5,000/ay |
| 🚀 Başlangıç/Starter | $8/ay | 1,500/ay |
| 💼 Temel/Basic | $15/ay | 5,000/ay |
| 👑 Profesyonel/Pro | $40/ay | 15,000/ay |

[![Get LORA API](https://img.shields.io/badge/Get%20Your%20API%20Key-loratech.dev-FF6B6B?style=for-the-badge)](https://loratech.dev)

</div>

---

## 🏗️ Project Structure / Proje Yapısı

```
src/
├── config/          # Configuration / Yapılandırma
├── core/            # Bot client and loaders / Bot istemcisi ve yükleyiciler
├── commands/        # Slash commands / Slash komutları
│   ├── admin/       # Admin commands (setup, knowledge) / Admin komutları
│   ├── ticket/      # Ticket commands / Ticket komutları
│   ├── ai/          # AI commands / AI komutları
│   └── info/        # Info commands / Bilgi komutları
├── events/          # Discord events / Discord eventleri
├── models/          # MongoDB schemas / MongoDB şemaları
│   ├── Ticket.js    # Ticket model / Ticket modeli
│   ├── Guild.js     # Guild settings / Sunucu ayarları
│   ├── Transcript.js# Transcript model / Transcript modeli
│   └── ServerKnowledge.js # Knowledge base / Bilgi tabanı
├── services/        # Business logic / İş mantığı
│   ├── AIService.js # AI operations / AI işlemleri
│   ├── TicketService.js # Ticket operations / Ticket işlemleri
│   └── KnowledgeService.js # Knowledge indexing / Bilgi indexleme
├── locales/         # Language files (TR/EN) / Dil dosyaları
└── utils/           # Helper functions / Yardımcı fonksiyonlar
```

## 🤝 Contributing / Katkıda Bulunma

Contributions are welcome! Please feel free to submit a Pull Request.

Katkılarınızı bekliyoruz! Pull Request göndermekten çekinmeyin.

## 📄 License / Lisans

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<p align="center">
  <b>Powered by <a href="https://loratech.dev">Lora Tech</a></b>
</p>
