# 04: Gherkin Feature Files for Playwright Automation

## Feature File Structure

```gherkin
Feature: Descriptive feature name
  Feature description that explains the business value

  Background:
    # Common steps for all scenarios

  Scenario: Specific scenario name
    Given precondition
    When action
    Then expected result
```

---

## Real-World Example: E-Commerce Feature File

### File: `shopping_checkout.feature`

```gherkin
Feature: Shopping Checkout Process
  As a customer
  I want to complete my purchase
  So that I can receive my order

  Background:
    Given I am logged in
    And the checkout feature is available
    And my cart contains the following items:
      | product   | quantity | price |
      | Laptop    | 1        | 999   |
      | Mouse     | 2        | 25    |

  @smoke @critical
  Scenario: Complete checkout with valid payment
    Given I am on the checkout page
    When I fill in the billing address:
      | field       | value          |
      | street      | 123 Main St    |
      | city        | Springfield    |
      | state       | IL             |
      | zip         | 62701          |
    And I fill in the payment details:
      | field      | value              |
      | cardNumber | 4532015112830366   |
      | expiry     | 12/25              |
      | cvv        | 123                |
    And I click the "Complete Purchase" button
    Then I should see the order confirmation page
    And I should receive a confirmation email
    And my order should be in the system

  @regression
  Scenario: Checkout fails with invalid card
    Given I am on the checkout page
    When I fill in the payment details with an invalid card
    Then I should see an error message
    And my order should not be created

  @regression
  Scenario: Shipping method selection
    Given I am on the checkout page
    When I select "Express Shipping" as the delivery method
    Then the shipping cost should be updated
    And the total should include the shipping fee

  Scenario Outline: Checkout with different payment methods
    Given I am on the checkout page
    When I select payment method "<method>"
    And I provide valid <method> credentials
    And I click the "Complete Purchase" button
    Then checkout should be "<result>"

    Examples: Supported payment methods
      | method      | result      |
      | Credit Card | successful  |
      | Debit Card  | successful  |
      | PayPal      | successful  |

    Examples: Unsupported methods
      | method      | result  |
      | Cryptocurrency | failed |
```

---

## Feature File Best Practices

### 1. Descriptive Feature Names

```gherkin
✅ Feature: User Authentication and Login
✅ Feature: Shopping Cart Item Management
✅ Feature: Order Payment Processing

❌ Feature: Login
❌ Feature: Cart
❌ Feature: Payment
```

### 2. Clear Scenario Names

```gherkin
✅ Scenario: User can reset password with valid email
✅ Scenario: Payment fails when card is expired
✅ Scenario: Search returns no results for empty query

❌ Scenario: Password reset
❌ Scenario: Payment test
❌ Scenario: Search
```

### 3. Use Tags Effectively

```gherkin
@smoke @critical
Scenario: User can place order

@regression @payment
Scenario: Handle expired payment card

@accessibility @ui
Scenario: Form is keyboard navigable

@slow @performance
Scenario: Search performs well with large dataset
```

### 4. Background for Common Setup

```gherkin
Feature: Product Management

Background:
  Given the product database is initialized
  And I am logged in as an admin
  And I am on the products page

Scenario: Add new product
  When I click "Add Product"
  And I fill in product details
  Then the product should be created

# No need to repeat background steps
```

---

## Linking Feature Files to Playwright

### Feature File Structure

```
features/
├── auth/
│   ├── login.feature
│   ├── logout.feature
│   └── password_reset.feature
├── products/
│   ├── search.feature
│   ├── browse.feature
│   └── details.feature
├── shopping/
│   ├── cart.feature
│   ├── checkout.feature
│   └── orders.feature
└── step_definitions/
    ├── auth.steps.js
    ├── products.steps.js
    └── shopping.steps.js
```

### Step Definition Pattern

For each step in feature files, create corresponding step definition:

**Feature:**
```gherkin
Given I am on the checkout page
When I fill in the billing address with "123 Main St"
Then I should see the payment form
```

**Step Definition:**
```javascript
// billing.steps.js

Given('I am on the checkout page', async function() {
  await this.page.goto('https://example.com/checkout');
  await this.page.waitForSelector('[data-test="checkout-form"]');
});

When('I fill in the billing address with {string}', async function(address) {
  await this.page.fill('[data-test="address-input"]', address);
});

Then('I should see the payment form', async function() {
  await expect(this.page.locator('[data-test="payment-form"]')).toBeVisible();
});
```

---

## Advanced Feature Patterns

### 1. Feature Rules (Optional Grouping)

```gherkin
Feature: Discount Management

Rule: Discount codes must be valid
  Scenario: Apply valid discount code
    Given I have a valid discount code
    When I apply it to my cart
    Then my total should be reduced

  Scenario: Reject invalid discount code
    Given I have an invalid discount code
    When I try to apply it
    Then I should see an error

Rule: Discounts have expiration dates
  Scenario: Expired discount cannot be applied
    # ...
```

