
import React from 'react';
import { Monster, Item, MapData, Section } from '../types';

interface DashboardProps {
  monsters: Monster[];
  items: Item[];
  maps: MapData[];
  setActive: (s: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ monsters, items, maps, setActive }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059] mb-2">Escudo do Mestre</h2>
          <p className="text-lg italic opacity-80">"As chamas da taverna iluminam os segredos de Drakon."</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Bestiário" count={monsters.length} icon="💀" onClick={() => setActive('monsters')} />
        <StatCard title="Tesouros" count={items.length} icon="💎" onClick={() => setActive('items')} />
        <StatCard title="Mapas Ativos" count={maps.length} icon="🗺️" onClick={() => setActive('maps')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="parchment p-6 rounded-md">
          <h3 className="medieval-font text-2xl mb-4 border-b-2 border-[#8b6b40] pb-2">Status da Sessão</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Clima em Cassiopéia:</span>
              <span className="font-bold text-red-900">Tempestuoso</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fase da Campanha:</span>
              <span className="font-bold text-red-900">Capítulo II</span>
            </div>
            <div className="mt-4">
              <p className="font-bold text-sm mb-1 uppercase tracking-wider">Anotações Rápidas:</p>
              <textarea 
                className="w-full bg-white/30 border border-[#8b6b40] p-2 rounded-sm h-32 focus:outline-none focus:ring-1 focus:ring-[#8b6b40] italic"
                placeholder="Ex: Jogadores encontraram o mercador ferido..."
              />
            </div>
          </div>
        </section>

        <section className="parchment p-6 rounded-md">
          <h3 className="medieval-font text-2xl mb-4 border-b-2 border-[#8b6b40] pb-2">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton label="Narrar Encontro" color="dark-red-bg" onClick={() => setActive('narrator')} />
            <QuickActionButton label="Consultar Combate" color="bg-[#3d2b1f]" onClick={() => setActive('rules')} />
            <QuickActionButton label="Gerar Loot" color="bg-[#3d2b1f]" onClick={() => setActive('items')} />
            <QuickActionButton label="Ver Mapa Global" color="bg-[#3d2b1f]" onClick={() => setActive('maps')} />
          </div>
          <div className="mt-6 p-4 bg-black/10 rounded border border-dashed border-[#8b6b40]">
             <p className="text-sm font-bold text-[#5a0a0a]">DICA DO MESTRE:</p>
             <p className="text-xs opacity-70">Em Mighty Blade, um sucesso crítico em ataque causa o dobro do dano total (some bônus antes de multiplicar).</p>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="wood-panel p-6 rounded-lg text-left transition-transform hover:scale-105 group border-2 border-transparent hover:border-[#c5a059]"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[#8b6b40] font-bold text-sm uppercase tracking-widest">{title}</p>
        <p className="text-4xl cinzel font-bold text-[#c5a059]">{count}</p>
      </div>
      <span className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>
    </div>
  </button>
);

const QuickActionButton = ({ label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 rounded-sm ${color} text-[#f4e4bc] medieval-font text-lg hover:brightness-125 transition-all shadow-md active:translate-y-1`}
  >
    {label}
  </button>
);

export default Dashboard;
