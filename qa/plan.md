# Test Plan for Practice Software Testing - Toolshop

## Executive Summary

This test plan covers the critical user flows for the Practice Software Testing Toolshop e-commerce platform. The application allows users to browse and purchase tools, create accounts, manage wishlists, and compare products.

**Application URL**: https://practicesoftwaretesting.com  
**Application Type**: E-commerce (Practice/Demo)  
**Test Scope**: Functional testing covering user authentication, product discovery, shopping cart, checkout, and user management.

---

## Risk-Based Test Prioritization

Scenarios are prioritized based on business impact, user impact, failure likelihood, and recovery cost:

- **P0 (Critical)**: Scenarios where failure blocks user access, prevents purchase, or causes data loss
- **P1 (High)**: Scenarios where failure significantly degrades key workflows or affects common user journeys

---

## Top 5 Test Scenarios

### Scenario 1: [P0] User Registration and Account Creation

**Priority**: P0 - Critical  
**Business Impact**: High - Blocks user account setup and future login  
**User Impact**: High - Prevents access to user-specific features (favorites, order history)  
**Failure Likelihood**: High - Complex form with multiple validations and fields  
**Recovery Cost**: High - User cannot proceed with purchase or future logins

**Description**: Verify that new users can successfully create a customer account with complete form validation and confirmation.

**Preconditions**:

- User is not logged in
- User has access to the registration page
- User has a valid email address not yet registered
- Browser is Chrome on desktop

**Test Steps**:

1. Navigate to the Toolshop home page
2. Click on "Sign in" in the navigation menu
3. Click on "Register your account" link
4. Fill in the "First name" field with a valid first name (e.g., "John")
5. Fill in the "Last name" field with a valid last name (e.g., "Doe")
6. Fill in the "Date of Birth" field with a valid date in YYYY-MM-DD format (e.g., "1990-05-15")
7. Select a country from the "Country" dropdown (e.g., "United States")
8. Fill in the "Email address" field with a unique, valid email (e.g., test\_<timestamp>@example.com)
9. Fill in the "Password" field with a strong password (minimum 8 characters, mixed case, numbers)
10. Fill in the "Confirm password" field with the same password
11. Accept terms and conditions if checkbox is present
12. Click the "Register" or "Create Account" button
13. Verify successful registration message or redirect to login page
14. Attempt to log in with the newly created credentials

**Expected Outcomes**:

- Registration form accepts all required fields without errors
- Validation messages appear for invalid inputs (e.g., invalid date format, weak password)
- Successful registration displays confirmation message
- User is either redirected to login or automatically logged in
- New account is created in the system and can be used for future logins
- Email validation works (if applicable)

**Acceptance Criteria**:

- User can create account with valid data
- Form validation prevents invalid entries
- Account is immediately usable for login
- User can view account-specific features after login

**Assumptions**:

- No pre-existing user data exists
- Form fields follow standard HTML validation
- System sends confirmation emails (if applicable)

---

### Scenario 2: [P0] User Login and Authentication

**Priority**: P0 - Critical  
**Business Impact**: High - Blocks access to all user-specific features  
**User Impact**: High - Prevents access to account, order history, favorites  
**Failure Likelihood**: High - Core authentication mechanism  
**Recovery Cost**: High - Users cannot access their accounts

**Description**: Verify that registered users can successfully log in with valid credentials and access authenticated features.

**Preconditions**:

- Test account exists with known credentials
- User is not currently logged in
- Browser is Chrome on desktop
- Test account credentials: Email (e.g., testuser@example.com), Password (e.g., ValidPassword123)

**Test Steps**:

1. Navigate to the Toolshop home page
2. Click on "Sign in" in the navigation menu
3. Enter valid email address in the "Email address" field
4. Enter valid password in the "Password" field
5. Click the "Login" button
6. Verify redirection to home page or dashboard
7. Verify user greeting or account menu appears in navigation
8. Click on account/user menu to verify access to account features
9. Log out and verify return to login page

**Expected Outcomes**:

- Login form accepts valid credentials
- Successful login redirects to home page or dashboard
- User menu/account greeting appears in navigation
- User can access account-specific features
- Session is maintained across page navigation
- Logout successfully clears session

