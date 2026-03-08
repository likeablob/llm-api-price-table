import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "Deutsch",

  // Base translations (top-level)
  title: "LLM API Preistabelle",
  description: "Vergleichstabelle für LLM API Preise",
  modelList: "Modellliste",
  modelsCount: "Modelle",
  lastUpdated: "Zuletzt aktualisiert",
  priceLabel: "Preis: $/1M Token",
  searchPlaceholder: "Nach Modellnamen suchen",
  showId: "ID anzeigen",
  copyId: "ID kopieren",
  copyName: "Modellnamen kopieren",
  addToComparison: "Zum Vergleich hinzufügen",
  selected: "Ausgewählt",
  noModelsFound:
    "Keine Modelle ausgewählt. Bitte wählen Sie aus der Modellliste.",
  comparisonTitle: "Vergleich",
  clearAll: "Alle löschen",
  deleteModel: "Modell löschen",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Modellname",
    contextLength: "Kontextlänge",
    createdAt: "Erstellt am",
    input: "Eingabe",
    output: "Ausgabe",
    inputCacheRead: "Eingabe-Cache-Lesen",
    inputCacheWrite: "Eingabe-Cache-Schreiben",
    inputModalities: "Eingabemodalitäten",
    outputModalities: "Ausgabemodalitäten",
  },
} satisfies TranslationSchema;
