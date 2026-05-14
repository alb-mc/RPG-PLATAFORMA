
export type Section = 'dashboard' | 'narrator' | 'rules' | 'monsters' | 'items' | 'shops' | 'maps';

export interface AttributeStats {
  forca: number;
  agilidade: number;
  inteligencia: number;
  vontade: number;
}

export interface Monster {
  id: string;
  nome: string;
  descricao: string;
  stats: AttributeStats;
  habilidades: string[];
  drops: string[];
  nivel: number;
}

export interface Item {
  id: string;
  nome: string;
  tipo: 'arma' | 'armadura' | 'magico' | 'consumivel';
  raridade: 'comum' | 'incomum' | 'raro' | 'lendario';
  descricao: string;
  efeitoMecanico: string;
  peso: number;
  preco: number;
}

export interface Shop {
  id: string;
  nome: string;
  npcDono: string;
  localizacao: string;
  estiloNarrativo: string;
  estoqueIds: string[];
}

export interface MapData {
  id: string;
  nome: string;
  regiao: string;
  imageUrl: string;
  anotacoes: string;
  markers: MapMarker[];
}

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  descricao: string;
}

export interface RulePDF {
  id: string;
  name: string;
  content: string; // Extracted text for IA context
  fileUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
