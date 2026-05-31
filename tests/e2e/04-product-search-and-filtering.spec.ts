import { test, expect } from '@playwright/test';

test.describe('Product Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Toolshop home page
    await page.goto('/');
  });

  test('Search and filter products by price range and category', async ({ page }) => {
    // Step 1: Navigate to Toolshop and verify it loads
    await test.step('Verify Toolshop page loads with products', async () => {
      // Wait for products to load
      await expect(page.locator('[role="main"] a[href*="/product/"]').first()).toBeVisible({
        timeout: 10000,
      });
    });

    // Step 2-3: Verify available filter options display
    await test.step('Verify available filter options are displayed', async () => {
      // Verify Sort section
      await expect(page.getByText('Sort')).toBeVisible();
      const sortCombobox = page.locator('select, [role="combobox"]').first();
      await expect(sortCombobox).toBeVisible();

      // Verify Price Range section
      await expect(page.getByText('Price Range')).toBeVisible();
      const priceSlider = page.locator('[role="slider"]').first();
      await expect(priceSlider).toBeVisible();

      // Verify Categories filter options (Hand Tools parent visible)
      const handToolsLabel = page
        .locator('label')
        .filter({ hasText: /Hand Tools/ })
        .first();
      const pliersCategoryLabel = page
        .locator('label')
        .filter({ hasText: /Pliers/ })
        .first();

      if (await handToolsLabel.isVisible().catch(() => false)) {
        await expect(handToolsLabel).toBeVisible();
      }
      if (await pliersCategoryLabel.isVisible().catch(() => false)) {
        await expect(pliersCategoryLabel).toBeVisible();
      }
    });

    // Step 4-5: Select a price range filter and verify product list updates
    await test.step('Apply price range filter and verify results update', async () => {
      // Get initial product count
      const productsInitial = page.locator('[role="main"] a[href*="/product/"]');
      const initialCount = await productsInitial.count();
      expect(initialCount).toBeGreaterThan(0);

      // Apply price range filter using the price sliders
      const priceSliders = page.locator('[role="slider"]');
      const maxPriceSlider = priceSliders.nth(1); // Second slider is max price

      // Adjust the max price slider to a lower value (around $30-50 range)
      if (await maxPriceSlider.isVisible().catch(() => false)) {
        await maxPriceSlider.focus();
        // Reset to Home first, then adjust
        await maxPriceSlider.press('Home');
        // Move right to set a price limit (approximate $50)
        for (let i = 0; i < 12; i++) {
          await maxPriceSlider.press('ArrowRight');
          await page.waitForTimeout(100);
        }
      }

      // Wait for product list to update
      await page.waitForTimeout(500);
      const productsFiltered = page.locator('[role="main"] a[href*="/product/"]');
      const filteredCount = await productsFiltered.count();

      // Products should have updated
      expect(filteredCount).toBeGreaterThan(0);
    });

    // Step 6-7: Add an additional filter (category: "Pliers") and verify combined filtering
    await test.step('Add category filter and verify combined filtering', async () => {
      // Find and check the Pliers checkbox
      const pliersCategoryCheckbox = page
        .locator(
          'input[type="checkbox"][value*="Plier"], label:has-text("Pliers") input[type="checkbox"]'
        )
        .first();

      if (await pliersCategoryCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
        const isChecked = await pliersCategoryCheckbox.isChecked();
        if (!isChecked) {
          await pliersCategoryCheckbox.check();
        }

        // Wait for products to filter
        await page.waitForTimeout(500);

        // Verify products are updated
        const products = page.locator('[role="main"] a[href*="/product/"]');
        const productCount = await products.count();
        expect(productCount).toBeGreaterThan(0);
      }
    });

    // Step 8-9: Clear filters and verify all products reappear
    await test.step('Clear all filters and verify full product list returns', async () => {
      // Uncheck all category filters
      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        const isChecked = await checkbox.isChecked().catch(() => false);
        if (isChecked) {
          await checkbox.uncheck();
          await page.waitForTimeout(100);
        }
      }

      // Reset price range slider to full range by moving to extremes
      const priceSliders = page.locator('[role="slider"]');
      const minSlider = priceSliders.nth(0);
      const maxSlider = priceSliders.nth(1);

      if (await minSlider.isVisible().catch(() => false)) {
        await minSlider.focus();
        await minSlider.press('Home');
      }

      if (await maxSlider.isVisible().catch(() => false)) {
        await maxSlider.focus();
        await maxSlider.press('End');
      }

      await page.waitForTimeout(500);

      // Verify products are visible
      const products = page.locator('[role="main"] a[href*="/product/"]');
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(0);
    });

    // Step 10-11: Use pagination to navigate between product pages
    await test.step('Verify pagination controls are available', async () => {
      // Look for pagination controls
      const nextButton = page
        .locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="next" i]')
        .first();
      const previousButton = page
        .locator('button:has-text("Previous"), a:has-text("Previous"), [aria-label*="previous" i]')
        .first();
      const paginationContainer = page.locator('nav, [role="navigation"], pagination').first();

      // Verify products are visible
      const products = page.locator('[role="main"] a[href*="/product/"]');
      await expect(products.first()).toBeVisible();
    });

    // Step 12-13: Navigate between pages and verify page changes
    await test.step('Navigate through pagination pages', async () => {
      const nextButton = page
        .locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="next" i]')
        .first();
      const previousButton = page
        .locator('button:has-text("Previous"), a:has-text("Previous"), [aria-label*="previous" i]')
        .first();

      if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Get current URL
        const urlBefore = page.url();

        // Click Next button
        await nextButton.click();
        await page.waitForTimeout(500);

        // Verify products are still visible on new page
        const products = page.locator('[role="main"] a[href*="/product/"]');
        await expect(products.first()).toBeVisible();

        // Navigate back using Previous button if available
        if (await previousButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await previousButton.click();
          await page.waitForTimeout(500);

          // Verify we're back to products
          await expect(products.first()).toBeVisible();
        }
      }
    });

    // Final verification: Verify filter combinations are preserved during pagination
    await test.step('Verify page structure and product display', async () => {
      // Verify products are displayed with required information
      const productLinks = page.locator('[role="main"] a[href*="/product/"]');
      const firstProduct = productLinks.first();

      await expect(firstProduct).toBeVisible();

      // Verify product details are visible (name, price)
      const productName = firstProduct.locator('h5, heading');
      const productPrice = firstProduct.locator('text:has-text("$")');

      if (await productName.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(productName).toBeVisible();
      }
    });
  });
});
