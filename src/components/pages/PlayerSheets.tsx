import React, { FormEvent, useMemo, useState } from 'react';

export type PlayerClass = 'Arqueiro' | 'Guerreiro' | 'Ladino' | 'Mago' | 'Outro';

export interface Ability {
  nome: string;
  dificuldade: string;
  mana: string;
}

export interface Attack {
  arma: string;
  dano: string;
  tipo: string;
}

export interface Equipment {
  item: string;
  peso: string;
  custo: string;
}

export interface PlayerSheet {
  id: string;
  personagem: string;
  jogador: string;
  raca: string;
  classe: PlayerClass;
  experiencia: number;
  nivel: number;
  motivacao: string;

  vida: number;
  mana: number;

  forca: number;
  agilidade: number;
  inteligencia: number;
  vontade: number;

  cargaBasica: number;
  cargaPesada: number;
  cargaMaxima: number;

  bloqueio: number;
  esquiva: number;
  determinacao: number;

  habilidades: Ability[];
  ataques: Attack[];
  equipamentos: Equipment[];

  simbolo: string;
  descricao: string;
}

export const DEFAULT_PLAYER_SHEETS: PlayerSheet[] = [
  {
    id: 'default-archer',
    personagem: 'Elyra',
    jogador: '',
    raca: 'Humana',
    classe: 'Arqueiro',
    experiencia: 0,
    nivel: 1,
    motivacao: 'Proteger a floresta e rastrear amea├ºas antes que cheguem ao grupo.',
    vida: 20,
    mana: 10,
    forca: 2,
    agilidade: 5,
    inteligencia: 3,
    vontade: 3,
    cargaBasica: 2,
    cargaPesada: 4,
    cargaMaxima: 6,
    bloqueio: 8,
    esquiva: 12,
    determinacao: 10,
    habilidades: [
      {
        nome: 'Tiro Preciso',
        dificuldade: '10',
        mana: '2',
      },
    ],
    ataques: [
      {
        arma: 'Arco curto',
        dano: 'Agi+2',
        tipo: 'Perfura├º├úo',
      },
    ],
    equipamentos: [
      {
        item: 'Aljava',
        peso: '1',
        custo: '10',
      },
    ],
    simbolo: '­ƒÅ╣',
    descricao: 'Especialista em ataques ├á dist├óncia, rastreamento e emboscadas.',
  },
  {
    id: 'default-warrior',
    personagem: 'Borin',
    jogador: '',
    raca: 'An├úo',
    classe: 'Guerreiro',
    experiencia: 0,
    nivel: 1,
    motivacao: 'Buscar honra em combate e proteger seus aliados na linha de frente.',
    vida: 30,
    mana: 5,
    forca: 5,
    agilidade: 2,
    inteligencia: 2,
    vontade: 4,
    cargaBasica: 5,
    cargaPesada: 10,
    cargaMaxima: 15,
    bloqueio: 12,
    esquiva: 8,
    determinacao: 12,
    habilidades: [
      {
        nome: 'Postura Defensiva',
        dificuldade: 'ÔÇö',
        mana: 'ÔÇö',
      },
    ],
    ataques: [
      {
        arma: 'Espada longa',
        dano: 'For+3',
        tipo: 'Corte',
      },
    ],
    equipamentos: [
      {
        item: 'Escudo',
        peso: '2',
        custo: '25',
      },
    ],
    simbolo: '­ƒøí´©Å',
    descricao: 'Combatente resistente, ideal para proteger o grupo e segurar inimigos.',
  },
  {
    id: 'default-rogue',
    personagem: 'Kael',
    jogador: '',
    raca: 'Meio-elfo',
    classe: 'Ladino',
    experiencia: 0,
    nivel: 1,
    motivacao: 'Enriquecer, sobreviver e descobrir segredos que outros tentam esconder.',
    vida: 18,
    mana: 8,
    forca: 2,
    agilidade: 5,
    inteligencia: 4,
    vontade: 2,
    cargaBasica: 2,
    cargaPesada: 4,
    cargaMaxima: 6,
    bloqueio: 7,
    esquiva: 13,
    determinacao: 9,
    habilidades: [
      {
        nome: 'Ataque Furtivo',
        dificuldade: '12',
        mana: '2',
      },
    ],
    ataques: [
      {
        arma: 'Adaga',
        dano: 'Agi+1',
        tipo: 'Perfura├º├úo',
      },
    ],
    equipamentos: [
      {
        item: 'Kit de arrombamento',
        peso: '1',
        custo: '30',
      },
    ],
    simbolo: '­ƒùí´©Å',
    descricao: '├ügil, furtivo e perigoso quando ataca de surpresa.',
  },
  {
    id: 'default-mage',
    personagem: 'Myria',
    jogador: '',
    raca: 'Elfa',
    classe: 'Mago',
    experiencia: 0,
    nivel: 1,
    motivacao: 'Compreender for├ºas arcanas antigas e controlar a magia com precis├úo.',
    vida: 14,
    mana: 30,
    forca: 1,
    agilidade: 3,
    inteligencia: 5,
    vontade: 5,
    cargaBasica: 1,
    cargaPesada: 3,
    cargaMaxima: 5,
    bloqueio: 6,
    esquiva: 9,
    determinacao: 13,
    habilidades: [
      {
        nome: 'Proj├®til Arcano',
        dificuldade: '10',
        mana: '3',
      },
    ],
    ataques: [
      {
        arma: 'Cajado',
        dano: 'For+1',
        tipo: 'Contus├úo',
      },
    ],
    equipamentos: [
      {
        item: 'Grim├│rio',
        peso: '1',
        custo: '50',
      },
    ],
    simbolo: '­ƒö«',
    descricao: 'Conjuradora focada em magia, conhecimento e controle de campo.',
  },
];

