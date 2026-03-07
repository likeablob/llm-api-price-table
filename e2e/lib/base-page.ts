import { expect, type BrowserContext, type Page } from "@playwright/test";

export class BasePage {
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
