import { expect, type BrowserContext, type Page } from "@playwright/test";
import { type Locale } from "../../../src/lib/translations";

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
    await this.page.waitForSelector("table", { timeout: 30000 });
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
    return this.page.getByTestId("model-browser-table");
  }

  get modelRows() {
    return this.page
      .getByTestId("model-browser-table")
      .locator(
        "tbody tr:not(:has(:text('モデルが見つかりません'))):not(:has(:text('No models found')))",
      );
  }

  getModelByName(name: string) {
    return this.page.getByText(name);
  }

  getSortIconByPattern(pattern: RegExp) {
    return this.table.locator("th").filter({
      hasText: pattern,
    });
  }

  get comparisonSection() {
    return this.page
      .getByTestId("comparison-table")
      .locator("..")
      .locator("..");
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
    return this.page
      .getByTestId("comparison-table")
      .locator(
        "tbody tr:not(:has(:text('モデルが選択されていません'))):not(:has(:text('No models selected'))):not(:has(:text('モデルが見つかりません'))):not(:has(:text('No models found')))",
      );
  }

  getPlusIcon(modelName: string) {
    return this.page
      .getByTestId("model-browser-table")
      .locator("tbody tr")
      .filter({ hasText: modelName })
      .getByRole("button", {
        name: /比較に追加 |Add to comparison/,
      })
      .first();
  }

  getDeleteButton(modelName: string) {
    return this.page
      .getByTestId("comparison-table")
      .locator("tbody tr")
      .filter({ hasText: modelName })
      .getByRole("button", { name: /削除|Delete/ })
      .first();
  }

  get languageSelector() {
    return this.page.getByTestId("language-selector");
  }

  async clickLanguage(locale: Locale): Promise<void> {
    const option = this.page.getByTestId(`language-option-${locale}`);
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await this.languageSelector.click();
      await this.page.waitForTimeout(200);
    }
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
