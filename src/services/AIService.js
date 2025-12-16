import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';
import { getLocale, t } from '../locales/index.js';

const AI_TIMEOUT = 30000;
const MAX_RETRIES = 2;

class AIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.lora.apiKey,
            baseURL: config.lora.baseUrl,
            timeout: AI_TIMEOUT,
            maxRetries: MAX_RETRIES
        });
        this.model = config.lora.model;
    }

    async analyzeTicket(message, categories, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const prompt = t(locale, 'aiPrompts.ticketAnalysis', { categories: categories.join(', ') });
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: prompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('Empty AI response');
            const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            logger.error(`AI analysis failed: ${error.message}`);
            return {
                category: 'support',
                priority: 'medium',
                sentiment: 50,
                isUrgent: false,
                suggestedResponse: t(locale, 'aiPrompts.defaultResponse')
            };
        }
    }

    async generateSummary(messages, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const conversation = messages.map(m => `${m.authorName}: ${m.content}`).join('\n');
            
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: t(locale, 'aiPrompts.summarySystem')
                    },
                    {
                        role: 'user',
                        content: conversation
                    }
                ],
                temperature: 0.3,
                max_tokens: 300
            });

            return response.choices[0].message.content;
        } catch (error) {
            logger.error(`Summary generation failed: ${error.message}`);
            return t(locale, 'aiPrompts.summaryFailed');
        }
    }

    async getGhostResponse(messages, question, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const context = messages.slice(-20).map(m => `${m.authorName}: ${m.content}`).join('\n');
            
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: t(locale, 'aiPrompts.ghostSystem')
                    },
                    {
                        role: 'user',
                        content: t(locale, 'aiPrompts.ghostQuestion', { context, question })
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            logger.error(`Ghost response failed: ${error.message}`);
            return t(locale, 'aiPrompts.responseFailed');
        }
    }

    async getAutoResponse(messages, currentMessage, knowledgeContext = null, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const conversationContext = messages.slice(-10).map(m => `${m.authorName}: ${m.content}`).join('\n');
            
            let systemPrompt = t(locale, 'aiPrompts.autoResponseSystem');
            
            if (knowledgeContext) {
                systemPrompt += `\n\n${t(locale, 'aiPrompts.knowledgeContext', { context: knowledgeContext })}`;
            }
            
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: t(locale, 'aiPrompts.previousConversation', { context: conversationContext, message: currentMessage })
                    }
                ],
                temperature: 0.7,
                max_tokens: 250
            });

            return response.choices[0].message.content;
        } catch (error) {
            logger.error(`Auto response failed: ${error.message}`);
            return null;
        }
    }

    async getContextualResponse(messages, question, knowledgeContext = null, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const context = messages.slice(-20).map(m => `${m.authorName}: ${m.content}`).join('\n');
            
            let systemPrompt = t(locale, 'aiPrompts.ghostSystem');
            
            if (knowledgeContext) {
                systemPrompt += `\n\n${t(locale, 'aiPrompts.contextualKnowledge', { context: knowledgeContext })}`;
            }
            
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: t(locale, 'aiPrompts.ghostQuestion', { context, question })
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            logger.error(`Contextual response failed: ${error.message}`);
            return t(locale, 'aiPrompts.responseFailed');
        }
    }

    async suggestRouting(message, currentCategory, availableCategories, lang = 'tr') {
        const locale = getLocale(lang);
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: t(locale, 'aiPrompts.routingSystem', { 
                            currentCategory, 
                            categories: availableCategories.join(', ') 
                        })
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.2,
                max_tokens: 200
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('Empty AI response');
            const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            logger.error(`Routing suggestion failed: ${error.message}`);
            return { shouldReroute: false };
        }
    }
}

export const aiService = new AIService();
