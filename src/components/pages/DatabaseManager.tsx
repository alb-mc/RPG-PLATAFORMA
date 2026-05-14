import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Item } from '../../types/types';
import {
  getCurrentAuthUser,
  signInMaster,
  signOutMaster,
} from '../../services/authService';

interface DatabaseProps {
  type: 'monsters' | 'items' | 'shops';
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  items?: Item[];
}

interface AttackFormState {
  nome: string;
  caC: string;
  dano: string;
  custo: string;
}

interface CreatureSheetFormState {
  nome: string;
  descricao: string;
  forca: number;
  agilidade: number;
  inteligencia: number;
  vontade: number;
  pv: number;
  pm: number;
  defesa: number;
  determinacao: number;
  ataques: AttackFormState[];
  habilidadesTexto: string;
  oculto: boolean;
}

interface EquipmentFormState {
  arma: string;
  custo: string;
  dano: string;
  tipo: string;
  fn: string;
  peso: string;
  distancia: string;
  observacoes: string;
  oculto: boolean;
}

interface ShopNpcFormState extends CreatureSheetFormState {
  npcDono: string;
  localizacao: string;
}

const initialCreatureSheetForm: CreatureSheetFormState = {
  nome: '',
  descricao: '',
  forca: 3,
  agilidade: 3,
  inteligencia: 3,
  vontade: 3,
  pv: 10,
  pm: 10,
  defesa: 8,
  determinacao: 8,
  ataques: [
    {
      nome: '',
      caC: '',
      dano: '',
      custo: '',
    },
  ],
  habilidadesTexto: '',
  oculto: false,
};

const initialEquipmentForm: EquipmentFormState = {
  arma: '',
  custo: '',
  dano: '',
  tipo: '',
  fn: '',
  peso: '',
  distancia: '',
  observacoes: '',
  oculto: false,
};

const initialShopNpcForm: ShopNpcFormState = {
  ...initialCreatureSheetForm,
  npcDono: '',
  localizacao: '',
};

