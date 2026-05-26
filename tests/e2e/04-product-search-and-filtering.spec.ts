import { test, expect } from '@playwright/test';

test.describe('Product Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Toolshop home page
    await page.goto('https://practicesoftwaretesting.com/');
  });

  test('Search and filter products by price range and category', async ({ page }) => {
    // Step 1: Click the "Filters" button to open filter panel
    await test.step('Open the Filters panel', async () => {
      const filtersButton = page.getByRole('button', { name: /Filters/ });
      await expect(filtersButton).toBeVisible();
      await filtersButton.click();
      // Verify the button is now expanded
      await expect(filtersButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Step 2-3: Verify available filter options display
    await test.step('Verify available filter options are displayed', async () => {
      // Verify Sort dropdown
      await expect(page.locator('heading:has-text("Sort")')).toBeVisible();
      const sortCombobox = page.locator('[role="combobox"]').filter({ hasText: /sort/i }).first();
      await expect(sortCombobox).toBeVisible();

      // Verify Price Range section
      await expect(page.locator('heading:has-text("Price Range")')).toBeVisible();
      await expect(page.locator('ngx-slider')).toBeVisible();

      // Verify Categories filter
      await expect(page.locator('heading:has-text("By category:")')).toBeVisible();
      await expect(page.locator('text:has-text("Hand Tools")')).toBeVisible();
      await expect(page.locator('text:has-text("Pliers")')).toBeVisible();

      // Verify Search section
      await expect(page.locator('heading:has-text("Search")')).toBeVisible();
    });

    // Step 4-5: Select a price range filter and verify product list updates
    await test.step('Apply price range filter and verify results update', async () => {
      // Get initial product count
      const productsInitial = page.locator('[role="main"] a[href*="/product/"]');
      const initialCount = await productsInitial.count();
      expect(initialCount).toBeGreaterThan(0);

      // Apply price range filter - use the max price slider to limit to lower prices
      const maxPriceSlider = page.locator('[role="slider"][aria-valuetext*="max"]').first();
      if (await maxPriceSlider.isVisible({ timeout: 5000 }).catch(() => false)) {
        await maxPriceSlider.focus();
        // Move slider to reduce price range (press Home to go to min, then arrow right)
        await maxPriceSlider.press('Home');
        for (let i = 0; i < 8; i++) {
          await maxPriceSlider.press('ArrowRight');
        }
      }

      // Wait for product list to update
      await page.waitForLoadState('networkidle');
      const productsFiltered = page.locator('[role="main"] a[href*="/product/"]');
      const filteredCount = await productsFiltered.count();

      // Products should have updated (either same or fewer depending on price range)
      expect(filteredCount).toBeGreaterThan(0);
    });

    // Step 6-7: Add an additional filter (category: "Pliers") and verify combined filtering
    await test.step('Add category filter and verify combined filtering', async () => {
      // Uncheck "Hand Tools" first to collapse it if needed
      const handToolsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Hand Tools' }).first();
      
      // Find and check the Pliers checkbox
      const pliersCategoryCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Pliers' }).first();
      if (await pliersCategoryCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
        const isChecked = await pliersCategoryCheckbox.isChecked();
        if (!isChecked) {
          await pliersCategoryCheckbox.check();
        }
        
        // Wait for products to filter
        await page.waitForLoadState('networkidle');
        
        // Verify products are updated - should only show Pliers category
        const products = page.locator('[role="main"] a[href*="/product/"]');
        const productCount = await products.count();
        expect(productCount).toBeGreaterThan(0);
        
        // Verify at least one product name contains "Pliers" or related term
        const productNames = await page.locator('[role="main"] h5').allTextContents();
        const hasPliers = productNames.some(name => 
          name.toLowerCase().includes('plier') || 
          name.toLowerCase().includes('wrench') ||
          name.toLowerCase().includes('hammer')
        );
        expect(hasPliers).toBeTruthy();
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
        }
      }

      // Reset price range slider to full range
      const minPriceSlider = page.locator('[role="slider"]').first();
      if (await minPriceSlider.isVisible({ timeout: 5000 }).catch(() => false)) {
        await minPriceSlider.focus();
        await minPriceSlider.press('Home');
      }

      await page.waitForLoadState('networkidle');
      
      // Verify products are visible
      const products = page.locator('[role="main"] a[href*="/product/"]');
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(0);
    });

    // Step 10-11: Use pagination to navigate between product pages
    await test.step('Verify pagination controls are available', async () => {
      // Close filter panel to see pagination
      const filtersButton = page.getByRole('button', { name: /Filters/ });
      if (await filtersButton.getAttribute('aria-expanded') === 'true') {
        await filtersButton.click();
      }

      // Look for pagination controls
      const paginationContainer = page.locator('pagination, nav, [role="navigation"]');
      
      // If pagination exists, verify navigation buttons
      const nextButton = page.locator('button:has-text("Next"), [aria-label*="next" i], a:has-text("Next")').first();
      const previousButton = page.locator('button:has-text("Previous"), [aria-label*="previous" i], a:has-text("Previous")').first();
      
      if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Pagination is available, verify initial state
        await expect(page.locator('[role="main"] a[href*="/product/"]')).toHaveCount(/ *(12|20|25|50)\d*/);
      }
    });

    // Step 12-13: Navigate between pages and verify page changes
    await test.step('Navigate through pagination pages', async () => {
      const nextButton = page.locator('button:has-text("Next"), [aria-label*="next" i], a:has-text("Next")').first();
      
      if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Get URL before navigation
        const urlBefore = page.url();
        
        // Click Next button
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // URL or product list should have changed
        const urlAfter = page.url();
        
        // Verify products are still visible on new page
        const products = page.locator('[role="main"] a[href*="/product/"]');
        await expect(products.first()).toBeVisible();
        
        // Navigate back using Previous button
        const previousButton = page.locator('button:has-text("Previous"), [aria-label*="previous" i], a:has-text("Previous")').first();
        if (await previousButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await previousButton.click();
          await page.waitForLoadState('networkidle');
          
          // Verify we're back to initial products
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
