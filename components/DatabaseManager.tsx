
import React, { useState } from 'react';
import { Monster, Item, Shop, AttributeStats } from '../types';

interface DatabaseProps {
  type: 'monsters' | 'items' | 'shops';
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  items?: Item[]; // Required for shop stock management
}

const DatabaseManager: React.FC<DatabaseProps> = ({ type, data, setData, items }) => {
  const [isAdding, setIsAdding] = useState(false);

  const getTitle = () => {
    switch(type) {
      case 'monsters': return 'Grimório de Criaturas';
      case 'items': return 'Arsenal & Relíquias';
      case 'shops': return 'Comércio & Tavernas';
    }
  };

  const deleteItem = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="animate-fadeIn">
       <header className="flex justify-between items-end border-b-4 border-[#8b6b40] pb-4 mb-8">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059]">{getTitle()}</h2>
          <p className="opacity-70 italic">Gerencie os recursos que dão vida à sua campanha.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="dark-red-bg px-6 py-3 rounded shadow-lg border border-[#c5a059] medieval-font text-lg text-[#f4e4bc] hover:scale-105 transition-all"
        >
          {type === 'monsters' ? '+ Criar Monstro' : type === 'items' ? '+ Novo Item' : '+ Abrir Loja'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full parchment p-12 text-center rounded-lg opacity-40">
            <p className="medieval-font text-2xl">A base de dados está silenciosa...</p>
          </div>
        ) : (
          data.map(entry => (
            <DataCard key={entry.id} entry={entry} type={type} onDelete={() => deleteItem(entry.id)} />
          ))
        )}
      </div>

      {isAdding && (
        <Modal onClose={() => setIsAdding(false)}>
          <div className="parchment p-8 rounded shadow-2xl max-w-2xl w-full">
            <h3 className="cinzel text-3xl font-bold mb-6 border-b-2 border-[#8b6b40] text-red-900">
              {type === 'monsters' ? 'Nova Criatura de Drakon' : 'Novo Recurso'}
            </h3>
            <p className="mb-4 opacity-70 italic">Preencha os campos com sabedoria, Mestre.</p>
            {/* Form simulation - in a real app would be dynamic per type */}
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold uppercase mb-1">Nome:</label>
                  <input className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded focus:outline-none" />
               </div>
               {type === 'monsters' && (
                 <div className="grid grid-cols-4 gap-4">
                    {['FOR', 'AGI', 'INT', 'VON'].map(attr => (
                      <div key={attr}>
                        <label className="block text-xs font-bold mb-1">{attr}:</label>
                        <input type="number" defaultValue={3} className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded text-center" />
                      </div>
                    ))}
                 </div>
               )}
               <div>
                  <label className="block text-sm font-bold uppercase mb-1">Descrição:</label>
                  <textarea className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded h-24 focus:outline-none" />
               </div>
               <div className="flex justify-end space-x-3 pt-6">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 opacity-50 hover:opacity-100">Cancelar</button>
                  <button className="dark-red-bg text-[#f4e4bc] px-6 py-2 rounded medieval-font text-lg" onClick={() => setIsAdding(false)}>Confirmar</button>
               </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const DataCard = ({ entry, type, onDelete }: any) => (
  <div className="parchment p-5 rounded relative group border-2 border-transparent hover:border-[#8b6b40] transition-all overflow-hidden">
    <button 
      onClick={onDelete}
      className="absolute top-2 right-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-900/10 rounded"
    >
      🗑️
    </button>
    <div className="flex items-center space-x-3 mb-3 border-b border-[#8b6b40]/30 pb-2">
      <span className="text-3xl">{type === 'monsters' ? '🐲' : type === 'items' ? '⚔️' : '🏪'}</span>
      <h4 className="medieval-font text-xl font-bold truncate pr-6">{entry.nome || 'Sem Nome'}</h4>
    </div>
    
    <div className="text-sm space-y-2 opacity-90">
      <p className="italic line-clamp-2">"{entry.descricao || 'Nenhuma descrição narrativa fornecida.'}"</p>
      
      {type === 'monsters' && (
        <div className="bg-black/10 p-2 rounded grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
          <span>FOR: {entry.stats?.forca || 3}</span>
          <span>AGI: {entry.stats?.agilidade || 3}</span>
          <span>INT: {entry.stats?.inteligencia || 3}</span>
          <span>VON: {entry.stats?.vontade || 3}</span>
          <span className="col-span-2 text-red-900 font-bold mt-1">Nível: {entry.nivel || 1}</span>
        </div>
      )}

      {type === 'items' && (
        <div className="flex justify-between items-center text-xs">
          <span className="bg-[#8b6b40] text-white px-2 py-0.5 rounded capitalize">{entry.raridade}</span>
          <span className="font-bold text-yellow-900">{entry.preco} Moedas</span>
        </div>
      )}

      {type === 'shops' && (
        <div className="text-xs space-y-1">
          <p><strong>Dono:</strong> {entry.npcDono || 'Desconhecido'}</p>
          <p><strong>Lugar:</strong> {entry.localizacao || 'Drakon'}</p>
        </div>
      )}
    </div>
  </div>
);

const Modal = ({ children, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
    {children}
  </div>
);

export default DatabaseManager;
