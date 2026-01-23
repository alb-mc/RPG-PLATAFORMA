
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, RulePDF } from "../types";

const SYSTEM_INSTRUCTION = `Você é um Narrador experiente do sistema de RPG Mighty Blade. 
Sua função é narrar cenas, interpretar NPCs, criar desafios e mediar as regras oficiais.

REGRAS CRÍTICAS:
1. Use APENAS as regras do sistema Mighty Blade (Atributos: Força, Agilidade, Inteligência, Vontade).
2. NUNCA invente regras fora do sistema. Se não souber, cite que verificará no PDF.
3. SEMPRE narre de forma imersiva (medieval/fantasia), descrevendo sons, cheiros e clima.
4. NUNCA quebre a imersão. Não diga "sou uma IA" ou "de acordo com o modelo".
5. O tom deve ser ajustável conforme o pedido do Mestre.
6. Use termos técnicos do sistema como "Teste de Atributo", "Dificuldade", "Ação Padrão", etc.

CONTEXTO DE REGRAS DISPONÍVEIS:
`;

export class NarratorService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private context: string = "";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  setRuleContext(pdfs: RulePDF[]) {
    this.context = pdfs.map(p => `PDF: ${p.name}\nCONTEÚDO:\n${p.content}`).join("\n\n---\n\n");
  }

  async startSession(tone: string = "épico") {
    const instruction = `${SYSTEM_INSTRUCTION}\nTom Narrativo Atual: ${tone}\n\nREGRAS INDEXADAS:\n${this.context}`;
    
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: instruction,
        temperature: 0.8,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) await this.startSession();
    const result = await this.chat!.sendMessage({ message });
    return result.text || "Ocorreu um erro na névoa da narrativa...";
  }

  async *sendMessageStream(message: string) {
    if (!this.chat) await this.startSession();
    const stream = await this.chat!.sendMessageStream({ message });
    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
}

export const narratorService = new NarratorService();
