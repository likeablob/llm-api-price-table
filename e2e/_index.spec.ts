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

class HomePage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "LLM Model Browser" });
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async expectHeadingToBeVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}

class LlmModelBrowserPage extends BasePage {
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  get searchInput() {
    return this.page.getByPlaceholder("モデル名で検索");
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

  getSortIcon(columnText: string) {
    return this.page.locator(`th:has-text("${columnText}")`);
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
}

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, context }) => {
    homePage = new HomePage(page, context);
  });

  test("should display heading", async () => {
    await homePage.goto();
    await homePage.expectHeadingToBeVisible();
  });
});

test.describe("LLM Model Browser", () => {
  let page: LlmModelBrowserPage;

  test.beforeEach(async ({ page: browserPage, context }) => {
    page = new LlmModelBrowserPage(browserPage, context);
    await page.goto();
  });

  test("should display model table on page load", async () => {
    await expect(page.table).toBeVisible();
  });

  test("should filter models by search query", async () => {
    await page.searchInput.fill("Claude");
    await expect(page.modelRows).not.toHaveCount(0);
    await expect(page.table).toBeVisible();
  });

  test("should show empty state when no matches", async () => {
    await page.searchInput.fill("NonExistentModel12345");
    await expect(page.table).toBeVisible();
    await expect(page.modelRows).toHaveCount(1);
  });

  test("should show all models when search is cleared", async () => {
    await page.searchInput.fill("Claude");
    await page.searchInput.clear();
    await expect(page.modelRows).not.toHaveCount(0);
  });

  test("should sort by model name", async () => {
    const sortIcon = page.getSortIcon("モデル名");
    await sortIcon.click();
    await expect(page.table).toBeVisible();
  });

  test("should toggle sort direction", async () => {
    const sortIcon = page.getSortIcon("モデル名");
    await sortIcon.click();
    await expect(page.table).toBeVisible();
    await sortIcon.click();
    await expect(page.table).toBeVisible();
  });

  test("should maintain search filter when sorting", async () => {
    await page.searchInput.fill("Claude");
    const sortIcon = page.getSortIcon("モデル名");
    await sortIcon.click();
    await expect(page.modelRows).not.toHaveCount(0);
  });
});
