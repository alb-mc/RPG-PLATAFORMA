
import React, { useState, useEffect } from 'react';
import { Section, Monster, Item, Shop, MapData, RulePDF } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NarratorChat from './components/NarratorChat';
import RulesBrowser from './components/RulesBrowser';
import DatabaseManager from './components/DatabaseManager';
import MapSystem from './components/MapSystem';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [maps, setMaps] = useState<MapData[]>([]);
  const [pdfs, setPdfs] = useState<RulePDF[]>([]);
  const [narrativeTone, setNarrativeTone] = useState('épico');

  // Persistence
  useEffect(() => {
    const savedMonsters = localStorage.getItem('mb_monsters');
    const savedItems = localStorage.getItem('mb_items');
    const savedShops = localStorage.getItem('mb_shops');
    const savedMaps = localStorage.getItem('mb_maps');
    
    if (savedMonsters) setMonsters(JSON.parse(savedMonsters));
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedShops) setShops(JSON.parse(savedShops));
    if (savedMaps) setMaps(JSON.parse(savedMaps));
  }, []);

  useEffect(() => {
    localStorage.setItem('mb_monsters', JSON.stringify(monsters));
    localStorage.setItem('mb_items', JSON.stringify(items));
    localStorage.setItem('mb_shops', JSON.stringify(shops));
    localStorage.setItem('mb_maps', JSON.stringify(maps));
  }, [monsters, items, shops, maps]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard monsters={monsters} items={items} maps={maps} setActive={setActiveSection} />;
      case 'narrator': return <NarratorChat pdfs={pdfs} tone={narrativeTone} setTone={setNarrativeTone} />;
      case 'rules': return <RulesBrowser pdfs={pdfs} setPdfs={setPdfs} />;
      case 'monsters': return <DatabaseManager type="monsters" data={monsters} setData={setMonsters} />;
      case 'items': return <DatabaseManager type="items" data={items} setData={setItems} />;
      case 'shops': return <DatabaseManager type="shops" data={shops} setData={setShops} items={items} />;
      case 'maps': return <MapSystem maps={maps} setMaps={setMaps} />;
      default: return <Dashboard monsters={monsters} items={items} maps={maps} setActive={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#1a0f0a] overflow-hidden text-[#d1b894]">
      <Sidebar active={activeSection} setActive={setActiveSection} />
      <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div className="p-8 min-h-full">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;
