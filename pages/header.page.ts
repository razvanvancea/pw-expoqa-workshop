import { expect, type Locator, type Page } from '@playwright/test';

export class HeaderPage {
  readonly page: Page;
  readonly loginSection: Locator;
  readonly welcomeMessage: Locator;
  readonly signInButton: Locator;
  readonly userMenuOptionsBtn: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginSection = page.locator('#loginSection');
    this.welcomeMessage = page.locator('text=Welcome back');
    this.signInButton = page.locator('[data-test="nav-sign-in"]');
    this.userMenuOptionsBtn = page.locator('[data-test="nav-menu"]');
    this.signOutButton = page.locator('[data-test="nav-sign-out"]');
  }

  async navigateToHome() {
    await this.page.goto('/');
  }

  async verifyWelcomeMessage() {
    await expect(this.loginSection).toContainText('Welcome back');
  }
}
