import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "日本語",

  // Base translations (top-level)
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
  noModelsFound: "モデルが選択されていません。モデル一覧から選択してください。",
  comparisonTitle: "比較",
  clearAll: "すべてクリア",
  deleteModel: "モデルを削除",

  // Table headers (grouped)
  tableHeaders: {
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
} satisfies TranslationSchema;
