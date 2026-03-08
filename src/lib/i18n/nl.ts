import type { TranslationSchema } from "./en";

export const localeName = "Nederlands" as const;

export const dict = {
  localeName: "Nederlands",

  // Base translations (top-level)
  title: "LLM API Prijstabel",
  description: "LLM API prijsvergelijkingstabel",
  modelList: "Modellijst",
  modelsCount: "modellen",
  lastUpdated: "Laatst bijgewerkt",
  priceLabel: "Prijs: $/1M Token",
  searchPlaceholder: "Zoek op modelnaam",
  showId: "Toon ID",
  copyId: "Kopieer ID",
  copyName: "Kopieer modelnaam",
  addToComparison: "Toevoegen aan vergelijking",
  selected: "Geselecteerd",
  noModelsFound: "Geen modellen geselecteerd. Selecteer uit de modellijst.",
  comparisonTitle: "Vergelijking",
  clearAll: "Alles wissen",
  deleteModel: "Verwijder model",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Modelnaam",
    contextLength: "Contextlengte",
    createdAt: "Aangemaakt op",
    input: "Invoer",
    output: "Uitvoer",
    inputCacheRead: "Invoer cache lezen",
    inputCacheWrite: "Invoer cache schrijven",
    inputModalities: "Invoermodaliteiten",
    outputModalities: "Uitvoermodaliteiten",
  },
} satisfies TranslationSchema;
