import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Language } from './language.service';

export type DepthLevel = 'Kids' | 'Teens' | 'Novice' | 'College' | 'Expert';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateExplanationStream(topic: string, level: DepthLevel, language: Language): Promise<AsyncIterable<string>> {
    const prompt = this.constructPrompt(topic, level, language);
    
    try {
      const response = await this.ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      return this.transformStream(response);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  private async *transformStream(response: any): AsyncIterable<string> {
    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }

  private constructPrompt(topic: string, level: DepthLevel, language: Language): string {
    const langNames: Record<Language, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ja: 'Japanese',
      zh: 'Chinese (Simplified)'
    };
    
    const targetLangName = langNames[language];
    const basePrompt = `Explain the topic: "${topic}".`;
    
    let styleGuide = '';
    switch (level) {
      case 'Kids':
        styleGuide = 'Explain like I am 5 years old. Use simple words, fun analogies, and keeps paragraphs very short.';
        break;
      case 'Teens':
        styleGuide = 'Explain to a teenager. Use a friendly tone, relatable examples, and break complex ideas into bullet points.';
        break;
      case 'Novice':
        styleGuide = 'Explain to a beginner. Provide clear definitions and step-by-step logic. Use distinct paragraphs for each key concept.';
        break;
      case 'College':
        styleGuide = 'Explain to a college student. Use proper terminology and academic structure. Organize with clear sections.';
        break;
      case 'Expert':
        styleGuide = 'Explain to an expert. Be precise and concise. Skip basics. Focus on nuance and advanced concepts.';
        break;
    }

    return `${basePrompt}\n\nTarget Audience: ${level}\nLanguage: ${targetLangName}\nInstructions: ${styleGuide}\n\nIMPORTANT FORMATTING RULES:\n1. Use Markdown.\n2. Use **Bold** for key terms.\n3. Use short paragraphs (max 3-4 sentences).\n4. Use bullet points for lists.\n5. Do NOT use # headers for the main title.\n6. Write the ENTIRE response in ${targetLangName}.`;
  }
}