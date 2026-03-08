import { expect, test } from "@playwright/test";
import { IndexPage } from "./lib/pages/_index";

test.describe.configure({ mode: "serial" });

test.describe("i18n - Basic Routing", () => {
  let page: IndexPage;

  test.beforeEach(async ({ page: p, context }) => {
    page = new IndexPage(p, context);
  });

  test("should load English page at /en/", async () => {
    await page.goto("en");
    await page.expectToHaveURL("/en/");
    await expect(
      page.page.getByRole("heading", { name: "LLM API Price Table" }),
    ).toBeVisible();
  });

  test("should load Japanese page at /ja/", async () => {
    await page.goto("ja");
    await page.expectToHaveURL("/ja/");
    await expect(
      page.page.getByRole("heading", { name: "LLM API 価格表" }),
    ).toBeVisible();
  });
});

test.describe("i18n - Manual Switching", () => {
  test("should switch between languages via selector", async ({
    page: p,
    context,
  }) => {
    const indexPage = new IndexPage(p, context);

    await indexPage.goto("en");
    await indexPage.expectToHaveURL("/en/");

    // Switch to Japanese
    await indexPage.clickLanguage("ja");
    await indexPage.expectToHaveURL("/ja/");
    await expect(
      p.getByRole("heading", { name: "LLM API 価格表" }),
    ).toBeVisible();

    // Switch back to English
    await indexPage.clickLanguage("en");
    await indexPage.expectToHaveURL("/en/");
    await expect(
      p.getByRole("heading", { name: "LLM API Price Table" }),
    ).toBeVisible();
  });
});
