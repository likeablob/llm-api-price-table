export const dict = {
  localeName: "English",

  // Base translations (top-level)
  title: "LLM API Price Table",
  description: "LLM API price comparison table",
  modelList: "Model List",
  modelsCount: "models",
  lastUpdated: "Last Updated",
  priceLabel: "Price: $/1M Token",
  searchPlaceholder: "Search by model name",
  showId: "Show ID",
  copyId: "Copy ID",
  copyName: "Copy model name",
  addToComparison: "Add to comparison",
  selected: "Selected",
  noModelsFound: "No models selected. Please select from the model list.",
  comparisonTitle: "Comparison",
  clearAll: "Clear All",
  deleteModel: "Delete model",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Model Name",
    contextLength: "Context Length",
    createdAt: "Created At",
    input: "Input",
    output: "Output",
    inputCacheRead: "Input Cache Read",
    inputCacheWrite: "Input Cache Write",
    inputModalities: "Input Modalities",
    outputModalities: "Output Modalities",
  },
} as const;

type NestedKeys<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${keyof T[K] & string}`
    : K & string;
}[keyof T];

export type TranslationKey = NestedKeys<typeof dict>;

type DictType = typeof dict;

export type TranslationSchema = {
  [K in keyof DictType]: DictType[K] extends object
    ? { [NK in keyof DictType[K]]: string }
    : string;
};
