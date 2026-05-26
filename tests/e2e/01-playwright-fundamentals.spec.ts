import { test, expect } from '../../fixtures';

test.describe('Fundamentals test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  /**
   *Exercise 1: debug the test below and make it pass
   */
  // test('ex 1: the user should be able to remove product from shopping cart', async ({
  //   loginPage,
  //   page,
  // }) => {
  //   await loginPage.login('admin@admin.com', 'admin123');

  //   await page.getByRole('button', { name: 'ADD TO CART' }).first().click();

  //   await page.getByRole('button', { name: 'REMVE' }).click();

  //   await expect(page.locator('div.cart-total span.price')).toContainText('$0');
  // });

  /**
   *Exercise 2: create the logout scenario using Page Object Model
   */
  // test('ex 2: the user should be able to logout - apply POM design pattern', async ({
  //   loginPage,
  //   headerPage,
  // }) => {
  //   await loginPage.login('admin@admin.com', 'admin123');

  // });

  /**
   * Quality checkpoint:
   *
   * Before moving forward, run from CLI:
   * npm run format
   * npm run lint
   * npm run test
   */
});
