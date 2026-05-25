import { test, expect } from '@playwright/test';
import { getProductsSchema } from '../../api-data/resp/get-products-schema';
import { validateSchemaZod } from 'playwright-schema-validator';

/**
 * Refactor the following test to verify the GET /products/id endpoint
 * Hint: you can manually inspect the response from the GET /products endpoint to get a valid product id
 * Assert the status code is 200
 * use 'validateSchemaZod' to assert the response body schema (it requires creating a get-product-by-id-schema.ts)
 */
test('get product by id test', async ({ request }) => {
  //   const response = await request.get(`/products`);
  //   const respBody = await response.json();
  //   expect(response.status()).toBe(200);
  //   await validateSchemaZod({}, respBody, getProductsSchema);
});
