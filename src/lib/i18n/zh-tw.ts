import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "繁體中文",

  // Base translations (top-level)
  title: "LLM API 價格表",
  description: "LLM API 價格對比表",
  modelList: "模型列表",
  modelsCount: "個模型",
  lastUpdated: "最後更新",
  priceLabel: "價格：$/1M Token",
  searchPlaceholder: "按模型名稱搜索",
  showId: "顯示 ID",
  copyId: "複製 ID",
  copyName: "複製模型名稱",
  addToComparison: "添加到對比",
  selected: "已選擇",
  noModelsFound: "未選擇模型。請從模型列表中選擇。",
  comparisonTitle: "對比",
  clearAll: "全部清除",
  deleteModel: "刪除模型",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "模型名稱",
    contextLength: "上下文長度",
    createdAt: "創建時間",
    input: "輸入",
    output: "輸出",
    inputCacheRead: "輸入緩存讀取",
    inputCacheWrite: "輸入緩存寫入",
    inputModalities: "輸入模態",
    outputModalities: "輸出模態",
  },
} satisfies TranslationSchema;
