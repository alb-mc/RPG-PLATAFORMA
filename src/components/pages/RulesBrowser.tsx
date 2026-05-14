import React, { useEffect, useMemo, useState } from 'react';
import type { RulePDF } from '../../types/types';

interface RulesBrowserProps {
  pdfs: RulePDF[];
  setPdfs: React.Dispatch<React.SetStateAction<RulePDF[]>>;
}

interface RuleTopic {
  id: string;
  label: string;
  page: number;
}

interface RuleBook {
  id: string;
  name: string;
  shortName: string;
  description: string;
  fileUrl: string;
  topics: RuleTopic[];
}

const RULE_BOOKS: RuleBook[] = [
  {
    id: 'basico',
    name: 'Mighty Blade - Livro Básico',
    shortName: 'Livro Básico',
    description: 'Livro principal de regras do Mighty Blade.',
    fileUrl: '/rules/mighty-blade-basico.pdf',
    topics: [
      { id: 'introducao', label: 'Introdução', page: 9 },
      { id: 'regras', label: 'Regras', page: 11 },
      { id: 'racas', label: 'Raças', page: 43 },
      { id: 'classes', label: 'Classes', page: 77 },
      { id: 'mestre', label: 'Mestre', page: 147 },
      { id: 'equipamento', label: 'Equipamento', page: 153 },
      { id: 'condicoes', label: 'Condições', page: 171 },
      { id: 'habilidades', label: 'Habilidades', page: 175 },
      { id: 'ficha', label: 'Ficha', page: 177 },
    ],
  },
  {
    id: 'iniciante',
    name: 'Mighty Blade - Guia do Iniciante',
    shortName: 'Iniciante',
    description: 'Guia introdutório para jogadores iniciantes.',
    fileUrl: '/rules/mighty-blade-iniciante.pdf',
    topics: [
      { id: 'introducao', label: 'Introdução', page: 4 },
      { id: 'racas', label: 'Raças', page: 25 },
      { id: 'classes', label: 'Classes', page: 37 },
      { id: 'mestre', label: 'Mestre', page: 67 },
      { id: 'equipamento', label: 'Equipamento', page: 71 },
      { id: 'condicoes', label: 'Condições', page: 84 },
      { id: 'ficha', label: 'Ficha', page: 87 },
    ],
  },
  {
    id: 'combatente',
    name: 'Mighty Blade - Manual do Combatente',
    shortName: 'Combatente',
    description: 'Manual focado em combate, personagens e equipamentos.',
    fileUrl: '/rules/mighty-blade-combatente.pdf',
    topics: [
      { id: 'regras', label: 'Regras', page: 7 },
      { id: 'personagens', label: 'Personagens', page: 29 },
      { id: 'equipamento', label: 'Equipamento', page: 47 },
    ],
  },
  {
    id: 'monstros',
    name: 'Mighty Blade - Monstros',
    shortName: 'Monstros',
    description: 'Bestiário, criaturas, habilidades e equipamentos.',
    fileUrl: '/rules/mighty-blade-monstros.pdf',
    topics: [
      { id: 'regras', label: 'Regras', page: 7 },
      { id: 'criaturas', label: 'Criaturas', page: 19 },
      { id: 'idiossincrasias', label: 'Idiossincrasias', page: 145 },
      { id: 'equipamento', label: 'Equipamento', page: 155 },
      { id: 'habilidades', label: 'Habilidades', page: 159 },
      {
        id: 'habilidades-atualizadas',
        label: 'Habilidades Atualizadas',
        page: 175,
      },
      {
        id: 'indice-remissivo-criaturas',
        label: 'Índice Remissivo de Criaturas',
        page: 179,
      },
    ],
  },
  {
    id: 'magia',
    name: 'Mighty Blade - Magia',
    shortName: 'Magia',
    description: 'Livro focado em magia e regras mágicas.',
    fileUrl: '/rules/mighty-blade-magia.pdf',
    topics: [
      { id: 'magia', label: 'Magia', page: 7 },
      { id: 'regras', label: 'Regras', page: 12 },
    ],
  },
  {
    id: 'monstros-extra',
    name: 'Mighty Blade - Monstros Extras',
    shortName: 'Monstros Extras',
    description: 'Conteúdo extra de criaturas.',
    fileUrl: '/rules/mighty-blade-monstrons-extras.pdf',
    topics: [],
  },
];

