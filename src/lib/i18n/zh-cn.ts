import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "简体中文",

  // Base translations (top-level)
  title: "LLM API 价格表",
  description: "LLM API 价格对比表",
  modelList: "模型列表",
  modelsCount: "个模型",
  lastUpdated: "最后更新",
  priceLabel: "价格：$/1M Token",
  searchPlaceholder: "按模型名称搜索",
  showId: "显示 ID",
  copyId: "复制 ID",
  copyName: "复制模型名称",
  addToComparison: "添加到对比",
  selected: "已选择",
  noModelsFound: "未选择模型。请从模型列表中选择。",
  comparisonTitle: "对比",
  clearAll: "全部清除",
  deleteModel: "删除模型",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "模型名称",
    contextLength: "上下文长度",
    createdAt: "创建时间",
    input: "输入",
    output: "输出",
    inputCacheRead: "输入缓存读取",
    inputCacheWrite: "输入缓存写入",
    inputModalities: "输入模态",
    outputModalities: "输出模态",
  },
} satisfies TranslationSchema;
