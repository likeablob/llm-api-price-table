import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "Português",

  // Base translations (top-level)
  title: "Tabela de Preços da API LLM",
  description: "Tabela de comparação de preços da API LLM",
  modelList: "Lista de Modelos",
  modelsCount: "modelos",
  lastUpdated: "Última Atualização",
  priceLabel: "Preço: $/1M Token",
  searchPlaceholder: "Pesquisar por nome do modelo",
  showId: "Mostrar ID",
  copyId: "Copiar ID",
  copyName: "Copiar nome do modelo",
  addToComparison: "Adicionar à comparação",
  selected: "Selecionado",
  noModelsFound:
    "Nenhum modelo selecionado. Por favor, selecione na lista de modelos.",
  comparisonTitle: "Comparação",
  clearAll: "Limpar Tudo",
  deleteModel: "Eliminar modelo",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Nome do Modelo",
    contextLength: "Comprimento do Contexto",
    createdAt: "Criado em",
    input: "Entrada",
    output: "Saída",
    inputCacheRead: "Leitura de Cache de Entrada",
    inputCacheWrite: "Escrita de Cache de Entrada",
    inputModalities: "Modalidades de Entrada",
    outputModalities: "Modalidades de Saída",
  },
} satisfies TranslationSchema;
