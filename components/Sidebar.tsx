
import React from 'react';
import { Section } from '../types';
import { 
  TavernIcon, 
  ScrollIcon, 
  SkullIcon, 
  SwordIcon, 
  StoreIcon, 
  MapIcon, 
  ChatIcon 
} from './Icons';

interface SidebarProps {
  active: Section;
  setActive: (s: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const menuItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Mesa do Mestre', icon: <TavernIcon /> },
    { id: 'narrator', label: 'Narradora IA', icon: <ChatIcon /> },
    { id: 'rules', label: 'Regras (PDF)', icon: <ScrollIcon /> },
    { id: 'monsters', label: 'Bestiário', icon: <SkullIcon /> },
    { id: 'items', label: 'Equipamentos', icon: <SwordIcon /> },
    { id: 'shops', label: 'Lojas & NPCs', icon: <StoreIcon /> },
    { id: 'maps', label: 'Atlas', icon: <MapIcon /> },
  ];

  return (
    <aside className="w-64 wood-panel h-full flex flex-col border-r-4 border-[#2d1b0f] z-20">
      <div className="p-6 border-b-2 border-[#8b6b40] bg-[#2d1b0f]/50">
        <h1 className="cinzel text-2xl font-bold text-center text-[#c5a059] tracking-widest leading-none">
          MIGHTY<br/><span className="text-sm">BLADE</span>
        </h1>
      </div>
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group rounded-sm
              ${active === item.id 
                ? 'bg-[#c5a059] text-[#2d1b0f] shadow-lg shadow-black/20' 
                : 'text-[#d1b894] hover:bg-[#8b6b40]/20 hover:text-[#c5a059]'}`}
          >
            <span className={`mr-3 ${active === item.id ? 'text-[#2d1b0f]' : 'text-[#8b6b40] group-hover:text-[#c5a059]'}`}>
              {item.icon}
            </span>
            <span className="medieval-font tracking-wide text-base">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 bg-[#2d1b0f]/30 border-t-2 border-[#8b6b40]">
        <div className="flex items-center space-x-2 text-xs text-[#8b6b40]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Sessão Ativa: O Despertar da Runa</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
