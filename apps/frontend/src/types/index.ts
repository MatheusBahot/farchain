// ============================================================
// FARCHAIN — Tipos TypeScript Compartilhados
// ============================================================

export type Role =
  | 'SUPER_ADMIN' | 'ADMIN' | 'GESTOR_ESTADUAL' | 'GESTOR_MUNICIPAL'
  | 'FARMACEUTICO' | 'OPERADOR_CAF' | 'AUDITOR' | 'VISUALIZADOR' | 'PACIENTE';

export type StatusLote =
  | 'ATIVO' | 'QUARENTENA' | 'BLOQUEADO' | 'VENCIDO'
  | 'RECOLHIDO' | 'DESCARTADO' | 'DEVOLVIDO';

export type TipoMovimentacao =
  | 'ENTRADA_ESTOQUE' | 'SAIDA_DISTRIBUICAO' | 'TRANSFERENCIA_INTERNA'
  | 'DISPENSACAO_PACIENTE' | 'DEVOLUCAO_PACIENTE' | 'DEVOLUCAO_FORNECEDOR'
  | 'PERDA' | 'VENCIMENTO' | 'DESCARTE' | 'BLOQUEIO_SANITARIO'
  | 'RECOLHIMENTO' | 'AJUSTE_INVENTARIO';

export type ClasseCEAF =
  | 'COMPONENTE_I_A' | 'COMPONENTE_I_B' | 'COMPONENTE_II' | 'COMPONENTE_III';

export type FormaFarmaceutica =
  | 'COMPRIMIDO' | 'CAPSULA' | 'SOLUCAO_ORAL' | 'SOLUCAO_INJETAVEL'
  | 'SUSPENSAO_ORAL' | 'POMADA' | 'CREME' | 'GEL' | 'INALACAO'
  | 'SUPOSITORIO' | 'ADESIVO_TRANSDERMICO' | 'PO_INJETAVEL'
  | 'FRASCO_AMPOLA' | 'SERINGA_PREENCHIDA' | 'CANETA_APLICADORA';

export type StatusFarmacovigilancia =
  | 'ABERTO' | 'EM_INVESTIGACAO' | 'ENCERRADO' | 'NOTIFICADO_ANVISA';

export interface Medicamento {
  id: string;
  dcb: string;
  nomeComercial?: string;
  principioAtivo: string;
  fabricante: string;
  distribuidor?: string;
  registroSanitario?: string;
  classeTerapeutica: string;
  formaFarmaceutica: FormaFarmaceutica;
  concentracao: string;
  apresentacao: string;
  viaAdministracao?: string;
  classeCEAF: ClasseCEAF;
  protocoloClinico?: string;
  cid10?: string;
  temperaturaMin?: number;
  temperaturaMax?: number;
  requireCadeiaFria: boolean;
  condicoesArmazenamento?: string;
  custoCentral?: number;
  ativo: boolean;
  createdAt: string;
  _count?: { lotes: number };
}

export interface Lote {
  id: string;
  identificadorUnico: string;
  numeroLote: string;
  medicamentoId: string;
  fabricante: string;
  dataFabricacao: string;
  dataValidade: string;
  quantidadeProduzida: number;
  quantidadeRecebida: number;
  statusSanitario: StatusLote;
  hashCriptografico: string;
  qrCodeHash?: string;
  qrCodeUrl?: string;
  notaFiscal?: string;
  observacoes?: string;
  createdAt: string;
  medicamento: Medicamento;
  estoque?: EstoqueLote[];
  _count?: { movimentacoes: number; dispensacoes: number };
}

export interface EstoqueLote {
  id: string;
  loteId: string;
  unidadeId: string;
  quantidade: number;
  localizacao?: string;
  unidade?: UnidadeSaude;
}

export interface Movimentacao {
  id: string;
  loteId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  origemId?: string;
  destinoId?: string;
  usuarioId: string;
  justificativa?: string;
  documentoRef?: string;
  createdAt: string;
  lote?: { medicamento: { dcb: string; nomeComercial?: string } };
  origem?: { nome: string };
  destino?: { nome: string };
  usuario?: { nome: string };
}

export interface Dispensacao {
  id: string;
  loteId: string;
  medicamentoId: string;
  pacienteId: string;
  unidadeId: string;
  usuarioId: string;
  quantidade: number;
  dataDispensacao: string;
  dosagem?: string;
  duracaoTratamento?: string;
  cid10?: string;
  prescricaoRef?: string;
  medicamento?: { dcb: string; nomeComercial?: string };
  unidade?: { nome: string };
  usuario?: { nome: string };
  lote?: { numeroLote: string };
}

export interface UnidadeSaude {
  id: string;
  cnes?: string;
  nome: string;
  tipo: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  latitude?: number;
  longitude?: number;
  ehCAF: boolean;
  ativo: boolean;
  distritoId?: string;
  distrito?: { nome: string };
}

export interface DistritoSanitario {
  id: string;
  codigo: string;
  nome: string;
  municipio: string;
  populacao?: number;
  unidades?: UnidadeSaude[];
  _count?: { unidades: number };
}

export interface BlocoBlockchain {
  id: string;
  indice: number;
  timestamp: string;
  hashAnterior: string;
  hashAtual: string;
  nonce: number;
  dificuldade: number;
  dadosJson: string;
  validado: boolean;
  createdAt: string;
  eventos?: EventoBlockchain[];
}

export interface EventoBlockchain {
  id: string;
  blocoId?: string;
  tipoEvento: string;
  entidadeId: string;
  entidadeTipo: string;
  dados: string;
  hashDados: string;
  timestamp: string;
  bloco?: BlocoBlockchain;
  usuario?: { nome: string; role: string };
}

export interface FarmacoVigilancia {
  id: string;
  loteId: string;
  usuarioId: string;
  tipoEvento: string;
  descricao: string;
  gravidade: string;
  status: StatusFarmacovigilancia;
  dataCadastro: string;
  dataOcorrencia: string;
  acaoTomada?: string;
  notificacaoRef?: string;
  resolucao?: string;
  lote?: { numeroLote: string; medicamento: { dcb: string } };
  usuario?: { nome: string };
}

export interface AuditLog {
  id: string;
  usuarioId?: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  valorAntes?: string;
  valorDepois?: string;
  ip?: string;
  timestamp: string;
  usuario?: { nome: string; email: string; role: string };
}

export interface PaginatedResponse<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas?: number;
}

export interface DashboardResumo {
  medicamentos: { total: number };
  lotes: { total: number; ativos: number; vencendo30Dias: number };
  blockchain: { totalBlocos: number };
  dispensacoes: { total: number; ultimos30Dias: number };
  farmacovigilancia: { total: number; abertos: number };
  unidades: { total: number };
  alertas: { estoqueBaixo: number };
}
