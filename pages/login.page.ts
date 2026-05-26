import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderPage } from './header.page';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#submitLoginBtn');
  }

  async login(email: string, password: string) {
    const headerPage = new HeaderPage(this.page);

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(headerPage.logoutBtn).toBeVisible();
  }
}
