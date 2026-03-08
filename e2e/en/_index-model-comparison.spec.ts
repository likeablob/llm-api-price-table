import { expect, test } from "@playwright/test";
import { IndexPage } from "../lib/pages/_index";

test.describe("Model Comparison Feature (EN)", () => {
  let page: IndexPage;

  test.beforeEach(async ({ page: p, context }) => {
    page = new IndexPage(p, context);
    await page.goto();
  });

  test("should display comparison section on page load", async () => {
    await expect(page.comparisonSection).toBeVisible();
  });

  test("should show empty state when no models selected", async () => {
    await expect(page.emptyStateMessage).toBeVisible();
  });

  test("should add model to comparison section when clicking plus icon", async () => {
    await page.clickPlusIcon("GPT-4o");
    await expect(page.comparisonRows).toHaveCount(1);
    await expect(page.comparisonTable).toBeVisible();
  });

  test("should remove model from comparison when clicking plus icon again (toggle)", async () => {
    await page.clickPlusIcon("GPT-4o");
    await expect(page.comparisonRows).toHaveCount(1);
    await page.clickPlusIcon("GPT-4o");
    await expect(page.comparisonRows).toHaveCount(0);
    await expect(page.emptyStateMessage).toBeVisible();
  });

  test("should display model in comparison section after adding", async () => {
    await page.clickPlusIcon("GPT-4o");
    await expect(page.comparisonSection.getByText("GPT-4o")).toBeVisible();
  });

  test("should remove model from comparison section when clicking delete button", async () => {
    await page.clickPlusIcon("GPT-4o");
    await expect(page.comparisonRows).toHaveCount(1);
    await page.clickDeleteButton("GPT-4o");
    await expect(page.comparisonRows).toHaveCount(0);
    await expect(page.emptyStateMessage).toBeVisible();
  });

  test("should clear all models when clicking clear all button", async () => {
    await page.clickPlusIcon("GPT-4o");
    await page.clickPlusIcon("Claude 3.5 Sonnet");
    await expect(page.comparisonRows).toHaveCount(2);
    await page.clickClearAllButton();
    await expect(page.comparisonRows).toHaveCount(0);
    await expect(page.emptyStateMessage).toBeVisible();
  });

  test("should persist selection across page reloads", async () => {
    await page.clickPlusIcon("GPT-4o");
    await page.clickPlusIcon("Claude 3.5 Sonnet");
    await expect(page.comparisonRows).toHaveCount(2);

    await page.goto();
    await expect(page.comparisonRows).toHaveCount(2);
    await expect(page.comparisonSection.getByText("GPT-4o")).toBeVisible();
  });

  test("should sort comparison table by model name", async () => {
    await page.clickPlusIcon("GPT-4o");
    await page.clickPlusIcon("Claude 3.5 Sonnet");
    await page.clickSortIconByPattern(/Model Name|モデル名/);
    await expect(page.comparisonTable).toBeVisible();
  });
});