const emptyPlayerSheet: PlayerSheet = {
  id: '',
  personagem: '',
  jogador: '',
  raca: '',
  classe: 'Outro',
  experiencia: 0,
  nivel: 1,
  motivacao: '',

  vida: 10,
  mana: 10,

  forca: 3,
  agilidade: 3,
  inteligencia: 3,
  vontade: 3,

  cargaBasica: 3,
  cargaPesada: 6,
  cargaMaxima: 9,

  bloqueio: 8,
  esquiva: 8,
  determinacao: 8,

  habilidades: [
    {
      nome: '',
      dificuldade: '',
      mana: '',
    },
  ],
  ataques: [
    {
      arma: '',
      dano: '',
      tipo: '',
    },
  ],
  equipamentos: [
    {
      item: '',
      peso: '',
      custo: '',
    },
  ],

  simbolo: '­ƒæñ',
  descricao: '',
};

const classDescriptions: Record<PlayerClass, string> = {
  Arqueiro: 'Especialista em combate ├á dist├óncia, percep├º├úo e posicionamento.',
  Guerreiro: 'Linha de frente resistente, focado em for├ºa, defesa e combate direto.',
  Ladino: '├ügil, furtivo e eficiente em emboscadas, truques e infiltra├º├úo.',
  Mago: 'Usu├írio de magia, conhecimento e habilidades arcanas.',
  Outro: 'Personagem personalizado com fun├º├úo definida pela campanha.',
};

interface PlayerSheetsProps {
  players: PlayerSheet[];
  onSavePlayer: (player: PlayerSheet) => Promise<void>;
  onDeletePlayer: (playerId: string) => Promise<void>;
}

