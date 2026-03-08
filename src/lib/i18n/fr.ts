import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "Français",

  // Base translations (top-level)
  title: "Tableau des prix de l'API LLM",
  description: "Tableau de comparaison des prix de l'API LLM",
  modelList: "Liste des modèles",
  modelsCount: "modèles",
  lastUpdated: "Dernière mise à jour",
  priceLabel: "Prix: $/1M Token",
  searchPlaceholder: "Rechercher par nom de modèle",
  showId: "Afficher l'ID",
  copyId: "Copier l'ID",
  copyName: "Copier le nom du modèle",
  addToComparison: "Ajouter à la comparaison",
  selected: "Sélectionné",
  noModelsFound:
    "Aucun modèle sélectionné. Veuillez en sélectionner dans la liste des modèles.",
  comparisonTitle: "Comparaison",
  clearAll: "Tout effacer",
  deleteModel: "Supprimer le modèle",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Nom du modèle",
    contextLength: "Longueur du contexte",
    createdAt: "Créé le",
    input: "Entrée",
    output: "Sortie",
    inputCacheRead: "Lecture du cache d'entrée",
    inputCacheWrite: "Écriture du cache d'entrée",
    inputModalities: "Modalités d'entrée",
    outputModalities: "Modalités de sortie",
  },
} satisfies TranslationSchema;
