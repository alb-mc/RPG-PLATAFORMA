import type { RulePDF } from '../types/types';

class NarratorService {
  private rulesContext = '';

  setRuleContext(pdfs: RulePDF[]) {
    this.rulesContext = pdfs
      .map((pdf) => {
        return `Arquivo: ${pdf.name}\nConteúdo:\n${pdf.content}`;
      })
      .join('\n\n---\n\n');
  }

  async startSession(_tone: string = 'épico'): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(message: string): Promise<string> {
    return this.generateLocalResponse(message);
  }

  async *sendMessageStream(message: string): AsyncGenerator<string> {
    const response = this.generateLocalResponse(message);
    const words = response.split(' ');

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 25));
      yield `${word} `;
    }
  }

  private generateLocalResponse(message: string): string {
    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      return 'Digite uma descrição da cena, dúvida de regra ou situação da aventura.';
    }

    const hasRulesContext = this.rulesContext.trim().length > 0;

    if (!hasRulesContext) {
      return [
        'Modo narrador local ativo.',
        'Ainda não há PDFs ou regras carregadas para consulta.',
        'Por enquanto, posso servir como apoio básico para organizar cenas, NPCs, combates e ideias de narração.',
      ].join(' ');
    }

    return [
      'Modo narrador local ativo.',
      `Você perguntou: "${normalizedMessage}".`,
      'Já existem regras carregadas no contexto, mas a consulta inteligente ainda será implementada em uma próxima etapa.',
      'Por enquanto, esta resposta confirma que o fluxo do chat está funcionando sem depender do Gemini.',
    ].join(' ');
  }
}

export const narratorService = new NarratorService();