const PlayerSheets: React.FC<PlayerSheetsProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
}) => {
  const safePlayers = Array.isArray(players) ? players : [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [form, setForm] = useState<PlayerSheet>(emptyPlayerSheet);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayedPlayers = safePlayers;

  const editingPlayer = useMemo(() => {
    if (!editingPlayerId) {
      return null;
    }

    return displayedPlayers.find((player) => player.id === editingPlayerId) ?? null;
  }, [editingPlayerId, displayedPlayers]);

  function openCreateModal() {
    setForm({
      ...emptyPlayerSheet,
      id: createId(),
    });

    setEditingPlayerId(null);
    setFormError('');
    setIsModalOpen(true);
  }

  function openEditModal(player: PlayerSheet) {
    setForm(clonePlayer(player));
    setEditingPlayerId(player.id);
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingPlayerId(null);
    setForm(emptyPlayerSheet);
    setFormError('');
  }

  async function deletePlayer(id: string) {
    const player = displayedPlayers.find((currentPlayer) => currentPlayer.id === id);

    if (!player) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja remover o personagem "${player.personagem}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDeletePlayer(id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a ficha.';

      setFormError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const personagem = form.personagem.trim();

    if (!personagem) {
      setFormError('Informe o nome do personagem.');
      return;
    }

    if (form.nivel < 1) {
      setFormError('O n├¡vel precisa ser no m├¡nimo 1.');
      return;
    }

    if (form.vida < 1) {
      setFormError('A vida precisa ser no m├¡nimo 1.');
      return;
    }

    if (form.mana < 0) {
      setFormError('A mana n├úo pode ser negativa.');
      return;
    }

    const normalizedForm: PlayerSheet = {
      ...form,
      personagem,
      jogador: form.jogador.trim(),
      raca: form.raca.trim(),
      motivacao: form.motivacao.trim(),
      descricao: form.descricao.trim(),
      simbolo: form.simbolo.trim() || getDefaultClassIcon(form.classe),
      habilidades: form.habilidades
        .map((ability) => ({
          nome: ability.nome.trim(),
          dificuldade: ability.dificuldade.trim(),
          mana: ability.mana.trim(),
        }))
        .filter((ability) => ability.nome || ability.dificuldade || ability.mana),
      ataques: form.ataques
        .map((attack) => ({
          arma: attack.arma.trim(),
          dano: attack.dano.trim(),
          tipo: attack.tipo.trim(),
        }))
        .filter((attack) => attack.arma || attack.dano || attack.tipo),
      equipamentos: form.equipamentos
        .map((equipment) => ({
          item: equipment.item.trim(),
          peso: equipment.peso.trim(),
          custo: equipment.custo.trim(),
        }))
        .filter(
          (equipment) => equipment.item || equipment.peso || equipment.custo,
        ),
    };

    setIsSaving(true);

    try {
      await onSavePlayer(normalizedForm);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a ficha.';

      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col gap-4 border-b-4 border-[#8b6b40] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="cinzel text-4xl font-bold text-[#c5a059]">
            Fichas de Jogadores
          </h2>

          <p className="opacity-70 italic">
            Gerencie os personagens da mesa, suas fichas, ataques, habilidades e
            equipamentos.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="dark-red-bg px-6 py-3 rounded shadow-lg border border-[#c5a059] medieval-font text-lg text-[#f4e4bc] hover:scale-105 transition-all"
        >
          + Criar Personagem
        </button>
      </header>

      <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
        {displayedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isDeleting={isDeleting}
            onEdit={() => openEditModal(player)}
            onDelete={() => deletePlayer(player.id)}
          />
        ))}
      </section>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div
            className="parchment p-8 rounded shadow-2xl max-w-5xl w-full border-4 border-[#8b6b40] relative max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-900 text-xl font-bold opacity-70 hover:opacity-100"
              aria-label="Fechar"
            >
              ├ù
            </button>

            <h3 className="cinzel text-3xl font-bold mb-6 border-b-2 border-[#8b6b40] text-red-900">
              {editingPlayer ? 'Editar Ficha' : 'Nova Ficha de Jogador'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <PlayerIdentitySection form={form} setForm={setForm} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PlayerResourcesSection form={form} setForm={setForm} />
                <PlayerAttributesSection form={form} setForm={setForm} />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PlayerDefenseSection form={form} setForm={setForm} />
                <PlayerLoadSection form={form} setForm={setForm} />
              </div>

              <PlayerAbilitiesSection form={form} setForm={setForm} />
              <PlayerAttacksSection form={form} setForm={setForm} />
              <PlayerEquipmentsSection form={form} setForm={setForm} />

              <div>
                <label className="block text-sm font-bold uppercase mb-1">
                  Descri├º├úo / Anota├º├Áes:
                </label>

                <textarea
                  value={form.descricao}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      descricao: event.target.value,
                    }))
                  }
                  className="w-full bg-white/50 border border-[#8b6b40] p-3 rounded h-28 focus:outline-none"
                  placeholder="Hist├│ria, apar├¬ncia, comportamento, v├¡nculos ou anota├º├Áes importantes."
                />
              </div>

              {formError && (
                <div className="rounded border border-red-900 bg-red-900/10 p-3 text-sm text-red-900 font-bold">
                  {formError}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving || isDeleting}
                  className="px-4 py-2 opacity-50 hover:opacity-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="dark-red-bg text-[#f4e4bc] px-6 py-2 rounded medieval-font text-lg"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Ficha'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface PlayerCardProps {
  player: PlayerSheet;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const descriptionText =
    player.descricao?.trim() || classDescriptions[player.classe];

  const motivationText = player.motivacao?.trim();

  return (
    <article className="parchment flex h-full min-h-[440px] flex-col rounded border-2 border-transparent p-5 transition-all hover:border-[#8b6b40]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#8b6b40] bg-white/30 text-4xl">
            {player.simbolo || getDefaultClassIcon(player.classe)}
          </div>

          <div className="min-w-0">
            <h3 className="medieval-font truncate text-2xl font-bold">
              {player.personagem}
            </h3>

            <p className="truncate text-sm opacity-75">
              {player.raca || 'Ra├ºa indefinida'} ÔÇó {player.classe}
            </p>

            <p className="text-xs opacity-60">N├¡vel {player.nivel}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 min-h-[72px]">
        <p className="text-sm italic leading-6 opacity-80">
          {createPreviewText(descriptionText, 115)}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 rounded bg-black/10 p-2 font-mono text-xs">
        <span>Vida: {player.vida}</span>
        <span>Mana: {player.mana}</span>

        <span>For├ºa: {player.forca}</span>
        <span>Agilidade: {player.agilidade}</span>

        <span>Int: {player.inteligencia}</span>
        <span>Von: {player.vontade}</span>

        <span>Esquiva: {player.esquiva}</span>
        <span>Det.: {player.determinacao}</span>
      </div>

      <div className="mb-4 min-h-[54px]">
        {motivationText ? (
          <p className="text-xs leading-5">
            <strong>Motiva├º├úo:</strong> {createPreviewText(motivationText, 90)}
          </p>
        ) : (
          <p className="text-xs italic opacity-50">
            Sem motiva├º├úo cadastrada.
          </p>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="rounded border border-[#8b6b40] px-3 py-2 text-sm font-bold transition hover:bg-black/10"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded bg-red-900 px-3 py-2 text-sm font-bold text-[#f4e4bc] transition hover:bg-red-950"
        >
          {isDeleting ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </article>
  );
};

interface FormSectionProps {
  form: PlayerSheet;
  setForm: React.Dispatch<React.SetStateAction<PlayerSheet>>;
}

const PlayerIdentitySection: React.FC<FormSectionProps> = ({ form, setForm }) => {
  return (
    <section>
      <h4 className="medieval-font text-xl font-bold text-red-900 mb-3">
        Identidade
      </h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          label="Personagem"
          value={form.personagem}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              personagem: value,
            }))
          }
          placeholder="Nome do personagem"
          required
        />

        <TextField
          label="Jogador"
          value={form.jogador}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              jogador: value,
            }))
          }
          placeholder="Nome do jogador"
        />

        <TextField
          label="Ra├ºa"
          value={form.raca}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              raca: value,
            }))
          }
          placeholder="Humano, Elfo, An├úo..."
        />

        <div>
          <label className="block text-xs font-bold mb-1">Classe:</label>

          <select
            value={form.classe}
            onChange={(event) => {
              const newClass = event.target.value as PlayerClass;

              setForm((currentForm) => ({
                ...currentForm,
                classe: newClass,
                simbolo:
                  currentForm.simbolo.trim() === '' ||
                  currentForm.simbolo === getDefaultClassIcon(currentForm.classe)
                    ? getDefaultClassIcon(newClass)
                    : currentForm.simbolo,
              }));
            }}
            className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded text-sm"
          >
            <option value="Arqueiro">Arqueiro</option>
            <option value="Guerreiro">Guerreiro</option>
            <option value="Ladino">Ladino</option>
            <option value="Mago">Mago</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <NumberField
          label="Experi├¬ncia"
          value={form.experiencia}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              experiencia: value,
            }))
          }
        />

        <NumberField
          label="N├¡vel"
          value={form.nivel}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              nivel: value,
            }))
          }
        />

        <TextField
          label="Desenho / S├¡mbolo"
          value={form.simbolo}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              simbolo: value,
            }))
          }
          placeholder="­ƒÅ╣, ­ƒøí´©Å, ­ƒùí´©Å, ­ƒö«..."
        />

        <TextField
          label="Motiva├º├úo"
          value={form.motivacao}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              motivacao: value,
            }))
          }
          placeholder="O que move o personagem?"
        />
      </div>
    </section>
  );
};

