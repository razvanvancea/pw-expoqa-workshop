import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderPage } from './header.page';

export class AccountCreationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly streetInput: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerSubmitButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.streetInput = page.getByTestId('street');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.countrySelect = page.getByTestId('country');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerSubmitButton = page.getByTestId('register-submit');
    this.registerLink = page.getByTestId('register-link');
  }

  async navigateToRegistration() {
    const headerPage = new HeaderPage(this.page);
    await headerPage.signInButton.click();
    await this.registerLink.click();
  }

  async fillAccountDetails(email: string, password: string, accountData?: {
    firstName?: string;
    lastName?: string;
    dob?: string;
    street?: string;
    postalCode?: string;
    houseNumber?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
  }) {
    const {
      firstName = 'John',
      lastName = 'Sparrow',
      dob = '1990-02-20',
      street = 'Baker',
      postalCode = '232222',
      houseNumber = '11',
      city = 'London',
      state = 'UK',
      country = 'AM',
      phone = '0722222222',
    } = accountData || {};

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dobInput.fill(dob);
    await this.streetInput.click();
    await this.streetInput.fill(street);
    await this.postalCodeInput.fill(postalCode);
    await this.houseNumberInput.fill(houseNumber);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    await this.countrySelect.selectOption(country);
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitRegistration() {
    await this.registerSubmitButton.click();
    await expect(this.page.getByRole('heading')).toContainText('Login');
  }

  async createAccount(email: string, password: string, accountData?: Parameters<typeof this.fillAccountDetails>[2]) {
    await this.navigateToRegistration();
    await this.fillAccountDetails(email, password, accountData);
    await this.submitRegistration();
  }
}