**Acceptance Criteria**:

- Valid credentials grant access
- Invalid credentials show error message
- Session persists across page navigation
- Logout clears all session data
- User menu displays after successful login

**Assumptions**:

- Test account exists and is active
- Session management uses secure cookies/tokens
- Logout endpoint works correctly

---

### Scenario 3: [P0] Add Product to Cart and Proceed to Checkout

**Priority**: P0 - Critical  
**Business Impact**: Critical - Blocks purchase functionality  
**User Impact**: High - Prevents users from buying products  
**Failure Likelihood**: High - Complex workflow with inventory and cart management  
**Recovery Cost**: High - Lost revenue and user frustration

**Description**: Verify that users can successfully add products to cart and proceed through the checkout workflow.

**Preconditions**:

- User is logged in with valid account
- Products are available in inventory
- At least one product is in stock
- Browser is Chrome on desktop
- Shopping cart is empty

**Test Steps**:

1. Navigate to the Toolshop home page
2. Browse the product listing page
3. Click on any product that shows "in stock" (e.g., "Combination Pliers" priced at $14.15)
4. Verify product detail page loads with price, description, and specifications
5. Verify quantity field shows "1" by default
6. Click the "Add to cart" button
7. Verify cart confirmation message or modal appears
8. Navigate to the shopping cart page (via cart icon or menu)
9. Verify the added product appears in the cart with correct price and quantity
10. Verify cart subtotal and estimated total are calculated correctly
11. Verify cart shows shipping and tax estimates
12. Click "Proceed to Checkout" or "Continue to Payment" button
13. Verify checkout page/form loads
14. Fill in shipping address details if required
15. Select shipping method if options are available
16. Verify order review displays all items with correct pricing
17. Do not complete payment (verify next step or cancel)

**Expected Outcomes**:

- Product is added to cart successfully
- Cart displays correct quantity and pricing
- Cart persists across page navigation
- Checkout page loads and displays order summary
- All pricing calculations are accurate
- Shipping and tax calculations are shown
- Form validation works on checkout page

**Acceptance Criteria**:

- Products can be added to cart
- Cart quantity and totals are correct
- Cart persists across sessions
- Checkout page displays complete order information
- Form validation prevents incomplete orders

**Assumptions**:

- Products are in stock
- User has valid shipping address
- Payment integration is secure but not tested for actual charges
- Cart persists in session

---

### Scenario 4: [P1] Product Search and Filtering

**Priority**: P1 - High  
**Business Impact**: High - Affects product discovery and user navigation  
**User Impact**: High - Users cannot find products they want to purchase  
**Failure Likelihood**: Medium - Search/filter logic may have edge cases  
**Recovery Cost**: Medium - Users may abandon if they can't find products

**Description**: Verify that users can search and filter products by various criteria to find desired items.

**Preconditions**:

- User is on the Toolshop home page
- Product catalog contains diverse items with filters (category, brand, price, etc.)
- Browser is Chrome on desktop
- No user login required for browsing

**Test Steps**:

1. Navigate to the Toolshop home page
2. Click the "Filters" button to open filter panel
3. Verify available filter options display (e.g., price range, category, brand, ratings)
4. Select a price range filter (e.g., $10-$20)
5. Verify product list updates to show only products within the selected price range
6. Verify products outside the range are hidden
7. Add an additional filter (e.g., category: "Pliers")
8. Verify product list is filtered by both criteria
9. Verify product count or pagination updates
10. Clear filters and verify all products reappear
11. Use pagination to navigate between product pages
12. Verify each page shows products with correct numbering/order
13. Click "Next" pagination button and verify page changes
14. Click "Previous" and verify navigation works
15. Test pagination boundary conditions (page 1, last page)

**Expected Outcomes**:

- Filters are available and functional
- Product list updates dynamically when filters are applied
- Multiple filters can be combined
- Filter results are accurate and complete
- Pagination works correctly across pages
- Filter combinations are preserved during pagination
- Clearing filters returns to full product list

**Acceptance Criteria**:

