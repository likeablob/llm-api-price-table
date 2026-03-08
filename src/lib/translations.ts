export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

const baseTranslations = {
  en: {
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
  },
  ja: {
    title: "LLM API 価格表",
    description: "LLM API 価格比較表",
    modelList: "モデル一覧",
    modelsCount: "個のモデル",
    lastUpdated: "最終更新",
    priceLabel: "価格：$/1M Token",
    searchPlaceholder: "モデル名で検索",
    showId: "ID 表示",
    copyId: "ID をコピー",
    copyName: "モデル名をコピー",
    addToComparison: "比較に追加",
    selected: "選択済み",
    noModelsFound:
      "モデルが選択されていません。モデル一覧から選択してください。",
    comparisonTitle: "比較",
    clearAll: "すべてクリア",
    deleteModel: "モデルを削除",
  },
} as const;

const tableHeaders = {
  en: {
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
  ja: {
    modelName: "モデル名",
    contextLength: "コンテキスト長",
    createdAt: "作成日",
    input: "入力",
    output: "出力",
    inputCacheRead: "入力キャッシュ読み取り",
    inputCacheWrite: "入力キャッシュ書き込み",
    inputModalities: "入力モダリティ",
    outputModalities: "出力モダリティ",
  },
} as const;

export const translations = {
  en: { ...baseTranslations.en, ...tableHeaders.en },
  ja: { ...baseTranslations.ja, ...tableHeaders.ja },
} as const;

export type TranslationKey = keyof typeof baseTranslations.en;
export type TableHeaderKey = keyof typeof tableHeaders.en;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}

export function tTableHeader(locale: Locale, key: TableHeaderKey): string {
  return translations[locale][key] ?? translations.en[key];
}