### 2. Examples with Complex Data

```gherkin
Scenario: Handle different user types
  Given I have users with the following data:
    | username  | email              | role      | status   |
    | john_doe  | john@example.com   | admin     | active   |
    | jane_smith| jane@example.com   | user      | active   |
    | bob_jones | bob@example.com    | user      | inactive |
  When I filter by role "admin"
  Then only admin users should be displayed
```

---

## Organizing Large Feature Sets

### By Feature
```
features/
├── user_management.feature
├── product_catalog.feature
├── shopping_cart.feature
├── payment_processing.feature
└── order_management.feature
```

### By Domain
```
features/
├── auth/
│   ├── login.feature
│   └── registration.feature
├── catalog/
│   ├── search.feature
│   └── browse.feature
└── commerce/
    ├── cart.feature
    └── checkout.feature
```

### By Test Level
```
features/
├── smoke/
│   ├── critical_flows.feature
│   └── happy_paths.feature
├── regression/
│   ├── edge_cases.feature
│   └── error_handling.feature
└── extended/
    └── advanced_scenarios.feature
```

---

## 🏋️ Exercises

**Exercise 1:** Create a feature file for a login flow

<details>
<summary>✅ Answer</summary>

```gherkin
Feature: User Login
  As a user
  I want to log into the application
  So that I can access my account

  Background:
    Given I am on the login page
    And the login service is available

  @smoke @critical
  Scenario: Successful login with valid credentials
    When I enter email "user@example.com"
    And I enter password "Password123"
    And I click the login button
    Then I should be on the dashboard
    And I should see "Welcome"

  @regression
  Scenario: Login fails with invalid password
    When I enter email "user@example.com"
    And I enter password "WrongPassword"
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  @regression
  Scenario Outline: Login attempts with various credentials
    When I enter email "<email>"
    And I enter password "<password>"
    And I click the login button
    Then the result should be "<outcome>"

    Examples:
      | email              | password      | outcome  |
      | valid@example.com  | ValidPass123  | success  |
      | invalid@example.com| AnyPassword   | failed   |
      | valid@example.com  | WrongPassword | failed   |
```

</details>

**Exercise 2:** Analyze this feature file and identify improvements

<details>
<summary>✅ Answer</summary>

**Original (Poor):**
```gherkin
Feature: Search

Scenario: Search works
  When I search for something
  Then results appear
```

**Improvements:**
1. Add descriptive feature name
2. Add specific test data
3. Add background context
4. Add tags for organization
5. Add multiple scenarios for edge cases

**Improved:**
```gherkin
Feature: Product Search Functionality
  Users can search the product catalog
  to find items they want to purchase

Background:
  Given I am on the products page
  And the search index is up to date

@smoke
Scenario: Search returns matching products
  When I search for "laptop"
  Then I should see products matching "laptop"
  And the result count should be displayed

@regression
Scenario: Search with no results
  When I search for "nonexistent_product_xyz"
  Then I should see "No results found"
  And I should see search suggestions

@accessibility
Scenario: Search form is keyboard accessible
  When I focus on the search field
  Then I should navigate results with keyboard
  And I can submit with Enter key
```

</details>

---

## 🎤 Interview Questions

1. **What information should be in a feature file?**
   <details>
   <summary>Answer</summary>
   - Feature name and description
   - Business value and user perspective
   - Background common setup
   - Multiple scenarios covering different cases
   - Appropriate tags for organization
   - Examples for parameterized tests
   </details>

2. **How do you organize feature files for large projects?**
   <details>
   <summary>Answer</summary>
   - By domain/module (auth, products, commerce)
   - By feature area (happy path, edge cases, error handling)
   - By test level (smoke, regression, extended)
   - Use meaningful folder structure
   - Keep related scenarios together
   </details>

3. **What's the relationship between feature files and step definitions?**
   <details>
   <summary>Answer</summary>
   - Feature files describe WHAT to test (business language)
   - Step definitions describe HOW to test (Playwright code)
   - Each step in feature must have matching step definition
   - Multiple features can share step definitions
   - Loose coupling via step patterns
   </details>

4. **How do you use tags for test organization?**
   <details>
   <summary>Answer</summary>
   - @smoke: Critical tests
   - @regression: Full test suite
   - @slow: Long-running tests
   - @wip: Work in progress
   - Run specific tags: `cucumber-js --tags @smoke`
   </details>

5. **When should you use Scenario Outline vs multiple Scenarios?**
   <details>
   <summary>Answer</summary>
   - **Scenario Outline:** Same flow, different data
   - **Multiple Scenarios:** Different flows/behaviors
   - Scenario Outline reduces duplication
   - Use Examples table for parameterization
   - Each example runs complete scenario
   </details>

---

**Previous:** [03_Writing_Tests_with_BDD.md](03_Writing_Tests_with_BDD.md)  
**Next:** [05_Step_Definitions_with_Playwright.md](05_Step_Definitions_with_Playwright.md)
