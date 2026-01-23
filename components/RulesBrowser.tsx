
import React, { useState } from 'react';
import { RulePDF } from '../types';

interface RulesBrowserProps {
  pdfs: RulePDF[];
  setPdfs: React.Dispatch<React.SetStateAction<RulePDF[]>>;
}

const RulesBrowser: React.FC<RulesBrowserProps> = ({ pdfs, setPdfs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we'd use PDF.js to extract text. 
      // For this demo, we simulate extraction.
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPdf: RulePDF = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: `Simulated content for ${file.name}. Inclui regras de Mighty Blade como testes de Atributos, Combate, Habilidades de classe (Guerreiro, Ladino, Sacerdote, etc).`,
          fileUrl: event.target?.result as string
        };
        setPdfs(prev => [...prev, newPdf]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end border-b-4 border-[#8b6b40] pb-4">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059]">Biblioteca de Regras</h2>
          <p className="opacity-70 italic">"Conhecimento é a arma mais afiada do herói."</p>
        </div>
        <label className="dark-red-bg px-6 py-3 cursor-pointer rounded shadow-lg border border-[#c5a059] medieval-font text-lg text-[#f4e4bc] hover:scale-105 transition-all">
          <span>Encadernar Novo PDF</span>
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <div className="wood-panel p-4 rounded">
            <h4 className="medieval-font text-lg text-[#c5a059] mb-3">Documentos Ativos</h4>
            {pdfs.length === 0 ? (
              <p className="text-sm opacity-50 italic">Nenhum livro encadernado ainda.</p>
            ) : (
              <ul className="space-y-2">
                {pdfs.map(pdf => (
                  <li key={pdf.id} className="text-sm flex items-center justify-between group">
                    <span className="truncate flex-1">📖 {pdf.name}</span>
                    <button 
                      onClick={() => setPdfs(prev => prev.filter(p => p.id !== pdf.id))}
                      className="text-red-500 opacity-0 group-hover:opacity-100 px-2"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="wood-panel p-4 rounded">
             <h4 className="medieval-font text-lg text-[#c5a059] mb-3">Tópicos Sugeridos</h4>
             <div className="flex flex-wrap gap-2 text-xs">
                {['Combate', 'Magia', 'Testes', 'Classes', 'Dano', 'Equipamento'].map(t => (
                  <span key={t} className="bg-[#1a0f0a] px-2 py-1 rounded border border-[#8b6b40] cursor-pointer hover:bg-[#8b6b40]/20">{t}</span>
                ))}
             </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-6 relative">
            <input 
              type="text"
              placeholder="Pesquisar regra ou termo mágico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2d1b0f] border-2 border-[#8b6b40] p-4 rounded text-xl text-[#d1b894] placeholder-[#8b6b40] focus:outline-none focus:border-[#c5a059]"
            />
            <span className="absolute right-4 top-4 text-2xl opacity-40">🔍</span>
          </div>

          <div className="parchment min-h-[400px] p-8 rounded-lg">
             {pdfs.length === 0 ? (
               <div className="flex flex-col items-center justify-center mt-20 opacity-30">
                  <span className="text-8xl mb-4">📚</span>
                  <p className="medieval-font text-2xl">A biblioteca está vazia</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <h3 className="medieval-font text-3xl text-red-900 border-b-2 border-[#8b6b40] pb-2">Resultados da Pesquisa</h3>
                 <p className="italic opacity-80">Mostrando resultados para: {searchTerm || 'Geral'}</p>
                 
                 <div className="space-y-4">
                    <RuleResult 
                      title="Testes de Atributos" 
                      content="Para realizar qualquer teste, você irá rolar um número variável de d6 (geralmente 2) e somar o Atributo do seu personagem que for mais relevante para o teste. O resultado dessa rolagem será comparado com uma dificuldade..."
                      source="Mighty Blade 3ª Edição - Pag 21"
                    />
                    <RuleResult 
                      title="Dano e Pontos de Vida" 
                      content="Um personagem de nível 1 geralmente tem 60 pontos iniciais de Vida. Quando o personagem sofre dano por um ataque, como um golpe de espada ou bola de fogo, ele subtrai o valor do dano de seus PVs atuais..."
                      source="Mighty Blade 3ª Edição - Pag 18"
                    />
                 </div>
               </div>
             )}
          </div>
        </section>
      </div>
    </div>
  );
};

const RuleResult = ({ title, content, source }: any) => (
  <div className="bg-black/5 p-4 rounded border-l-4 border-[#8b6b40] hover:bg-black/10 transition-colors cursor-pointer">
    <h4 className="font-bold text-xl mb-2 text-[#5a0a0a]">{title}</h4>
    <p className="text-sm line-clamp-3 mb-2">{content}</p>
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold uppercase tracking-widest text-[#8b6b40]">{source}</span>
      <button className="text-[#8b6b40] text-xs hover:text-[#c5a059] underline">Ver trecho completo</button>
    </div>
  </div>
);

export default RulesBrowser;
