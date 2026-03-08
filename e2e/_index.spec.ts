import { expect, test } from "@playwright/test";
import { IndexPage } from "./lib/pages/_index";

test("should redirect from / to /en/", async ({ page }) => {
  const indexPage = new IndexPage(page, page.context());

  await indexPage.goto("en");
  await indexPage.expectToHaveURL("/en/");
  await indexPage.expectHeadingToBeVisible();
});

test("should redirect from / to /ja/ with ja locale", async ({
  page,
  context,
}) => {
  const indexPage = new IndexPage(page, context);

  await context.addCookies([
    { name: "NEXT_LOCALE", value: "ja", domain: "localhost", path: "/" },
  ]);

  await indexPage.goto("ja");
  await indexPage.expectToHaveURL("/ja/");
  await indexPage.expectHeadingToBeVisible();
});

test("should redirect from root to /en/ by default (English locale)", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
});

test.describe("Japanese Browser Language", () => {
  test.use({ locale: "ja-JP" });

  test("should redirect from root to /ja/ when browser language is Japanese", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja\/$/);
  });
});
