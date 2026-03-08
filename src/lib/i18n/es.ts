import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "Español",

  // Base translations (top-level)
  title: "Tabla de precios de API de LLM",
  description: "Tabla comparativa de precios de API de LLM",
  modelList: "Lista de modelos",
  modelsCount: "modelos",
  lastUpdated: "Última actualización",
  priceLabel: "Precio: $/1M Token",
  searchPlaceholder: "Buscar por nombre de modelo",
  showId: "Mostrar ID",
  copyId: "Copiar ID",
  copyName: "Copiar nombre del modelo",
  addToComparison: "Añadir a la comparación",
  selected: "Seleccionado",
  noModelsFound:
    "No hay modelos seleccionados. Por favor, seleccione de la lista de modelos.",
  comparisonTitle: "Comparación",
  clearAll: "Borrar todo",
  deleteModel: "Eliminar modelo",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "Nombre del modelo",
    contextLength: "Longitud de contexto",
    createdAt: "Creado el",
    input: "Entrada",
    output: "Salida",
    inputCacheRead: "Lectura de caché de entrada",
    inputCacheWrite: "Escritura de caché de entrada",
    inputModalities: "Modalidades de entrada",
    outputModalities: "Modalidades de salida",
  },
} satisfies TranslationSchema;
