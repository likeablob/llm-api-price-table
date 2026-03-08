import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { localeLabels, LOCALES, type Locale } from "@/lib/translations";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLocale: Locale;
}

export function LanguageSelectorReact({
  currentLocale,
}: LanguageSelectorProps) {
  return (
    <Select
      value={currentLocale}
      onValueChange={(value) => {
        if (value !== currentLocale) {
          const url = `${import.meta.env.BASE_URL}/${value}/`;
          window.location.href = url;
        }
      }}
    >
      <SelectTrigger
        className="bg-background/80 h-9 w-[150px] backdrop-blur-sm"
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
