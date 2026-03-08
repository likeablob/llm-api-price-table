import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCALES, type Locale } from "@/lib/translations";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLocale: Locale;
}

const localeLabels = {
  en: "English",
  ja: "日本語",
} satisfies Record<Locale, string>;

export function LanguageSelectorReact({
  currentLocale,
}: LanguageSelectorProps) {
  return (
    <Select
      value={currentLocale}
      onValueChange={(value) => {
        const url = `/${value}/`;
        window.location.href = url;
      }}
    >
      <SelectTrigger
        className="bg-background/80 h-9 w-[130px] backdrop-blur-sm"
        data-testid="language-selector"
      >
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="end"
        sideOffset={4}
        className="w-[80px]"
      >
        <div data-testid="language-options-wrapper">
          {LOCALES.map((locale) => (
            <SelectItem
              key={locale}
              value={locale}
              data-testid={`language-option-${locale}`}
            >
              {localeLabels[locale]}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
