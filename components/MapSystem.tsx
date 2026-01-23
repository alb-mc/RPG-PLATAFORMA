
import React, { useState } from 'react';
import { MapData, MapMarker } from '../types';

interface MapSystemProps {
  maps: MapData[];
  setMaps: React.Dispatch<React.SetStateAction<MapData[]>>;
}

const MapSystem: React.FC<MapSystemProps> = ({ maps, setMaps }) => {
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMap: MapData = {
          id: Math.random().toString(36).substr(2, 9),
          nome: file.name.replace('.jpg', '').replace('.png', ''),
          regiao: 'Desconhecida',
          imageUrl: event.target?.result as string,
          anotacoes: '',
          markers: []
        };
        setMaps(prev => [...prev, newMap]);
        setSelectedMap(newMap);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMarker = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedMap) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const label = prompt("Nome do Ponto de Interesse:");
    if (!label) return;

    const newMarker: MapMarker = {
      id: Date.now().toString(),
      x, y, label, descricao: ''
    };

    setMaps(prev => prev.map(m => 
      m.id === selectedMap.id 
        ? { ...m, markers: [...m.markers, newMarker] } 
        : m
    ));
    setSelectedMap(prev => prev ? { ...prev, markers: [...prev.markers, newMarker] } : null);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex justify-between items-center border-b-4 border-[#8b6b40] pb-4">
        <h2 className="cinzel text-4xl font-bold text-[#c5a059]">Atlas de Campanha</h2>
        <label className="bg-[#3d2b1f] border border-[#8b6b40] px-4 py-2 rounded text-sm text-[#d1b894] cursor-pointer hover:bg-[#8b6b40]/20 transition-all">
          + Adicionar Carta Náutica
          <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} />
        </label>
      </header>

      <div className="flex-1 flex overflow-hidden space-x-6">
        <aside className="w-64 space-y-4 overflow-y-auto custom-scrollbar">
           {maps.map(map => (
             <button
               key={map.id}
               onClick={() => setSelectedMap(map)}
               className={`w-full text-left p-4 rounded wood-panel group transition-all ${selectedMap?.id === map.id ? 'border-[#c5a059] ring-2 ring-[#c5a059]/20' : 'border-transparent'}`}
             >
                <div className="aspect-video bg-black/20 rounded overflow-hidden mb-2">
                  <img src={map.imageUrl} alt={map.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <p className="medieval-font text-lg leading-none">{map.nome}</p>
                <p className="text-xs opacity-50">{map.regiao}</p>
             </button>
           ))}
        </aside>

        <section className="flex-1 wood-panel rounded p-1 flex flex-col relative overflow-hidden">
           {selectedMap ? (
             <>
               <div 
                className="flex-1 bg-black/40 relative cursor-crosshair overflow-hidden group"
                onClick={addMarker}
               >
                 <img src={selectedMap.imageUrl} className="w-full h-full object-contain" />
                 {selectedMap.markers.map(marker => (
                   <div 
                    key={marker.id}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/marker"
                   >
                     <div className="w-6 h-6 dark-red-bg border-2 border-white rounded-full flex items-center justify-center animate-bounce shadow-xl">
                        <span className="text-[10px] text-white">📍</span>
                     </div>
                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                        {marker.label}
                     </div>
                   </div>
                 ))}
                 <div className="absolute bottom-4 left-4 parchment px-4 py-2 text-xs rounded shadow-lg pointer-events-none opacity-80">
                   Clique no mapa para marcar um ponto de interesse
                 </div>
               </div>
               <div className="p-4 bg-[#1a0f0a]/80 border-t border-[#8b6b40]">
                  <h3 className="cinzel text-xl text-[#c5a059]">{selectedMap.nome}</h3>
                  <p className="text-sm opacity-70 italic">{selectedMap.regiao} — {selectedMap.markers.length} locais conhecidos.</p>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="text-8xl opacity-10">🗺️</div>
                <p className="medieval-font text-2xl opacity-40">Selecione uma carta náutica à esquerda para começar a exploração.</p>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default MapSystem;