const DatabaseManager: React.FC<DatabaseProps> = ({ type, data, setData }) => {
  const [isAdding, setIsAdding] = useState(false);

  const [isMaster, setIsMaster] = useState(false);
  const [masterEmail, setMasterEmail] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [monsterForm, setMonsterForm] =
    useState<CreatureSheetFormState>(initialCreatureSheetForm);

  const [equipmentForm, setEquipmentForm] =
    useState<EquipmentFormState>(initialEquipmentForm);

  const [shopNpcForm, setShopNpcForm] =
    useState<ShopNpcFormState>(initialShopNpcForm);

  const [formError, setFormError] = useState('');

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
          setIsCheckingAuth(false);
        }
      }
    }

    loadAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleData = useMemo(() => {
    if (isMaster) {
      return data;
    }

    return data.filter(
      (entry) => !entry.oculto && !entry.isHidden && !entry.is_hidden,
    );
  }, [data, isMaster]);

  async function refreshMasterState() {
    const user = await getCurrentAuthUser();

    setIsMaster(Boolean(user));
    setMasterEmail(user?.email ?? null);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsAuthLoading(true);
    setAuthError('');

    try {
      await signInMaster(loginEmail.trim(), loginPassword);

      setLoginPassword('');
      setIsLoginModalOpen(false);

      await refreshMasterState();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar no modo mestre.';

      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function handleLogout() {
    setIsAuthLoading(true);
    setAuthError('');

    try {
      await signOutMaster();

      setIsMaster(false);
      setMasterEmail(null);
      setLoginEmail('');
      setLoginPassword('');
      setIsLoginModalOpen(false);
      setIsAdding(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível sair do modo mestre.';

      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  }

  function openLoginModal() {
    setAuthError('');
    setLoginPassword('');
    setIsLoginModalOpen(true);
  }

  function closeLoginModal() {
    if (isAuthLoading) {
      return;
    }

    setAuthError('');
    setLoginPassword('');
    setIsLoginModalOpen(false);
  }

  function openCreateModal() {
    setFormError('');
    setMonsterForm(initialCreatureSheetForm);
    setEquipmentForm(initialEquipmentForm);
    setShopNpcForm(initialShopNpcForm);
    setIsAdding(true);
  }

  function closeCreateModal() {
    setFormError('');
    setMonsterForm(initialCreatureSheetForm);
    setEquipmentForm(initialEquipmentForm);
    setShopNpcForm(initialShopNpcForm);
    setIsAdding(false);
  }

  const getTitle = () => {
    switch (type) {
      case 'monsters':
        return 'Grimório de Criaturas';
      case 'items':
        return 'Arsenal & Relíquias';
      case 'shops':
        return 'Comércio & Tavernas';
      default:
        return 'Banco de Dados';
    }
  };

  const getCreateButtonLabel = () => {
    switch (type) {
      case 'monsters':
        return '+ Criar Monstro';
      case 'items':
        return '+ Novo Equipamento';
      case 'shops':
        return '+ Criar Loja/NPC';
      default:
        return '+ Criar';
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'monsters':
        return 'Nova Criatura de Drakon';
      case 'items':
        return 'Novo Equipamento';
      case 'shops':
        return 'Nova Loja ou NPC';
      default:
        return 'Novo Recurso';
    }
  };

  const deleteItem = (id: string) => {
    if (!isMaster) {
      return;
    }

    setData((prev) => prev.filter((entry) => entry.id !== id));
  };

  function createSheetPayload(form: CreatureSheetFormState) {
    const ataquesValidos = form.ataques
      .map((ataque) => ({
        nome: ataque.nome.trim(),
        caC: ataque.caC.trim(),
        dano: ataque.dano.trim(),
        custo: ataque.custo.trim(),
      }))
      .filter((ataque) => ataque.nome || ataque.caC || ataque.dano || ataque.custo);

    const habilidades = form.habilidadesTexto
      .split('\n')
      .map((habilidade) => habilidade.trim())
      .filter(Boolean);

    return {
      descricao: form.descricao.trim(),
      oculto: form.oculto,
      stats: {
        forca: form.forca,
        agilidade: form.agilidade,
        inteligencia: form.inteligencia,
        vontade: form.vontade,
      },
      recursos: {
        pv: form.pv,
        pm: form.pm,
        defesa: form.defesa,
        determinacao: form.determinacao,
      },
      ataques: ataquesValidos,
      habilidades,
    };
  }

  function validateSheetForm(form: CreatureSheetFormState, entityLabel: string) {
    const nome = form.nome.trim();

    if (!nome) {
      setFormError(`Informe o nome de ${entityLabel}.`);
      return false;
    }

    if (form.pv < 1) {
      setFormError('PV precisa ser no mínimo 1.');
      return false;
    }

    if (form.pm < 0) {
      setFormError('PM não pode ser negativo.');
      return false;
    }

    return true;
  }

  function createMonster() {
    if (!isMaster) {
      return;
    }

    if (!validateSheetForm(monsterForm, 'monstro')) {
      return;
    }

    const newMonster = {
      id: createId(),
      nome: monsterForm.nome.trim(),
      ...createSheetPayload(monsterForm),
    };

    setData((prev) => [...prev, newMonster]);
    closeCreateModal();
  }

  function createEquipment() {
    if (!isMaster) {
      return;
    }

    const arma = equipmentForm.arma.trim();

    if (!arma) {
      setFormError('Informe o nome da arma/equipamento.');
      return;
    }

    const newEquipment = {
      id: createId(),
      nome: arma,
      arma,
      custo: equipmentForm.custo.trim(),
      dano: equipmentForm.dano.trim(),
      tipo: equipmentForm.tipo.trim(),
      fn: equipmentForm.fn.trim(),
      peso: equipmentForm.peso.trim(),
      distancia: equipmentForm.distancia.trim(),
      observacoes: equipmentForm.observacoes.trim(),
      oculto: equipmentForm.oculto,
    };

    setData((prev) => [...prev, newEquipment]);
    closeCreateModal();
  }

  function createShopNpc() {
    if (!isMaster) {
      return;
    }

    if (!validateSheetForm(shopNpcForm, 'loja ou NPC')) {
      return;
    }

    const newShopNpc = {
      id: createId(),
      nome: shopNpcForm.nome.trim(),
      npcDono: shopNpcForm.npcDono.trim() || shopNpcForm.nome.trim(),
      localizacao: shopNpcForm.localizacao.trim() || 'Drakon',
      ...createSheetPayload(shopNpcForm),
    };

    setData((prev) => [...prev, newShopNpc]);
    closeCreateModal();
  }

  function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError('');

    if (type === 'monsters') {
      createMonster();
      return;
    }

    if (type === 'items') {
      createEquipment();
      return;
    }

    createShopNpc();
  }

  return (
    <div className="animate-fadeIn">
      <header className="flex flex-col gap-4 border-b-4 border-[#8b6b40] pb-4 mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059]">
            {getTitle()}
          </h2>

          <p className="opacity-70 italic">
            {isMaster
              ? 'Modo mestre ativo: recursos públicos e ocultos estão visíveis.'
              : 'Modo visitante: apenas recursos públicos estão visíveis.'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isCheckingAuth ? (
            <div className="parchment px-4 py-3 rounded opacity-70">
              Verificando mestre...
            </div>
          ) : isMaster ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="parchment px-4 py-3 rounded shadow-lg border border-[#8b6b40]">
                <p className="medieval-font text-sm font-bold text-red-900">
                  Modo Mestre Ativo
                </p>

                {masterEmail && (
                  <p className="text-xs opacity-70 truncate max-w-[220px]">
                    {masterEmail}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isAuthLoading}
                className="px-5 py-3 rounded shadow-lg border border-[#8b6b40] medieval-font text-lg text-[#f4e4bc] bg-red-950 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isAuthLoading ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="parchment px-6 py-3 rounded shadow-lg border border-[#8b6b40] medieval-font text-lg text-red-900 hover:scale-105 transition-all"
            >
              Ocultos
            </button>
          )}

          {isMaster && (
            <button
              type="button"
              onClick={openCreateModal}
              className="dark-red-bg px-6 py-3 rounded shadow-lg border border-[#c5a059] medieval-font text-lg text-[#f4e4bc] hover:scale-105 transition-all"
            >
              {getCreateButtonLabel()}
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleData.length === 0 ? (
          <div className="col-span-full parchment p-12 text-center rounded-lg opacity-40">
            <p className="medieval-font text-2xl">
              {isMaster
                ? 'A base de dados está silenciosa...'
                : 'Nenhum recurso público encontrado.'}
            </p>
          </div>
        ) : (
          visibleData.map((entry) => (
            <DataCard
              key={entry.id}
              entry={entry}
              type={type}
              isMaster={isMaster}
              onDelete={() => deleteItem(entry.id)}
            />
          ))
        )}
      </div>

      {isLoginModalOpen && (
        <Modal onClose={closeLoginModal}>
          <div
            className="parchment w-full max-w-md rounded-lg shadow-2xl border-4 border-[#8b6b40] p-7 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLoginModal}
              disabled={isAuthLoading}
              className="absolute top-3 right-3 text-red-900 text-xl font-bold opacity-70 hover:opacity-100 disabled:opacity-30"
              aria-label="Fechar"
            >
              ×
            </button>

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
                  disabled={isAuthLoading}
                  className="flex-1 px-4 py-3 rounded border border-[#8b6b40] opacity-70 hover:opacity-100 disabled:opacity-30"
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
          </div>
        </Modal>
      )}

      {isAdding && isMaster && (
        <Modal onClose={closeCreateModal}>
          <div
            className="parchment p-8 rounded shadow-2xl max-w-3xl w-full border-4 border-[#8b6b40] relative max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCreateModal}
              className="absolute top-3 right-3 text-red-900 text-xl font-bold opacity-70 hover:opacity-100"
              aria-label="Fechar"
            >
              ×
            </button>

            <h3 className="cinzel text-3xl font-bold mb-6 border-b-2 border-[#8b6b40] text-red-900">
              {getModalTitle()}
            </h3>

            <p className="mb-4 opacity-70 italic">
              Preencha os campos com sabedoria, Mestre.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {type === 'monsters' && (
                <CreatureSheetCreateForm
                  form={monsterForm}
                  setForm={setMonsterForm}
                  nameLabel="Nome do monstro"
                  namePlaceholder="Ex: Alce"
                />
              )}

              {type === 'items' && (
                <EquipmentCreateForm
                  form={equipmentForm}
                  setForm={setEquipmentForm}
                />
              )}

              {type === 'shops' && (
                <ShopNpcCreateForm
                  form={shopNpcForm}
                  setForm={setShopNpcForm}
                />
              )}

              {formError && (
                <div className="rounded border border-red-900 bg-red-900/10 p-3 text-sm text-red-900 font-bold">
                  {formError}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 opacity-50 hover:opacity-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="dark-red-bg text-[#f4e4bc] px-6 py-2 rounded medieval-font text-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface CreatureSheetCreateFormProps {
  form: CreatureSheetFormState;
  setForm: React.Dispatch<React.SetStateAction<CreatureSheetFormState>>;
  nameLabel: string;
  namePlaceholder: string;
}

const CreatureSheetCreateForm: React.FC<CreatureSheetCreateFormProps> = ({
  form,
  setForm,
  nameLabel,
  namePlaceholder,
}) => {
  function updateField<K extends keyof CreatureSheetFormState>(
    field: K,
    value: CreatureSheetFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateAttackField(
    index: number,
    field: keyof AttackFormState,
    value: string,
  ) {
    setForm((current) => {
      const ataques = current.ataques.map((ataque, attackIndex) => {
        if (attackIndex !== index) {
          return ataque;
        }

        return {
          ...ataque,
          [field]: value,
        };
      });

      return {
        ...current,
        ataques,
      };
    });
  }

  function addAttack() {
    setForm((current) => ({
      ...current,
      ataques: [
        ...current.ataques,
        {
          nome: '',
          caC: '',
          dano: '',
          custo: '',
        },
      ],
    }));
  }

  function removeAttack(index: number) {
    setForm((current) => {
      if (current.ataques.length === 1) {
        return current;
      }

      return {
        ...current,
        ataques: current.ataques.filter((_, attackIndex) => attackIndex !== index),
      };
    });
  }

  return (
    <>
      <div>
        <label className="block text-sm font-bold uppercase mb-1">
          {nameLabel}:
        </label>

        <input
          value={form.nome}
          onChange={(event) => updateField('nome', event.target.value)}
          className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded focus:outline-none"
          placeholder={namePlaceholder}
          required
        />
      </div>

      <div>
        <h4 className="medieval-font text-xl font-bold text-red-900 mb-2">
          Atributos
        </h4>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <NumberField
            label="Força"
            value={form.forca}
            onChange={(value) => updateField('forca', value)}
          />

          <NumberField
            label="Agilidade"
            value={form.agilidade}
            onChange={(value) => updateField('agilidade', value)}
          />

          <NumberField
            label="Inteligência"
            value={form.inteligencia}
            onChange={(value) => updateField('inteligencia', value)}
          />

          <NumberField
            label="Vontade"
            value={form.vontade}
            onChange={(value) => updateField('vontade', value)}
          />
        </div>
      </div>

      <div>
        <h4 className="medieval-font text-xl font-bold text-red-900 mb-2">
          Recursos e Defesa
        </h4>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <NumberField
            label="PV"
            value={form.pv}
            onChange={(value) => updateField('pv', value)}
          />

          <NumberField
            label="PM"
            value={form.pm}
            onChange={(value) => updateField('pm', value)}
          />

          <NumberField
            label="Defesa / Esquiva"
            value={form.defesa}
            onChange={(value) => updateField('defesa', value)}
          />

          <NumberField
            label="Determinação"
            value={form.determinacao}
            onChange={(value) => updateField('determinacao', value)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h4 className="medieval-font text-xl font-bold text-red-900">
            Ataques
          </h4>

          <button
            type="button"
            onClick={addAttack}
            className="dark-red-bg text-[#f4e4bc] px-3 py-1 rounded medieval-font text-sm"
          >
            + Ataque
          </button>
        </div>

        <div className="space-y-3">
          {form.ataques.map((ataque, index) => (
            <div
              key={index}
              className="border border-[#8b6b40] rounded p-3 bg-white/20"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm">Ataque {index + 1}</span>

                {form.ataques.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttack(index)}
                    className="text-red-900 text-sm font-bold"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <TextField
                  label="Nome"
                  value={ataque.nome}
                  onChange={(value) => updateAttackField(index, 'nome', value)}
                  placeholder="Chifre"
                />

                <TextField
                  label="CaC"
                  value={ataque.caC}
                  onChange={(value) => updateAttackField(index, 'caC', value)}
                  placeholder="+8"
                />

                <TextField
                  label="Dano"
                  value={ataque.dano}
                  onChange={(value) => updateAttackField(index, 'dano', value)}
                  placeholder="20 / Cont."
                />

                <TextField
                  label="Custo"
                  value={ataque.custo}
                  onChange={(value) => updateAttackField(index, 'custo', value)}
                  placeholder="10 PMs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-1">
          Habilidades:
        </label>

        <textarea
          value={form.habilidadesTexto}
          onChange={(event) => updateField('habilidadesTexto', event.target.value)}
          className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-32 focus:outline-none"
          placeholder={`Ataque do Búfalo (Ação) - 10 PMs
Chifres Poderosos (Suporte)
Montaria (Suporte)
Quadrúpede (Suporte)
Resistência do Frio (Suporte)`}
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-1">
          Descrição narrativa:
        </label>

        <textarea
          value={form.descricao}
          onChange={(event) => updateField('descricao', event.target.value)}
          className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-28 focus:outline-none"
          placeholder="Descreva aparência, comportamento, função na campanha ou informações importantes."
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.oculto}
          onChange={(event) => updateField('oculto', event.target.checked)}
        />
        Oculto para jogadores
      </label>
    </>
  );
};

interface ShopNpcCreateFormProps {
  form: ShopNpcFormState;
  setForm: React.Dispatch<React.SetStateAction<ShopNpcFormState>>;
}

const ShopNpcCreateForm: React.FC<ShopNpcCreateFormProps> = ({
  form,
  setForm,
}) => {
  function updateField<K extends keyof ShopNpcFormState>(
    field: K,
    value: ShopNpcFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function setCreatureForm(
    updater: React.SetStateAction<CreatureSheetFormState>,
  ) {
    setForm((current) => {
      const creaturePart: CreatureSheetFormState = {
        nome: current.nome,
        descricao: current.descricao,
        forca: current.forca,
        agilidade: current.agilidade,
        inteligencia: current.inteligencia,
        vontade: current.vontade,
        pv: current.pv,
        pm: current.pm,
        defesa: current.defesa,
        determinacao: current.determinacao,
        ataques: current.ataques,
        habilidadesTexto: current.habilidadesTexto,
        oculto: current.oculto,
      };

      const updatedCreaturePart =
        typeof updater === 'function'
          ? updater(creaturePart)
          : updater;

      return {
        ...current,
        ...updatedCreaturePart,
      };
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Dono / NPC"
          value={form.npcDono}
          onChange={(value) => updateField('npcDono', value)}
          placeholder="Ex: Brann, o Ferreiro"
        />

        <TextField
          label="Localização"
          value={form.localizacao}
          onChange={(value) => updateField('localizacao', value)}
          placeholder="Ex: Vila de Drakon"
        />
      </div>

      <CreatureSheetCreateForm
        form={form}
        setForm={setCreatureForm}
        nameLabel="Nome da loja ou NPC"
        namePlaceholder="Ex: Forja do Brann"
      />
    </>
  );
};

interface EquipmentCreateFormProps {
  form: EquipmentFormState;
  setForm: React.Dispatch<React.SetStateAction<EquipmentFormState>>;
}

const EquipmentCreateForm: React.FC<EquipmentCreateFormProps> = ({
  form,
  setForm,
}) => {
  function updateField<K extends keyof EquipmentFormState>(
    field: K,
    value: EquipmentFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <>
      <div>
        <label className="block text-sm font-bold uppercase mb-1">
          Arma / Equipamento:
        </label>

        <input
          value={form.arma}
          onChange={(event) => updateField('arma', event.target.value)}
          className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded focus:outline-none"
          placeholder="Ex: Soco, chute"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField
          label="Custo"
          value={form.custo}
          onChange={(value) => updateField('custo', value)}
          placeholder="-"
        />

        <TextField
          label="Dano"
          value={form.dano}
          onChange={(value) => updateField('dano', value)}
          placeholder="For+0"
        />

        <TextField
          label="Tipo"
          value={form.tipo}
          onChange={(value) => updateField('tipo', value)}
          placeholder="Contusão"
        />

        <TextField
          label="FN"
          value={form.fn}
          onChange={(value) => updateField('fn', value)}
          placeholder="1"
        />

        <TextField
          label="Peso"
          value={form.peso}
          onChange={(value) => updateField('peso', value)}
          placeholder="-"
        />

        <TextField
          label="Distância"
          value={form.distancia}
          onChange={(value) => updateField('distancia', value)}
          placeholder="Corpo-a-corpo"
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-1">
          Observações:
        </label>

        <textarea
          value={form.observacoes}
          onChange={(event) => updateField('observacoes', event.target.value)}
          className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-24 focus:outline-none"
          placeholder="Informações extras, regras especiais ou restrições."
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.oculto}
          onChange={(event) => updateField('oculto', event.target.checked)}
        />
        Oculto para jogadores
      </label>
    </>
  );
};

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">{label}:</label>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded text-center"
      />
    </div>
  );
};

interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">{label}:</label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded text-sm"
      />
    </div>
  );
};

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return String(Date.now());
}

interface DataCardProps {
  entry: any;
  type: 'monsters' | 'items' | 'shops';
  isMaster: boolean;
  onDelete: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  entry,
  type,
  isMaster,
  onDelete,
}) => {
  const isHidden = Boolean(entry.oculto || entry.isHidden || entry.is_hidden);

  return (
    <div className="parchment p-5 rounded relative group border-2 border-transparent hover:border-[#8b6b40] transition-all overflow-hidden">
      {isMaster && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-900/10 rounded"
          title="Excluir"
        >
          🗑️
        </button>
      )}

      {isHidden && isMaster && (
        <span className="absolute top-2 left-2 bg-red-900 text-[#f4e4bc] text-xs px-2 py-1 rounded medieval-font">
          Oculto
        </span>
      )}

      <div className="flex items-center space-x-3 mb-3 border-b border-[#8b6b40]/30 pb-2">
        <span className="text-3xl">
          {type === 'monsters' ? '🐲' : type === 'items' ? '⚔️' : '🏪'}
        </span>

        <h4 className="medieval-font text-xl font-bold truncate pr-6">
          {entry.nome || entry.arma || 'Sem Nome'}
        </h4>
      </div>

      <div className="text-sm space-y-2 opacity-90">
        {type === 'monsters' && <SheetCardDetails entry={entry} />}

        {type === 'items' && <EquipmentCardDetails entry={entry} />}

        {type === 'shops' && (
          <div className="space-y-3">
            <div className="text-xs space-y-1">
              <p>
                <strong>Dono/NPC:</strong> {entry.npcDono || 'Desconhecido'}
              </p>

              <p>
                <strong>Lugar:</strong> {entry.localizacao || 'Drakon'}
              </p>
            </div>

            <SheetCardDetails entry={entry} />
          </div>
        )}
      </div>
    </div>
  );
};

const SheetCardDetails = ({ entry }: { entry: any }) => {
  const stats = entry.stats ?? {};
  const recursos = entry.recursos ?? {};
  const ataques = Array.isArray(entry.ataques) ? entry.ataques : [];
  const habilidades = Array.isArray(entry.habilidades) ? entry.habilidades : [];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs bg-black/10 p-2 rounded">
        <span>Força: {stats.forca ?? 3}</span>
        <span>PV: {recursos.pv ?? entry.pv ?? 10}</span>

        <span>Agilidade: {stats.agilidade ?? 3}</span>
        <span>PM: {recursos.pm ?? entry.pm ?? 10}</span>

        <span>Inteligência: {stats.inteligencia ?? 3}</span>
        <span>Def. Esquiva: {recursos.defesa ?? entry.defesa ?? 8}</span>

        <span>Vontade: {stats.vontade ?? 3}</span>
        <span>
          Determinação: {recursos.determinacao ?? entry.determinacao ?? 8}
        </span>
      </div>

      {ataques.length > 0 && (
        <div>
          <p className="font-bold text-red-900 mb-1">Ataques:</p>

          <div className="space-y-1 text-xs">
            {ataques.map((ataque: AttackFormState, index: number) => (
              <p key={index}>
                <strong>{ataque.nome || 'Ataque'}:</strong>{' '}
                {ataque.caC ? `CaC ${ataque.caC}` : ''}
                {ataque.dano ? `; Dano: ${ataque.dano}` : ''}
                {ataque.custo ? `; Custo: ${ataque.custo}` : ''}
              </p>
            ))}
          </div>
        </div>
      )}

      {habilidades.length > 0 && (
        <div>
          <p className="font-bold text-red-900 mb-1">Habilidades:</p>

          <ul className="list-disc pl-5 text-xs space-y-1">
            {habilidades.slice(0, 5).map((habilidade: string, index: number) => (
              <li key={index}>{habilidade}</li>
            ))}
          </ul>

          {habilidades.length > 5 && (
            <p className="text-xs italic opacity-70 mt-1">
              +{habilidades.length - 5} habilidades adicionais
            </p>
          )}
        </div>
      )}

      {entry.descricao && (
        <p className="italic line-clamp-2">"{entry.descricao}"</p>
      )}
    </div>
  );
};

const EquipmentCardDetails = ({ entry }: { entry: any }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs bg-black/10 p-2 rounded">
        <span>Arma: {entry.arma || entry.nome || '—'}</span>
        <span>Custo: {entry.custo || entry.preco || '—'}</span>

        <span>Dano: {entry.dano || '—'}</span>
        <span>Tipo: {entry.tipo || '—'}</span>

        <span>FN: {entry.fn || '—'}</span>
        <span>Peso: {entry.peso || '—'}</span>

        <span className="col-span-2">
          Distância: {entry.distancia || '—'}
        </span>
      </div>

      {entry.observacoes && (
        <p className="italic line-clamp-3">"{entry.observacoes}"</p>
      )}
    </div>
  );
};

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

export default DatabaseManager;