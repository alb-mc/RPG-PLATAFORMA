import React, { FormEvent, useEffect, useState } from 'react';

import { getCurrentAuthUser, signInMaster, signOutMaster } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';
import { Monster, Item, MapData, Section } from '../../types/types';

type DiceType = '1d6' | '1d20';

interface SessionStatus {
  weather: string;
  campaignPhase: string;
  notes: string;
}

const SESSION_STATUS_STORAGE_KEY = 'mb_session_status';

const DEFAULT_SESSION_STATUS: SessionStatus = {
  weather: 'Tempestuoso',
  campaignPhase: 'Capítulo II',
  notes: 'Ex: Jogadores encontraram o mercador ferido...',
};

function loadSessionStatus(): SessionStatus {
  if (typeof window === 'undefined') {
    return DEFAULT_SESSION_STATUS;
  }

  const savedStatus = window.localStorage.getItem(SESSION_STATUS_STORAGE_KEY);

  if (!savedStatus) {
    return DEFAULT_SESSION_STATUS;
  }

  try {
    const parsedStatus = JSON.parse(savedStatus) as Partial<SessionStatus>;

    return {
      weather: parsedStatus.weather?.trim() || DEFAULT_SESSION_STATUS.weather,
      campaignPhase:
        parsedStatus.campaignPhase?.trim() || DEFAULT_SESSION_STATUS.campaignPhase,
      notes: parsedStatus.notes?.trim() || DEFAULT_SESSION_STATUS.notes,
    };
  } catch {
    return DEFAULT_SESSION_STATUS;
  }
}

