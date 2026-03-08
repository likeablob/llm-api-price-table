import { dict as de } from "./i18n/de";
import { dict as en, type TranslationKey } from "./i18n/en";
import { dict as es } from "./i18n/es";
import { dict as fr } from "./i18n/fr";
import { dict as it } from "./i18n/it";
import { dict as ja } from "./i18n/ja";
import { dict as ko } from "./i18n/ko";
import { dict as nl } from "./i18n/nl";
import { dict as pt } from "./i18n/pt";
import { dict as zhCn } from "./i18n/zh-cn";
import { dict as zhTw } from "./i18n/zh-tw";

export const LOCALES = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "nl",
  "pt",
  "zh-cn",
  "zh-tw",
] as const;
export type Locale = (typeof LOCALES)[number];

export const translations = {
  de,
  en,
  es,
  fr,
  it,
  ja,
  ko,
  nl,
  pt,
  "zh-cn": zhCn,
  "zh-tw": zhTw,
} as const;

export function t(locale: Locale, key: TranslationKey): string {
  const dict = translations[locale];
  const keys = key.split(".") as Array<
    keyof typeof dict | keyof typeof dict.tableHeaders
  >;

  if (keys.length === 2) {
    const [parent, child] = keys;
    const group = dict[parent as keyof typeof dict];
    if (typeof group === "object" && group !== null && child in group) {
      return (group as any)[child];
    }
  }

  return (dict as any)[key] ?? (translations.en as any)[key] ?? key;
}

export const localeLabels = Object.fromEntries(
  Object.entries(translations).map(([locale, dict]) => [
    locale,
    dict.localeName,
  ]),
) as Record<Locale, string>;
