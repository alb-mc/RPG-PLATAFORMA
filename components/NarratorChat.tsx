
import React, { useState, useRef, useEffect } from 'react';
import { narratorService } from '../services/geminiService';
import { RulePDF, ChatMessage } from '../types';

interface NarratorChatProps {
  pdfs: RulePDF[];
  tone: string;
  setTone: (t: string) => void;
}

const NarratorChat: React.FC<NarratorChatProps> = ({ pdfs, tone, setTone }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    narratorService.setRuleContext(pdfs);
  }, [pdfs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let fullResponse = "";
      const stream = narratorService.sendMessageStream(input);
      
      const aiMsgId = Date.now();
      setMessages(prev => [...prev, { role: 'model', text: "", timestamp: aiMsgId }]);

      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setMessages(prev => 
            prev.map(m => m.timestamp === aiMsgId ? { ...m, text: fullResponse } : m)
          );
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "A névoa se tornou espessa demais... tente invocar novamente.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto wood-panel rounded-lg overflow-hidden border-4 border-[#2d1b0f]">
      <div className="bg-[#2d1b0f] p-4 border-b-2 border-[#8b6b40] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full dark-red-bg border-2 border-[#c5a059] flex items-center justify-center">
            <span className="text-xl">📜</span>
          </div>
          <h3 className="medieval-font text-xl text-[#c5a059]">Narradora da Taverna</h3>
        </div>
        <select 
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="bg-[#1a0f0a] border border-[#8b6b40] text-[#d1b894] px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
        >
          <option value="épico">Narrativa Épica</option>
          <option value="sombrio">Narrativa Sombria</option>
          <option value="leve">Narrativa Leve</option>
          <option value="realista">Narrativa Realista</option>
        </select>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/p6.png')] bg-white/5"
      >
        {messages.length === 0 && (
          <div className="text-center mt-20 opacity-50 space-y-4">
            <p className="text-2xl medieval-font">"O pergaminho está em branco. Qual história deseja contar?"</p>
            <p className="text-sm italic italic">Comece descrevendo a situação atual ou peça para interpretar um NPC.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-md shadow-lg ${
              msg.role === 'user' 
                ? 'bg-[#c5a059] text-[#2d1b0f] rounded-tr-none' 
                : 'parchment rounded-tl-none border-l-4 border-red-900'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="parchment p-3 rounded-md animate-pulse">
              Desenhando runas...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#2d1b0f] border-t-2 border-[#8b6b40] flex space-x-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Comande a narrativa... (Ex: 'Descreva a taverna do Bico de Ouro')"
          className="flex-1 bg-[#1a0f0a] border border-[#8b6b40] px-4 py-3 rounded-sm text-[#d1b894] placeholder-[#8b6b40] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="dark-red-bg px-6 py-2 rounded-sm medieval-font text-xl text-[#f4e4bc] hover:brightness-125 transition-all shadow-md border border-[#c5a059]"
        >
          Narrar
        </button>
      </div>
    </div>
  );
};

export default NarratorChat;
