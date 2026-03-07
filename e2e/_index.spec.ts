import { test } from "@playwright/test";
import { HomePage } from "./lib/home-page";

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
