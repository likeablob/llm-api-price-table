import { expect, test } from "@playwright/test";
import { IndexPage } from "../lib/pages/_index";

test.describe("LLM Model Browser", () => {
  let page: IndexPage;

  test.beforeEach(async ({ page: p, context }) => {
    page = new IndexPage(p, context);
    await page.goto();
  });

  test("should display heading", async () => {
    await page.expectHeadingToBeVisible();
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
    const sortIcon = page.getSortIconByPattern(/Model Name|モデル名/);
    await sortIcon.click();
    await expect(page.table).toBeVisible();
  });

  test("should toggle sort direction", async () => {
    const sortIcon = page.getSortIconByPattern(/Model Name|モデル名/);
    await sortIcon.click();
    await expect(page.table).toBeVisible();
    await sortIcon.click();
    await expect(page.table).toBeVisible();
  });

  test("should maintain search filter when sorting", async () => {
    await page.searchInput.fill("Claude");
    const sortIcon = page.getSortIconByPattern(/Model Name|モデル名/);
    await sortIcon.click();
    await expect(page.modelRows).not.toHaveCount(0);
  });
});