- Filters display all available options
- Filter results are accurate and match selection
- Pagination allows browsing all products
- Filter combinations work together
- UI updates immediately when filters change
- No products are lost or duplicated in results

**Assumptions**:

- Product data is consistent
- Filter logic uses proper database queries
- Frontend updates efficiently
- Pagination uses standard offset-based or cursor-based approach

---

### Scenario 5: [P1] Product Comparison and Details Review

**Priority**: P1 - High  
**Business Impact**: High - Affects user purchasing decisions  
**User Impact**: High - Users need detailed product information to make purchases  
**Failure Likelihood**: Medium - Product data may be incomplete or inconsistent  
**Recovery Cost**: Medium - Users may purchase wrong item or abandon purchase

**Description**: Verify that users can view detailed product information and compare multiple products side-by-side.

**Preconditions**:

- User is on the Toolshop home page
- Product catalog contains items with specifications
- Browser is Chrome on desktop
- Multiple products are available for comparison

**Test Steps**:

1. Navigate to the Toolshop home page
2. Locate multiple products (e.g., different types of pliers)
3. Click the "Compare" button on the first product card
4. Verify product is added to comparison list or compare panel opens
5. Click the "Compare" button on a second product
6. Verify both products appear in the comparison view
7. Scroll through comparison to verify all specifications are displayed:
   - Product name, price, description
   - Image with proper resolution
   - CO₂ environmental impact rating
   - Availability status (in stock/out of stock)
   - Material, dimensions, warranty information
   - Other specifications from product table
8. Verify specifications are accurate and complete
9. Verify out-of-stock items display appropriate status (e.g., "Out of stock" label)
10. Click on individual product to view detailed product page
11. Verify product page displays:
    - High-quality product image
    - Product title and price
    - Brand and category information
    - Full description/specifications table
    - Quantity selector
    - Add to cart button
    - Add to favorites button
12. Verify related products section displays alternative items
13. Click on a related product to verify navigation works

**Expected Outcomes**:

- Compare button adds products to comparison list
- Comparison view displays all selected products
- All specifications are visible and accurate
- Detailed product pages load correctly
- Product information is complete and consistent
- Related products are relevant to current product
- Out-of-stock items are clearly marked
- Images load properly and display at appropriate resolution

**Acceptance Criteria**:

- Multiple products can be compared side-by-side
- Comparison view is readable and organized
- Product information is complete and accurate
- Product pages display all required details
- Related products are relevant and load correctly
- Out-of-stock status is clearly visible

**Assumptions**:

- Product data is complete in the database
- Product images are properly stored and accessible
- Related products are logically linked
- Specifications are consistent across products

---

## Additional Testing Considerations

### Scenario Coverage (Future Testing)

- **Negative Testing**: Invalid login credentials, expired sessions, invalid data entry
- **Edge Cases**: Adding maximum quantity to cart, applying multiple discounts, negative price scenarios
- **Performance**: Load time under high user load, pagination with large datasets
- **Security**: SQL injection in search, XSS in product descriptions, CSRF on form submissions
- **Accessibility**: Keyboard navigation, screen reader compatibility, color contrast
- **Cross-Browser**: Testing on Firefox, Safari, and mobile browsers
- **Mobile Responsiveness**: Product browsing and checkout on mobile devices

### Test Data Requirements

- Pre-created test user account with known credentials
- Products with various prices, availability statuses, and specifications
- Sample images for products
- Environmental impact ratings (CO₂ data)
- Category and brand information for filtering

### Test Environment

- **URL**: https://practicesoftwaretesting.com
- **Browser**: Chrome (Latest version) on macOS
- **Resolution**: 1728x1117 (or standard desktop)
- **Network**: Stable internet connection

---

## Success Criteria

All 5 scenarios must pass with:

- Zero critical bugs
- All assertions passing
- No console errors
- Expected outcomes matching actual results
- User workflows completing successfully end-to-end

---

## Notes

- This is a DEMO application for software testing training purposes
- Application may have intentional bugs for testing practice
- Test environment resets may be needed between test runs
- Refer to the [GitHub repository](https://github.com/testsmith-io/practice-software-testing) for additional test scenarios and documentation
