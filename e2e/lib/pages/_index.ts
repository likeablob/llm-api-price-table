import { expect, type BrowserContext, type Page } from "@playwright/test";
import { type Locale } from "../../../src/lib/translations";

const localeLabels = { en: "English", ja: "日本語" } satisfies Record<
  Locale,
  string
>;

export class IndexPage {
  public page: Page;
  public context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async goto(locale: Locale = "en" satisfies Locale): Promise<void> {
    await this.page.goto(`/${locale}/`);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForFunction(
      () => {
        return document.querySelector("table") !== null;
      },
      { timeout: 30000 },
    );
  }

  async expectToHaveURL(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  get heading() {
    return this.page.getByRole("heading", {
      name: /LLM API (Price Table|価格表)/,
    });
  }

  async expectHeadingToBeVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  get searchInput() {
    return this.page.getByPlaceholder(/Search|モデル名で検索/);
  }

  get table() {
    return this.page.locator("table");
  }

  get modelRows() {
    return this.page.locator("tbody tr");
  }

  getModelByName(name: string) {
    return this.page.getByText(name);
  }

  getSortIconByPattern(pattern: RegExp) {
    return this.page.locator("th").filter({
      hasText: pattern,
    });
  }

  get comparisonSection() {
    return this.page.locator("div.bg-card").filter({
      hasText: /モデル比較 |Comparison/,
    });
  }

  get clearAllButton() {
    return this.comparisonSection.getByRole("button", {
      name: /すべてクリア |Clear All/,
    });
  }

  get emptyStateMessage() {
    return this.comparisonSection.getByText(
      /モデルが選択されていません |No models selected/,
    );
  }

  get comparisonTable() {
    return this.comparisonSection.locator("table");
  }

  get comparisonRows() {
    return this.comparisonSection.locator("tbody tr");
  }

  getPlusIcon(modelName: string) {
    return this.page
      .locator("tbody tr")
      .filter({ hasText: modelName })
      .getByRole("button", {
        name: /比較に追加 |Add to comparison/,
      })
      .first();
  }

  getDeleteButton(modelName: string) {
    return this.comparisonSection
      .locator("tbody tr")
      .filter({ hasText: modelName })
      .getByRole("button", { name: /削除|Delete/ })
      .first();
  }

  get languageSelector() {
    return this.page.getByTestId("language-selector");
  }

  async clickLanguage(locale: Locale): Promise<void> {
    await this.languageSelector.click();
    const label = localeLabels[locale];
    const option = this.page.getByRole("option", { name: label });
    await option.waitFor({ state: "visible" });
    await option.click();
  }

  async clickPlusIcon(modelName: string): Promise<void> {
    await this.getPlusIcon(modelName).click();
  }

  async clickDeleteButton(modelName: string): Promise<void> {
    await this.getDeleteButton(modelName).click();
  }

  async clickSortIconByPattern(pattern: RegExp): Promise<void> {
    await this.comparisonSection
      .locator("th")
      .filter({ hasText: pattern })
      .click();
  }

  async clickClearAllButton(): Promise<void> {
    await this.clearAllButton.click();
  }
}