const PlayerResourcesSection: React.FC<FormSectionProps> = ({ form, setForm }) => {
  return (
    <section>
      <h4 className="medieval-font text-xl font-bold text-red-900 mb-3">
        Vida e Mana
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Vida"
          value={form.vida}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              vida: value,
            }))
          }
        />

        <NumberField
          label="Mana"
          value={form.mana}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              mana: value,
            }))
          }
        />
      </div>
    </section>
  );
};

const PlayerAttributesSection: React.FC<FormSectionProps> = ({
  form,
  setForm,
}) => {
  return (
    <section>
      <h4 className="medieval-font text-xl font-bold text-red-900 mb-3">
        Atributos
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="For├ºa"
          value={form.forca}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              forca: value,
            }))
          }
        />

        <NumberField
          label="Agilidade"
          value={form.agilidade}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              agilidade: value,
            }))
          }
        />

        <NumberField
          label="Intelig├¬ncia"
          value={form.inteligencia}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              inteligencia: value,
            }))
          }
        />

        <NumberField
          label="Vontade"
          value={form.vontade}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              vontade: value,
            }))
          }
        />
      </div>
    </section>
  );
};

const PlayerDefenseSection: React.FC<FormSectionProps> = ({ form, setForm }) => {
  return (
    <section>
      <h4 className="medieval-font text-xl font-bold text-red-900 mb-3">
        Defesa
      </h4>

      <div className="grid grid-cols-3 gap-4">
        <NumberField
          label="Bloqueio"
          value={form.bloqueio}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              bloqueio: value,
            }))
          }
        />

        <NumberField
          label="Esquiva"
          value={form.esquiva}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              esquiva: value,
            }))
          }
        />

        <NumberField
          label="Determina├º├úo"
          value={form.determinacao}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              determinacao: value,
            }))
          }
        />
      </div>
    </section>
  );
};

