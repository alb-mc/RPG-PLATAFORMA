import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Sidebar from '../components/Sidebar';
import Dashboard from '../components/pages/Dashboard';
import NarratorChat from '../components/pages/NarratorChat';
import RulesBrowser from '../components/pages/RulesBrowser';
import DatabaseManager from '../components/pages/DatabaseManager';
import MapSystem from '../components/pages/MapSystem';
import PlayerSheets, {
  DEFAULT_PLAYER_SHEETS,
  type PlayerSheet,
} from '../components/pages/PlayerSheets';

import { supabase } from '../services/supabaseClient';
import {
  listRpgRecords,
  replaceRpgCollection,
  type RpgCollection,
} from '../services/rpgRecordsService';

import type {
  Item,
  MapData,
  Monster,
  RulePDF,
  Section,
  Shop,
} from '../types/types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [players, setPlayers] = useState<PlayerSheet[]>(DEFAULT_PLAYER_SHEETS);

  const [maps, setMaps] = useState<MapData[]>([]);
  const [pdfs, setPdfs] = useState<RulePDF[]>([]);
  const [narrativeTone, setNarrativeTone] = useState<string>('épico');

  const [isLoadingRpgRecords, setIsLoadingRpgRecords] = useState(true);

  const loadRpgRecordsFromSupabase = useCallback(async () => {
    setIsLoadingRpgRecords(true);

    try {
      const [
        supabaseMonsters,
        supabaseItems,
        supabaseShops,
        supabasePlayers,
      ] = await Promise.all([
        listRpgRecords<Monster>('monsters'),
        listRpgRecords<Item>('items'),
        listRpgRecords<Shop>('shops'),
        listRpgRecords<PlayerSheet>('players'),
      ]);

      console.log('Dados carregados do Supabase', {
        monsters: supabaseMonsters,
        items: supabaseItems,
        shops: supabaseShops,
        players: supabasePlayers,
      });

      setMonsters(supabaseMonsters);
      setItems(supabaseItems);
      setShops(supabaseShops);

      if (supabasePlayers.length > 0) {
        setPlayers(supabasePlayers);
      } else {
        setPlayers(DEFAULT_PLAYER_SHEETS);
      }
    } catch (error) {
      console.error('Erro ao carregar registros do Supabase:', error);

      window.alert(
        'Não foi possível carregar dados do Supabase. Verifique conexão, políticas RLS e autenticação.',
      );
    } finally {
      setIsLoadingRpgRecords(false);
    }
  }, []);

  useEffect(() => {
    const savedMaps = localStorage.getItem('mb_maps');

    if (savedMaps) {
      setMaps(JSON.parse(savedMaps));
    }

    loadRpgRecordsFromSupabase();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadRpgRecordsFromSupabase();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadRpgRecordsFromSupabase]);

  useEffect(() => {
    localStorage.setItem('mb_maps', JSON.stringify(maps));
  }, [maps]);

  const saveCollectionToSupabase = useCallback(
    async <T extends { id: string }>(
      collection: RpgCollection,
      data: T[],
    ) => {
      try {
        await replaceRpgCollection(collection, data);
        console.log('Coleção salva no Supabase:', collection, data);
      } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);

        const readableError =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao salvar no Supabase.';

        const alertMessage =
          readableError === 'Entre no modo mestre para salvar no Supabase.'
            ? readableError
            : `Não foi possível salvar no Supabase: ${readableError}`;

        window.alert(alertMessage);
        throw error;
      }
    },
    [],
  );

  function createSyncedSetter<T extends { id: string }>(
    collection: RpgCollection,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
  ): React.Dispatch<React.SetStateAction<T[]>> {
    return (action) => {
      setState((previousValue) => {
        const nextValue =
          typeof action === 'function'
            ? (action as (previousState: T[]) => T[])(previousValue)
            : action;

        void saveCollectionToSupabase(collection, nextValue);

        return nextValue;
      });
    };
  }

  const syncedSetMonsters = useMemo(
    () =>
      createSyncedSetter<Monster>(
        'monsters',
        setMonsters,
      ),
    [saveCollectionToSupabase],
  );

  const syncedSetItems = useMemo(
    () =>
      createSyncedSetter<Item>(
        'items',
        setItems,
      ),
    [saveCollectionToSupabase],
  );

  const syncedSetShops = useMemo(
    () =>
      createSyncedSetter<Shop>(
        'shops',
        setShops,
      ),
    [saveCollectionToSupabase],
  );

  const syncedSetPlayers = useMemo(
    () =>
      createSyncedSetter<PlayerSheet>(
        'players',
        setPlayers,
      ),
    [saveCollectionToSupabase],
  );

  const renderLoadingState = () => {
    return (
      <div className="animate-fadeIn">
        <div className="parchment rounded p-8 text-center">
          <p className="medieval-font text-2xl text-red-900">
            Carregando registros da campanha...
          </p>

          <p className="mt-2 text-sm opacity-70">
            Buscando monstros, equipamentos, NPCs e jogadores no Supabase.
          </p>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <Dashboard
        monsters={monsters}
        items={items}
        maps={maps}
        playersCount={players.length}
        setActive={setActiveSection}
      />
    );
  };

  const renderSection = () => {
    if (isLoadingRpgRecords) {
      return renderLoadingState();
    }

    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();

      case 'narrator':
        return (
          <NarratorChat
            pdfs={pdfs}
            tone={narrativeTone}
            setTone={setNarrativeTone}
          />
        );

      case 'rules':
        return <RulesBrowser pdfs={pdfs} setPdfs={setPdfs} />;

      case 'monsters':
        return (
          <DatabaseManager
            type="monsters"
            data={monsters}
            setData={syncedSetMonsters}
          />
        );

      case 'items':
        return (
          <DatabaseManager
            type="items"
            data={items}
            setData={syncedSetItems}
          />
        );

      case 'shops':
        return (
          <DatabaseManager
            type="shops"
            data={shops}
            setData={syncedSetShops}
          />
        );

      case 'players':
        return (
          <PlayerSheets
            players={players}
            setPlayers={syncedSetPlayers}
          />
        );

      case 'maps':
        return <MapSystem maps={maps} setMaps={setMaps} />;

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-[#d1b894]">
      <div className="flex min-h-screen">
        <Sidebar active={activeSection} setActive={setActiveSection} />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App;