interface DashboardProps {
  monsters: Monster[];
  items: Item[];
  maps: MapData[];
  playersCount: number;
  setActive: (s: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  monsters,
  items,
  maps,
  playersCount,
  setActive,
}) => {
  const [isMaster, setIsMaster] = useState(false);
  const [masterEmail, setMasterEmail] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(() =>
    loadSessionStatus(),
  );
  const [sessionDraft, setSessionDraft] = useState<SessionStatus>(() =>
    loadSessionStatus(),
  );
  const [isSessionEditorOpen, setIsSessionEditorOpen] = useState(false);

  const [selectedDice, setSelectedDice] = useState<DiceType>('1d20');
  const [diceResult, setDiceResult] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthState() {
      try {
        const user = await getCurrentAuthUser();

        if (!isMounted) {
          return;
        }

        setIsMaster(Boolean(user));
        setMasterEmail(user?.email ?? null);
      } catch (error) {
        console.error('Erro ao verificar autenticação do mestre:', error);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    loadAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAuthState();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      SESSION_STATUS_STORAGE_KEY,
      JSON.stringify(sessionStatus),
    );
  }, [sessionStatus]);

  useEffect(() => {
    setSessionDraft(sessionStatus);
  }, [sessionStatus]);

  function openLoginModal() {
    setAuthError('');
    setLoginPassword('');
    setIsLoginOpen(true);
  }

  function closeLoginModal() {
    setAuthError('');
    setLoginPassword('');
    setIsLoginOpen(false);
  }

  async function refreshAuthState() {
    const user = await getCurrentAuthUser();

    setIsMaster(Boolean(user));
    setMasterEmail(user?.email ?? null);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAuthError('');

    try {
      await signInMaster(loginEmail.trim(), loginPassword);

      setLoginPassword('');
      setIsLoginOpen(false);

      await refreshAuthState();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar no modo mestre.';

      setAuthError(message);
    }
  }

  async function handleLogout() {
    setAuthError('');

    try {
      await signOutMaster();

      setLoginEmail('');
      setLoginPassword('');
      setIsLoginOpen(false);

      await refreshAuthState();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível sair do modo mestre.';

      setAuthError(message);
    }
  }

  function openSessionEditor() {
    setSessionDraft(sessionStatus);
    setIsSessionEditorOpen(true);
  }

  function closeSessionEditor() {
    setSessionDraft(sessionStatus);
    setIsSessionEditorOpen(false);
  }

  function handleSaveSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSessionStatus({
      weather: sessionDraft.weather.trim() || DEFAULT_SESSION_STATUS.weather,
      campaignPhase:
        sessionDraft.campaignPhase.trim() || DEFAULT_SESSION_STATUS.campaignPhase,
      notes: sessionDraft.notes.trim() || DEFAULT_SESSION_STATUS.notes,
    });

    setIsSessionEditorOpen(false);
  }

  function rollDice() {
    const sides = selectedDice === '1d6' ? 6 : 20;
    const result = Math.floor(Math.random() * sides) + 1;

    setDiceResult(result);
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="relative flex items-start justify-between gap-4">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059] mb-2">
            Escudo do Mestre
          </h2>

          <p className="text-lg italic opacity-80">
            "As chamas da taverna iluminam os segredos de Drakon."
          </p>
        </div>

        <button
          type="button"
          onClick={openLoginModal}
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#8b6b40] bg-black/10 text-[#8b6b40] opacity-20 transition hover:opacity-70 hover:bg-black/20"
          aria-label="Entrar no modo mestre"
          title="Entrar no modo mestre"
        >
          ●
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Bestiário"
          count={monsters.length}
          icon="💀"
          onClick={() => setActive('monsters')}
        />

        <StatCard
          title="Tesouros"
          count={items.length}
          icon="💎"
          onClick={() => setActive('items')}
        />

        <StatCard
          title="Jogadores"
          count={playersCount}
          icon="🧙"
          onClick={() => setActive('players')}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="parchment p-6 rounded-md">
          <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-[#8b6b40] pb-2">
            <h3 className="medieval-font text-2xl">Status da Sessão</h3>

            {isMaster && (
              <button
                type="button"
                onClick={openSessionEditor}
                className="rounded-full border border-[#8b6b40] bg-white/20 px-2 py-1 text-sm text-[#5a0a0a] transition hover:bg-white/35"
                aria-label="Editar status da sessão"
                title="Editar status da sessão"
              >
                ✎
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span>Clima em Cassiopéia:</span>
              <span className="font-bold text-red-900">{sessionStatus.weather}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Fase da Campanha:</span>
              <span className="font-bold text-red-900">
                {sessionStatus.campaignPhase}
              </span>
            </div>

            <div className="mt-4">
              <p className="font-bold text-sm mb-1 uppercase tracking-wider">
                Anotações Rápidas:
              </p>

              <div className="min-h-32 whitespace-pre-wrap rounded-sm border border-[#8b6b40] bg-white/20 p-3 italic">
                {sessionStatus.notes}
              </div>
            </div>
          </div>
        </section>

        <section className="parchment p-6 rounded-md">
          <div className="mb-4 border-b-2 border-[#8b6b40] pb-2">
            <h3 className="medieval-font text-2xl">Rolagem de Dados</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <DiceOptionButton
                label="1d6"
                selected={selectedDice === '1d6'}
                onClick={() => setSelectedDice('1d6')}
              />

              <DiceOptionButton
                label="1d20"
                selected={selectedDice === '1d20'}
                onClick={() => setSelectedDice('1d20')}
              />
            </div>

            <button
              type="button"
              onClick={rollDice}
              className="dark-red-bg w-full rounded px-4 py-3 medieval-font text-lg text-[#f4e4bc] shadow-md transition hover:brightness-110"
            >
              Rolar
            </button>

            <div className="rounded border border-dashed border-[#8b6b40] bg-black/10 p-4 text-center">
              <p className="text-sm uppercase tracking-widest text-[#8b6b40]">
                Dado
              </p>

              <p className="cinzel text-3xl font-bold text-[#c5a059]">
                {selectedDice}
              </p>

              <p className="mt-2 text-sm uppercase tracking-widest text-[#8b6b40]">
                Resultado
              </p>

              <p className="cinzel text-5xl font-bold text-red-900">
                {diceResult ?? '—'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {isLoginOpen && (
        <Modal onClose={closeLoginModal}>
          <div
            className="parchment w-full max-w-md rounded-lg shadow-2xl border-4 border-[#8b6b40] p-7 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLoginModal}
              className="absolute top-3 right-3 text-red-900 text-xl font-bold opacity-70 hover:opacity-100"
              aria-label="Fechar"
            >
              ×
            </button>

            {isMaster ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-4xl mb-2">🔒</p>

                  <h3 className="cinzel text-3xl font-bold text-red-900">
                    Modo Mestre Ativo
                  </h3>

                  {masterEmail && (
                    <p className="mt-2 text-sm opacity-70 italic truncate">
                      {masterEmail}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeLoginModal}
                    className="flex-1 px-4 py-3 rounded border border-[#8b6b40] opacity-70 hover:opacity-100"
                  >
                    Fechar
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 dark-red-bg text-[#f4e4bc] px-4 py-3 rounded medieval-font text-lg"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-4xl mb-2">🔒</p>

                  <h3 className="cinzel text-3xl font-bold text-red-900">
                    Entrada do Mestre
                  </h3>

                  <p className="mt-2 text-sm opacity-70 italic">
                    Acesso reservado para revelar recursos ocultos da campanha.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      E-mail
                    </label>

                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      className="w-full bg-white/60 border border-[#8b6b40] p-3 rounded focus:outline-none text-sm"
                      placeholder="mestre@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      Senha
                    </label>

                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      className="w-full bg-white/60 border border-[#8b6b40] p-3 rounded focus:outline-none text-sm"
                      placeholder="Senha do mestre"
                      required
                    />
                  </div>

                  {authError && (
                    <div className="rounded border border-red-900 bg-red-900/10 p-3 text-sm text-red-900 font-bold">
                      {authError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={closeLoginModal}
                      className="flex-1 px-4 py-3 rounded border border-[#8b6b40] opacity-70 hover:opacity-100"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="flex-1 dark-red-bg text-[#f4e4bc] px-4 py-3 rounded medieval-font text-lg disabled:opacity-50"
                    >
                      {isAuthLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Modal>
      )}

      {isSessionEditorOpen && isMaster && (
        <Modal onClose={closeSessionEditor}>
          <div
            className="parchment w-full max-w-xl rounded-lg shadow-2xl border-4 border-[#8b6b40] p-7 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeSessionEditor}
              className="absolute top-3 right-3 text-red-900 text-xl font-bold opacity-70 hover:opacity-100"
              aria-label="Fechar"
            >
              ×
            </button>

            <h3 className="cinzel text-3xl font-bold text-red-900 mb-5">
              Editar Status da Sessão
            </h3>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <TextAreaField
                label="Clima em Cassiopéia"
                value={sessionDraft.weather}
                onChange={(value) =>
                  setSessionDraft((current) => ({
                    ...current,
                    weather: value,
                  }))
                }
                placeholder="Tempestuoso, nebuloso, silencioso..."
              />

              <TextAreaField
                label="Fase da Campanha"
                value={sessionDraft.campaignPhase}
                onChange={(value) =>
                  setSessionDraft((current) => ({
                    ...current,
                    campaignPhase: value,
                  }))
                }
                placeholder="Capítulo II, preparação para o cerco..."
              />

              <div>
                <label className="block text-sm font-bold uppercase mb-1">
                  Anotações Rápidas:
                </label>

                <textarea
                  value={sessionDraft.notes}
                  onChange={(event) =>
                    setSessionDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-32 focus:outline-none italic"
                  placeholder="Ex: Jogadores encontraram o mercador ferido..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSessionEditor}
                  className="px-4 py-2 opacity-60 hover:opacity-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="dark-red-bg text-[#f4e4bc] px-6 py-2 rounded medieval-font text-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  icon: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="wood-panel p-6 rounded-lg text-left transition-transform hover:scale-105 group border-2 border-transparent hover:border-[#c5a059]"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[#8b6b40] font-bold text-sm uppercase tracking-widest">
          {title}
        </p>

        <p className="text-4xl cinzel font-bold text-[#c5a059]">
          {count}
        </p>
      </div>

      <span className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
    </div>
  </button>
);

interface DiceOptionButtonProps {
  label: DiceType;
  selected: boolean;
  onClick: () => void;
}

const DiceOptionButton: React.FC<DiceOptionButtonProps> = ({
  label,
  selected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded border px-4 py-3 medieval-font text-lg transition ${
      selected
        ? 'border-[#c5a059] bg-[#3d2b1f] text-[#f4e4bc]'
        : 'border-[#8b6b40] bg-white/20 text-[#8b6b40]'
    }`}
  >
    {label}
  </button>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-bold uppercase mb-1">{label}:</label>

    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-24 focus:outline-none italic"
    />
  </div>
);

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    onClick={onClose}
  >
    {children}
  </div>
);

export default Dashboard;