const RulesBrowser: React.FC<RulesBrowserProps> = ({
  pdfs: _pdfs,
  setPdfs: _setPdfs,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(RULE_BOOKS[0].id);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [viewerKey, setViewerKey] = useState<number>(0);
  const [isCompactScreen, setIsCompactScreen] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateScreenSize = () => {
      setIsCompactScreen(mediaQuery.matches);
    };

    updateScreenSize();

    mediaQuery.addEventListener('change', updateScreenSize);

    return () => {
      mediaQuery.removeEventListener('change', updateScreenSize);
    };
  }, []);

  const selectedBook = useMemo(() => {
    return RULE_BOOKS.find((book) => book.id === selectedBookId) ?? RULE_BOOKS[0];
  }, [selectedBookId]);

  const pdfViewerUrl = useMemo(() => {
    const zoomValue = isCompactScreen ? 67 : 125;

    const hashParams: string[] = [
      'pagemode=none',
      `zoom=${zoomValue}`,
      `page=${selectedPage}`,
    ];

    return `${selectedBook.fileUrl}#${hashParams.join('&')}`;
  }, [selectedBook.fileUrl, selectedPage, viewerKey, isCompactScreen]);

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedPage(1);
    setViewerKey((currentValue) => currentValue + 1);
  };

  const handleSelectTopic = (topic: RuleTopic) => {
    setSelectedPage(topic.page);
    setViewerKey((currentValue) => currentValue + 1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-3 lg:space-y-4">
      <header className="flex flex-col gap-2 border-b-2 border-[#8b6b40] pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="cinzel text-2xl font-bold text-[#c5a059] md:text-3xl">
            Biblioteca de Regras
          </h2>

          <p className="text-sm italic opacity-70">
            "Conhecimento é a arma mais afiada do herói."
          </p>
        </div>

        <div className="dark-red-bg rounded border border-[#c5a059] px-4 py-2 text-sm shadow-lg medieval-font text-[#f4e4bc] md:text-base">
          Mighty Blade
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 lg:gap-5">
        <aside className="space-y-3 lg:col-span-1">
          <div className="wood-panel rounded p-3">
            <h4 className="medieval-font mb-2 text-base text-[#c5a059]">
              Livros de Regras
            </h4>

            <div className="space-y-1.5">
              {RULE_BOOKS.map((book) => {
                const isSelected = book.id === selectedBook.id;

                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book.id)}
                    className={[
                      'w-full rounded border px-2.5 py-1.5 text-left transition-all',
                      isSelected
                        ? 'border-[#c5a059] bg-[#5a0a0a] text-[#f4e4bc]'
                        : 'border-[#8b6b40] bg-[#1a0f0a] text-[#d1b894] hover:bg-[#8b6b40]/20',
                    ].join(' ')}
                    title={book.name}
                  >
                    <span className="block truncate medieval-font text-sm leading-5">
                      📖 {book.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="wood-panel rounded p-3">
            <h4 className="medieval-font mb-2 text-base text-[#c5a059]">
              Tópicos Sugeridos
            </h4>

            {selectedBook.topics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 text-xs">
                {selectedBook.topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className="rounded border border-[#8b6b40] bg-[#1a0f0a] px-2 py-1 transition-colors hover:bg-[#8b6b40]/20"
                    title={`Ir para página ${topic.page}`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs italic opacity-60">
                Este livro ainda não possui tópicos cadastrados.
              </p>
            )}
          </div>
        </aside>

        <section className="-mx-3 lg:col-span-3 lg:mx-0">
          <div className="parchment min-h-[calc(100vh-96px)] overflow-hidden rounded-md lg:min-h-[820px] lg:rounded-lg">
            <iframe
              key={`${selectedBook.id}-${selectedPage}-${viewerKey}-${isCompactScreen ? 'mobile' : 'desktop'}`}
              src={pdfViewerUrl}
              title={`Visualizador do PDF ${selectedBook.name}`}
              className="h-[calc(100vh-96px)] min-h-[720px] w-full border-0 bg-white lg:h-[820px]"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default RulesBrowser;