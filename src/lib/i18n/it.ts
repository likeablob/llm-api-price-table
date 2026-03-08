import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "Italiano",

  // Base translations (top-level)
  title: "Tabella dei prezzi delle API LLM",
  description: "Tabella di confronto dei prezzi delle API LLM",
  modelList: "Elenco modelli",
  modelsCount: "modelli",
  lastUpdated: "Ultimo aggiornamento",
  priceLabel: "Prezzo: $/1M Token",
  searchPlaceholder: "Cerca per nome del modello",
  showId: "Mostra ID",
  copyId: "Copia ID",
  copyName: "Copia nome modello",
  addToComparison: "Aggiungi al confronto",
  selected: "Selezionato",
  noModelsFound:
    "Nessun modello selezionato. Selezionane uno dall'elenco dei modelli.",
  comparisonTitle: "Confronto",
  clearAll: "Cancella tutto",
  deleteModel: "Elimina modello",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Nome del modello",
    contextLength: "Lunghezza del contesto",
    createdAt: "Creato il",
    input: "Input",
    output: "Output",
    inputCacheRead: "Lettura cache di input",
    inputCacheWrite: "Scrittura cache di input",
    inputModalities: "Modalità di input",
    outputModalities: "Modalità di output",
  },
} satisfies TranslationSchema;
