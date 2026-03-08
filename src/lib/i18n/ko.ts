import type { TranslationSchema } from "./en";

export const dict = {
  localeName: "한국어",

  // Base translations (top-level)
  title: "LLM API 가격표",
  description: "LLM API 가격 비교표",
  modelList: "모델 목록",
  modelsCount: "개의 모델",
  lastUpdated: "최종 업데이트",
  priceLabel: "가격: $/1M 토큰",
  searchPlaceholder: "모델 이름으로 검색",
  showId: "ID 표시",
  copyId: "ID 복사",
  copyName: "모델 이름 복사",
  addToComparison: "비교에 추가",
  selected: "선택됨",
  noModelsFound: "선택된 모델이 없습니다. 모델 목록에서 선택해 주세요.",
  comparisonTitle: "비교",
  clearAll: "모두 지우기",
  deleteModel: "모델 삭제",

  // Table headers (grouped)
  tableHeaders: {
    modelName: "모델 이름",
    contextLength: "컨텍스트 길이",
    createdAt: "생성일",
    input: "입력",
    output: "출력",
    inputCacheRead: "입력 캐시 읽기",
    inputCacheWrite: "입력 캐시 쓰기",
    inputModalities: "입력 모달리티",
    outputModalities: "출력 모달리티",
  },
} satisfies TranslationSchema;
