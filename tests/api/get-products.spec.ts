import { test, expect } from '@playwright/test';
import { getProductsSchema } from '../../api-data/resp/get-products-schema.ts';
import { validateSchemaZod } from 'playwright-schema-validator';

const baseUrl = 'https://api.practicesoftwaretesting.com';

test('get all products test', async ({ request }) => {
  const response = await request.get(`${baseUrl}/products`);

  const respBody = await response.json();
  expect(response.status()).toBe(200);

  await validateSchemaZod({}, respBody, getProductsSchema);
});