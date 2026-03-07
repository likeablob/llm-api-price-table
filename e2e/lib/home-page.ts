import { expect, type BrowserContext, type Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class HomePage extends BasePage {
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  get heading() {
    return this.page.getByRole("heading", { name: "Hello, World!" });
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async expectHeadingToBeVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
