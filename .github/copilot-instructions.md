---
description: 'Playwright test generation, API testing, and Page Object Model patterns for E2E and API tests'
applyTo: '**'
---

## Playwright Testing Guidelines

### Code Quality Standards
- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.


### Test Structure
- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.


### File Organization
- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices
- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.


## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Movie Search Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('https://debs-obrien.github.io/playwright-movies-app');
  });

  test('Search for a movie by title', async ({ page }) => {
    await test.step('Activate and perform search', async () => {
      await page.getByRole('search').click();
      const searchInput = page.getByRole('textbox', { name: 'Search Input' });
      await searchInput.fill('Garfield');
      await searchInput.press('Enter');
    });

    await test.step('Verify search results', async () => {
      // Verify the accessibility tree of the search results
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - heading "Garfield" [level=1]
          - heading "search results" [level=2]
          - list "movies":
            - listitem "movie":
              - link "poster of The Garfield Movie The Garfield Movie rating":
                - /url: /playwright-movies-app/movie?id=tt5779228&page=1
                - img "poster of The Garfield Movie"
                - heading "The Garfield Movie" [level=2]
      `);
    });
  });
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist — E2E Tests

Before finalizing tests, ensure:
- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented


---

## Page Object Model (POM) Guidelines

### Structure & Naming
- **Location**: Store all page objects in the `pages/` directory with naming convention `<feature>.page.ts` (e.g., `login.page.ts`, `header.page.ts`).
- **Class Pattern**: Export a class named `<Feature>Page` (e.g., `LoginPage`, `HeaderPage`).
- **Constructor**: Accept `page: Page` as the only parameter and assign it as `this.page`.

### Locator Declarations
- **Typed Properties**: Declare all locators as `readonly` properties with explicit type annotations:
  ```typescript
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  ```
- **Locator Strategy**: Prioritize in order:
  1. **Test IDs**: `page.getByTestId('email')`
  2. **Roles**: `page.getByRole('button', { name: 'Login' })`
  3. **Labels**: `page.getByLabel('Email')`
  4. **Text**: `page.getByText('Sign In')`
  5. **Avoid**: CSS selectors or XPath unless absolutely necessary

### Action Methods
- **Method Purpose**: Encapsulate user interactions and assertions that are specific to a page feature.
- **Naming**: Use verb-first naming (e.g., `login()`, `fillEmail()`, `submitForm()`).
- **Async Pattern**: All methods must be `async`.
- **Return Values**: Return `void` unless the method chains to another page object.
- **Assertions**: Include minimal assertions to verify actions completed (e.g., asserting successful login state).

### Example POM Structure
```typescript
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loggedInUsername: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.loggedInUsername = page.getByTestId('nav-menu');
  }

  async login(email: string, password: string, expectedUsername: string = 'John Doe') {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.loggedInUsername).toContainText(expectedUsername);
  }
}
```

### Fixture Registration
- **Location**: Register page objects as fixtures in `fixtures.ts`.
- **Pattern**: Extend Playwright's `test` with a custom interface and provide setup logic:
  ```typescript
  interface PageFixtures {
    loginPage: LoginPage;
  }
  
  export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await use(loginPage);
    },
  });
  ```

### Quality Checklist — Page Objects
- [ ] Class name matches file name (LoginPage in login.page.ts)
- [ ] All locators are readonly with explicit Locator type
- [ ] Locators use test IDs or role-based strategies
- [ ] Action methods are async and encapsulate complete user flows
- [ ] Registered as fixtures in `fixtures.ts`
- [ ] No hardcoded waits or timeouts


---

## API Testing Guidelines

### Test Structure
- **Imports**: Use `test, expect` from `@playwright/test` and import Zod schemas from `api-data/resp/`:
  ```typescript
  import { test, expect } from '@playwright/test';
  import { getProductsSchema } from '../../api-data/resp/get-products-schema';
  import { validateSchemaZod } from 'playwright-schema-validator';
  ```
- **Request Fixture**: Use the `request` fixture to make API calls.
- **Response Handling**: Always extract response body and validate both status and schema.

### Response Assertions
- **Status Code**: Assert HTTP status using `expect(response.status()).toBe(expectedCode)`.
- **Schema Validation**: Use `validateSchemaZod()` to validate response bodies against Zod schemas:
  ```typescript
  const respBody = await response.json();
  await validateSchemaZod({}, respBody, getProductsSchema);
  ```
- **Avoid**: Direct object assertions; schema validation is the primary validation method.

### Helper Functions
- **Location**: Store reusable API helpers in `lib/api/` (e.g., `get-first-post-id.ts`, `get-token.ts`).
- **Purpose**: Extract common logic such as data lookups, token retrieval, or ID extraction.
- **Usage**: Import and call helpers to set up prerequisites for tests that depend on external data.

### Example API Test
```typescript
import { test, expect } from '@playwright/test';
import { getProductByIdSchema } from '../../api-data/resp/get-product-by-id-schema';
import { validateSchemaZod } from 'playwright-schema-validator';
import getIdByProductNumber from '../../lib/api/get-first-post-id';

test('get product by id test', async ({ request }) => {
  // Arrange: Get product ID using helper
  const productId = await getIdByProductNumber(request, 1);
  
  // Act: Make API request
  const response = await request.get(`/products/${productId}`);
  
  // Assert: Verify status and schema
  expect(response.status()).toBe(200);
  const respBody = await response.json();
  await validateSchemaZod({}, respBody, getProductByIdSchema);
});
```

### Quality Checklist — API Tests
- [ ] Response status assertion is present and specific
- [ ] Response schema is validated with `validateSchemaZod`
- [ ] Helper functions are used for data extraction
- [ ] No hardcoded IDs; use helpers to fetch dynamic data
- [ ] Test titles clearly describe the endpoint and scenario
- [ ] Imports follow the project convention (test/expect first, then schemas)
