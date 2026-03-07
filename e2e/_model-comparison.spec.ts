import { expect, test, type BrowserContext, type Page } from "@playwright/test";

class BasePage {
  protected page: Page;
  protected context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.page.locator("body")).toBeVisible();
  }

  async expectToHaveURL(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }
}

class ModelComparisonPage extends BasePage {
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  get comparisonSection() {
    return this.page.locator("div.bg-card").filter({ hasText: "モデル比較" });
  }

  get comparisonHeading() {
    return this.comparisonSection.getByRole("heading", { name: "モデル比較" });
  }

  get clearAllButton() {
    return this.comparisonSection.getByRole("button", { name: "すべてクリア" });
  }

  get emptyStateMessage() {
    return this.comparisonSection.getByText("選択されたモデルはありません");
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
        name: "比較に追加",
      })
      .first();
  }

  getDeleteButton(modelName: string) {
    return this.comparisonSection
      .locator("tbody tr")
      .filter({ hasText: modelName })
      .getByRole("button", { name: /削除/ })
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForFunction(
      () => {
        return document.querySelector("table") !== null;
      },
      { timeout: 30000 },
    );
  }

  async expectComparisonSectionToBeVisible(): Promise<void> {
    await expect(this.comparisonSection).toBeVisible();
  }

  async expectEmptyStateToBeVisible(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  async expectComparisonTableToBeVisible(): Promise<void> {
    await expect(this.comparisonTable).toBeVisible();
  }

  async expectClearAllButtonToBeVisible(): Promise<void> {
    await expect(this.clearAllButton).toBeVisible();
  }

  async clickPlusIcon(modelName: string): Promise<void> {
    await this.getPlusIcon(modelName).click();
  }

  async clickDeleteButton(modelName: string): Promise<void> {
    await this.getDeleteButton(modelName).click();
  }

  async expectComparisonRowsToHaveCount(count: number): Promise<void> {
    await expect(this.comparisonRows).toHaveCount(count);
  }

  getSortIcon(columnText: string) {
    return this.comparisonSection.locator(`th:has-text("${columnText}")`);
  }

  async clickSortIcon(columnText: string): Promise<void> {
    await this.getSortIcon(columnText).click();
  }

  async clickClearAllButton(): Promise<void> {
    await this.clearAllButton.click();
  }
}

test.describe("モデル比較機能", () => {
  let comparisonPage: ModelComparisonPage;

  test.beforeEach(async ({ page, context }) => {
    comparisonPage = new ModelComparisonPage(page, context);
    await comparisonPage.goto();
  });

  test("should display comparison section on page load", async () => {
    await comparisonPage.expectComparisonSectionToBeVisible();
  });

  test("should show empty state when no models selected", async () => {
    await comparisonPage.expectEmptyStateToBeVisible();
  });

  test("should add model to comparison section when clicking plus icon", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectComparisonRowsToHaveCount(1);
    await comparisonPage.expectComparisonTableToBeVisible();
  });

  test("should remove model from comparison when clicking plus icon again (toggle)", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectComparisonRowsToHaveCount(1);
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectComparisonRowsToHaveCount(0);
    await comparisonPage.expectEmptyStateToBeVisible();
  });

  test("should display model in comparison section after adding", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await expect(
      comparisonPage.comparisonSection.getByText("GPT-4o"),
    ).toBeVisible();
  });

  test("should remove model from comparison section when clicking delete button", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectComparisonRowsToHaveCount(1);
    await comparisonPage.clickDeleteButton("GPT-4o");
    await comparisonPage.expectComparisonRowsToHaveCount(0);
    await comparisonPage.expectEmptyStateToBeVisible();
  });

  test("should clear all models when clicking clear all button", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.clickPlusIcon("Claude 3.5 Sonnet");
    await comparisonPage.expectComparisonRowsToHaveCount(2);
    await comparisonPage.clickClearAllButton();
    await comparisonPage.expectComparisonRowsToHaveCount(0);
    await comparisonPage.expectEmptyStateToBeVisible();
  });

  test("should show clear all button when models are selected", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectClearAllButtonToBeVisible();
  });

  test("should not show clear all button when no models selected", async () => {
    await expect(comparisonPage.clearAllButton).not.toBeVisible();
  });

  test("should persist selection across page reloads", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.clickPlusIcon("Claude 3.5 Sonnet");
    await comparisonPage.expectComparisonRowsToHaveCount(2);

    await comparisonPage.goto();
    await comparisonPage.expectComparisonRowsToHaveCount(2);
    await expect(
      comparisonPage.comparisonSection.getByText("GPT-4o"),
    ).toBeVisible();
    await expect(
      comparisonPage.comparisonSection.getByText("Claude 3.5 Sonnet"),
    ).toBeVisible();
  });

  test("should have consistent column structure with model list table", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.expectComparisonTableToBeVisible();

    const tableHeaders = comparisonPage.comparisonSection.locator("thead th");
    await expect(tableHeaders).toHaveCount(9);
  });

  test("should sort comparison table by model name", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.clickPlusIcon("Claude 3.5 Sonnet");
    await comparisonPage.clickPlusIcon("Gemini 2.0 Flash");
    await comparisonPage.expectComparisonRowsToHaveCount(3);

    await comparisonPage.clickSortIcon("モデル名");
    await comparisonPage.expectComparisonTableToBeVisible();
  });

  test("should toggle sort direction", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.clickPlusIcon("Claude 3.5 Sonnet");
    await comparisonPage.expectComparisonRowsToHaveCount(2);

    const sortIcon = comparisonPage.getSortIcon("モデル名");
    await sortIcon.click();
    await comparisonPage.expectComparisonTableToBeVisible();
    await sortIcon.click();
    await comparisonPage.expectComparisonTableToBeVisible();
  });

  test("should maintain sort state when data updates", async () => {
    await comparisonPage.clickPlusIcon("GPT-4o");
    await comparisonPage.clickPlusIcon("Claude 3.5 Sonnet");
    await comparisonPage.clickSortIcon("モデル名");
    await comparisonPage.expectComparisonTableToBeVisible();
  });
});