const PlayerLoadSection: React.FC<FormSectionProps> = ({ form, setForm }) => {
  return (
    <section>
      <h4 className="medieval-font text-xl font-bold text-red-900 mb-3">
        Carga
      </h4>

      <div className="grid grid-cols-3 gap-4">
        <NumberField
          label="B├ísica"
          value={form.cargaBasica}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              cargaBasica: value,
            }))
          }
        />

        <NumberField
          label="Pesada"
          value={form.cargaPesada}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              cargaPesada: value,
            }))
          }
        />

        <NumberField
          label="M├íxima"
          value={form.cargaMaxima}
          onChange={(value) =>
            setForm((currentForm) => ({
              ...currentForm,
              cargaMaxima: value,
            }))
          }
        />
      </div>
    </section>
  );
};

const PlayerAbilitiesSection: React.FC<FormSectionProps> = ({
  form,
  setForm,
}) => {
  function addAbility() {
    setForm((currentForm) => ({
      ...currentForm,
      habilidades: [
        ...currentForm.habilidades,
        {
          nome: '',
          dificuldade: '',
          mana: '',
        },
      ],
    }));
  }

  function removeAbility(index: number) {
    setForm((currentForm) => {
      if (currentForm.habilidades.length === 1) {
        return currentForm;
      }

      return {
        ...currentForm,
        habilidades: currentForm.habilidades.filter(
          (_, abilityIndex) => abilityIndex !== index,
        ),
      };
    });
  }

  function updateAbility(index: number, field: keyof Ability, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      habilidades: currentForm.habilidades.map((ability, abilityIndex) => {
        if (abilityIndex !== index) {
          return ability;
        }

        return {
          ...ability,
          [field]: value,
        };
      }),
    }));
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="medieval-font text-xl font-bold text-red-900">
          Habilidades
        </h4>

        <button
          type="button"
          onClick={addAbility}
          className="dark-red-bg text-[#f4e4bc] px-3 py-1 rounded medieval-font text-sm"
        >
          + Habilidade
        </button>
      </div>

      <div className="space-y-3">
        {form.habilidades.map((ability, index) => (
          <div
            key={index}
            className="border border-[#8b6b40] rounded p-3 bg-white/20"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm">Habilidade {index + 1}</span>

              {form.habilidades.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAbility(index)}
                  className="text-red-900 text-sm font-bold"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField
                label="Nome"
                value={ability.nome}
                onChange={(value) => updateAbility(index, 'nome', value)}
                placeholder="Nome da habilidade"
              />

              <TextField
                label="Dif."
                value={ability.dificuldade}
                onChange={(value) =>
                  updateAbility(index, 'dificuldade', value)
                }
                placeholder="10, 12, ÔÇö"
              />

              <TextField
                label="Mana"
                value={ability.mana}
                onChange={(value) => updateAbility(index, 'mana', value)}
                placeholder="2, 5, ÔÇö"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PlayerAttacksSection: React.FC<FormSectionProps> = ({ form, setForm }) => {
  function addAttack() {
    setForm((currentForm) => ({
      ...currentForm,
      ataques: [
        ...currentForm.ataques,
        {
          arma: '',
          dano: '',
          tipo: '',
        },
      ],
    }));
  }

  function removeAttack(index: number) {
    setForm((currentForm) => {
      if (currentForm.ataques.length === 1) {
        return currentForm;
      }

      return {
        ...currentForm,
        ataques: currentForm.ataques.filter(
          (_, attackIndex) => attackIndex !== index,
        ),
      };
    });
  }

  function updateAttack(index: number, field: keyof Attack, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      ataques: currentForm.ataques.map((attack, attackIndex) => {
        if (attackIndex !== index) {
          return attack;
        }

        return {
          ...attack,
          [field]: value,
        };
      }),
    }));
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="medieval-font text-xl font-bold text-red-900">
          Ataque
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
        {form.ataques.map((attack, index) => (
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField
                label="Arma"
                value={attack.arma}
                onChange={(value) => updateAttack(index, 'arma', value)}
                placeholder="Espada, arco, cajado..."
              />

              <TextField
                label="Dano"
                value={attack.dano}
                onChange={(value) => updateAttack(index, 'dano', value)}
                placeholder="For+2, Agi+1..."
              />

              <TextField
                label="Tipo"
                value={attack.tipo}
                onChange={(value) => updateAttack(index, 'tipo', value)}
                placeholder="Corte, perfura├º├úo..."
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PlayerEquipmentsSection: React.FC<FormSectionProps> = ({
  form,
  setForm,
}) => {
  function addEquipment() {
    setForm((currentForm) => ({
      ...currentForm,
      equipamentos: [
        ...currentForm.equipamentos,
        {
          item: '',
          peso: '',
          custo: '',
        },
      ],
    }));
  }

  function removeEquipment(index: number) {
    setForm((currentForm) => {
      if (currentForm.equipamentos.length === 1) {
        return currentForm;
      }

      return {
        ...currentForm,
        equipamentos: currentForm.equipamentos.filter(
          (_, equipmentIndex) => equipmentIndex !== index,
        ),
      };
    });
  }

  function updateEquipment(
    index: number,
    field: keyof Equipment,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      equipamentos: currentForm.equipamentos.map(
        (equipment, equipmentIndex) => {
          if (equipmentIndex !== index) {
            return equipment;
          }

          return {
            ...equipment,
            [field]: value,
          };
        },
      ),
    }));
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="medieval-font text-xl font-bold text-red-900">
          Equipamento
        </h4>

        <button
          type="button"
          onClick={addEquipment}
          className="dark-red-bg text-[#f4e4bc] px-3 py-1 rounded medieval-font text-sm"
        >
          + Equipamento
        </button>
      </div>

      <div className="space-y-3">
        {form.equipamentos.map((equipment, index) => (
          <div
            key={index}
            className="border border-[#8b6b40] rounded p-3 bg-white/20"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm">Equipamento {index + 1}</span>

              {form.equipamentos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEquipment(index)}
                  className="text-red-900 text-sm font-bold"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField
                label="Item"
                value={equipment.item}
                onChange={(value) => updateEquipment(index, 'item', value)}
                placeholder="Item"
              />

              <TextField
                label="Peso"
                value={equipment.peso}
                onChange={(value) => updateEquipment(index, 'peso', value)}
                placeholder="Peso"
              />

              <TextField
                label="Custo"
                value={equipment.custo}
                onChange={(value) => updateEquipment(index, 'custo', value)}
                placeholder="Custo"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
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
        className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded text-sm"
      />
    </div>
  );
};

interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  placeholder,
  required,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">{label}:</label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/50 border border-[#8b6b40] p-2 rounded text-sm"
      />
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

function createPreviewText(text: string, maxLength: number) {
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  if (normalizedText.length <= maxLength) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, maxLength).trim()}... leia mais`;
}

function clonePlayer(player: PlayerSheet): PlayerSheet {
  return {
    ...player,
    habilidades: Array.isArray(player.habilidades)
      ? player.habilidades.map((ability) => ({ ...ability }))
      : [],
    ataques: Array.isArray(player.ataques)
      ? player.ataques.map((attack) => ({ ...attack }))
      : [],
    equipamentos: Array.isArray(player.equipamentos)
      ? player.equipamentos.map((equipment) => ({ ...equipment }))
      : [],
  };
}

function getDefaultClassIcon(playerClass: PlayerClass) {
  switch (playerClass) {
    case 'Arqueiro':
      return '­ƒÅ╣';
    case 'Guerreiro':
      return '­ƒøí´©Å';
    case 'Ladino':
      return '­ƒùí´©Å';
    case 'Mago':
      return '­ƒö«';
    default:
      return '­ƒæñ';
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return String(Date.now());
}

export default PlayerSheets;
