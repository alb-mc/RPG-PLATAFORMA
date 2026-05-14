import React, { useEffect, useState } from 'react';
import {
  getCurrentAuthUser,
  signInMaster,
  signOutMaster,
  type AuthUser,
} from '../../services/authService';

interface MasterAuthButtonProps {
  onAuthChange: (user: AuthUser | null) => void;
}

const MasterAuthButton: React.FC<MasterAuthButtonProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentAuthUser()
      .then((currentUser) => {
        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        onAuthChange(currentUser);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setUser(null);
        onAuthChange(null);
      });

    return () => {
      isMounted = false;
    };
  }, [onAuthChange]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Informe e-mail e senha.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const loggedUser = await signInMaster(email.trim(), password);

      setUser(loggedUser);
      onAuthChange(loggedUser);
      setPassword('');
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao entrar como mestre.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await signOutMaster();

      setUser(null);
      onAuthChange(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao sair do modo mestre.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="rounded border border-[#c5a059] bg-[#5a0a0a] px-3 py-1.5 text-xs font-bold text-[#f4e4bc] hover:bg-[#7a1010] disabled:opacity-60"
        title={user.email ?? 'Mestre autenticado'}
      >
        Ocultos Ativos
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded border border-[#8b6b40] bg-[#1a0f0a] px-3 py-1.5 text-xs font-bold text-[#d1b894] hover:bg-[#8b6b40]/20"
      >
        Ocultos
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="wood-panel w-full max-w-sm rounded p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="medieval-font text-xl text-[#c5a059]">
                Área do Mestre
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded border border-[#8b6b40] px-2 py-1 text-[#d1b894]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-mail do mestre"
                className="w-full rounded border border-[#8b6b40] bg-[#1a0f0a] px-3 py-2 text-[#d1b894] placeholder-[#8b6b40] focus:border-[#c5a059] focus:outline-none"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Senha"
                className="w-full rounded border border-[#8b6b40] bg-[#1a0f0a] px-3 py-2 text-[#d1b894] placeholder-[#8b6b40] focus:border-[#c5a059] focus:outline-none"
              />

              {errorMessage && (
                <p className="text-xs text-red-300">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="dark-red-bg w-full rounded border border-[#c5a059] px-4 py-2 text-sm font-bold text-[#f4e4bc] disabled:opacity-60"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MasterAuthButton;