import React, { useState } from 'react';
import type { Section } from '../types/types';

interface SidebarProps {
  active: Section;
  setActive: React.Dispatch<React.SetStateAction<Section>>;
}

interface MenuItem {
  id: Section;
  label: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Mesa do Mestre',
    icon: '♜',
  },
  {
    id: 'narrator',
    label: 'Narradora IA',
    icon: '□',
  },
  {
    id: 'rules',
    label: 'Regras (PDF)',
    icon: '📜',
  },
  {
    id: 'monsters',
    label: 'Bestiário',
    icon: '☠',
  },
  {
    id: 'items',
    label: 'Equipamentos',
    icon: '⚔',
  },
  {
    id: 'shops',
    label: 'Lojas & NPCs',
    icon: '🏚',
  },
  {
    id: 'maps',
    label: 'Atlas',
    icon: '🗺',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectSection = (section: Section) => {
    setActive(section);
    setIsMobileMenuOpen(false);
  };

  const renderMenuContent = () => {
    return (
      <>
        <div className="px-6 py-7 text-center">
          <h1 className="cinzel text-3xl font-bold tracking-[0.25em] text-[#c5a059]">
            MIGHTY
          </h1>

          <h2 className="cinzel mt-1 text-base font-bold tracking-[0.3em] text-[#c5a059]">
            BLADE
          </h2>
        </div>

        <div className="border-t border-[#8b6b40]" />

        <nav className="flex-1 space-y-2 px-3 py-6">
          {MENU_ITEMS.map((item) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSection(item.id)}
                className={[
                  'flex w-full items-center gap-3 rounded px-4 py-3 text-left transition-all',
                  isActive
                    ? 'bg-[#c5a059] text-[#1a0f0a]'
                    : 'text-[#d1b894] hover:bg-[#8b6b40]/20 hover:text-[#f4e4bc]',
                ].join(' ')}
              >
                <span className="w-6 text-center text-lg">
                  {item.icon}
                </span>

                <span className="medieval-font text-lg">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#8b6b40] px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-[#c5a059]">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>Sessão Ativa: O Despertar da Ruína</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-[#8b6b40] bg-[#1a0f0a]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded border border-[#8b6b40] bg-[#2d1b0f] px-3 py-2 text-[#d1b894] shadow hover:bg-[#8b6b40]/20"
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <div className="text-center">
          <p className="cinzel text-sm font-bold tracking-[0.2em] text-[#c5a059]">
            MIGHTY BLADE
          </p>

          <p className="text-xs text-[#d1b894]/70">
            Mesa do Mestre
          </p>
        </div>

        <div className="w-[42px]" />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <aside className="wood-panel relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r-4 border-[#2d1b0f]">
            <div className="flex items-center justify-between border-b border-[#8b6b40] px-4 py-3">
              <span className="medieval-font text-lg text-[#c5a059]">
                Menu
              </span>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded border border-[#8b6b40] px-3 py-1 text-[#d1b894] hover:bg-[#8b6b40]/20"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>

            {renderMenuContent()}
          </aside>
        </div>
      )}

      <aside className="wood-panel hidden h-screen w-64 shrink-0 flex-col border-r-4 border-[#2d1b0f] lg:flex">
        {renderMenuContent()}
      </aside>
    </>
  );
};

export default Sidebar;