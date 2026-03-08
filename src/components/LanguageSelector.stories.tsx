import { LOCALES, type Locale } from "@/lib/translations";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LanguageSelectorReact } from "./LanguageSelector";

const meta = {
  title: "Components/LanguageSelector",
  component: LanguageSelectorReact,
  parameters: {
    layout: "centered",
  },
  args: {
    currentLocale: "en" as Locale,
  },
  argTypes: {
    currentLocale: {
      control: "select",
      options: LOCALES,
    },
  },
} satisfies Meta<typeof LanguageSelectorReact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentLocale: "en",
  },
};

export const WithJapanese: Story = {
  args: {
    currentLocale: "ja",
  },
};

export const WithChinese: Story = {
  args: {
    currentLocale: "zh-cn",
  },
};

export const WithAllLocales: Story = {
  args: {
    currentLocale: "en",
  },
};
