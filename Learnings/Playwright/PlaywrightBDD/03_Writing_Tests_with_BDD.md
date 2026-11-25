# 03: Writing Tests with BDD

## BDD Principles in Playwright Context

### The Three Amigos

Before writing a scenario, three perspectives contribute:

1. **Business/Product (What):**
   - What behavior should the system have?
   - What value does it provide to users?
   - What acceptance criteria must be met?

2. **Development (How):**
   - How can we implement this with Playwright?
   - What APIs should we use?
   - How do we automate user interactions?

3. **QA/Testing (Why):**
   - Why is this important to test?
   - What edge cases exist?
   - How should we verify success?

---

## Writing Testable Scenarios

### ✅ Good Scenario

```gherkin
Scenario: User can add item to cart from product page
  Given I am on the products page
  When I click the "Add to Cart" button for "Laptop"
  Then the item should be added to my cart
  And the cart counter should show 1 item
  And I should see a confirmation message
```

### ❌ Bad Scenario

```gherkin
Scenario: Cart functionality
  When I do stuff with the cart
  Then it works
```

---

## Structuring Feature Files

### Single Responsibility

```gherkin
Feature: Shopping Cart Management
  User can manage items in their shopping cart

  Background:
    Given I am logged in
    And I am on the products page

  Scenario: Add single item to cart
    When I add "Laptop" to cart
    Then cart should contain 1 item

  Scenario: Add multiple items to cart
    When I add "Laptop" to cart
    And I add "Mouse" to cart
    Then cart should contain 2 items

  Scenario: Remove item from cart
    Given I have "Laptop" in my cart
    When I remove "Laptop" from cart
    Then my cart should be empty
```

---

## Gherkin Best Practices for Automation

### 1. Clear and Specific Steps

#### ❌ Vague
```gherkin
Given the system is ready
When I do the thing
Then it works
```

#### ✅ Clear
```gherkin
Given I am on the login page
When I enter email "user@example.com" and password "pass123"
Then I should see the dashboard
```

### 2. Avoid Implementation Details

#### ❌ Technical
```gherkin
When I click on CSS selector ".btn-login"
And I wait 3 seconds
Then the DOM should contain "Welcome"
```

#### ✅ Business Focused
```gherkin
When I click the login button
Then I should see the welcome message
```

### 3. Use Consistent Language

```gherkin
# Define standard vocabulary:
✅ "I am on X page" - for navigation
✅ "I fill X with Y" - for input
✅ "I should see X" - for verification
✅ "I click X" - for interactions

# Avoid mixed terms:
❌ "I go to" vs "I navigate to" vs "I open"
❌ "I type" vs "I enter" vs "I fill"
```

### 4. Use Data Tables for Complex Data

```gherkin
Scenario: Register multiple users
  Given I have the following user data:
    | email              | password      | firstName | lastName |
    | john@example.com   | Pass123!      | John      | Doe      |
    | jane@example.com   | SecurePass!   | Jane      | Smith    |
  When I register each user
  Then all registrations should succeed
  And all users should receive confirmation emails
```

### 5. Use Scenario Outlines for Parameterization

```gherkin
Scenario Outline: Login with different credentials
  Given I am on the login page
  When I enter email "<email>"
  And I enter password "<password>"
  Then I should see "<result>"

  Examples: Valid credentials
    | email            | password   | result      |
    | user@example.com | Pass123!   | dashboard   |

  Examples: Invalid credentials
    | email            | password   | result      |
    | invalid@test.com | WrongPass  | error       |
```

---

## BDD Test Workflow

### 1. Discovery Phase

**Question:** What should the application do?

```
Stakeholder: "Users should be able to search for products"
Developer: "How specific is the search? Do we support filters?"
QA: "What happens when no results are found?"
```

### 2. Write Scenario

```gherkin
Feature: Product Search
  Scenario: User searches for available product
    Given I am on the products page
    When I search for "laptop"
    Then I should see products matching "laptop"
    And the search results should not be empty
```

### 3. Implement Steps

```javascript
Given('I am on the products page', async function() {
  await this.page.goto('https://example.com/products');
});

When('I search for {string}', async function(query) {
  await this.page.fill('#search', query);
  await this.page.press('#search', 'Enter');
  await this.page.waitForURL(`**/?search=${query}`);
});

Then('I should see products matching {string}', async function(keyword) {
  const results = await this.page.locator('[data-test="product-item"]');
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
});
```

### 4. Execute & Verify

```bash
npm test features/search.feature
```

### 5. Refactor/Optimize

- Reuse common steps
- Create helper methods
- Optimize selectors
- Improve performance

---

## Example: Complete Feature with Steps

### Feature File: `shopping_cart.feature`

```gherkin
Feature: Shopping Cart Functionality
  Users can manage their shopping cart and proceed to checkout

  Background:
    Given I am on the online store
    And I am logged in as "customer@example.com"

  Scenario: Add item to empty cart
    Given my cart is empty
    When I search for "wireless mouse"
    And I add the first result to my cart
    Then my cart should contain 1 item
    And the cart total should be "$25.99"

  Scenario: Cart persists after navigation
    Given I have "keyboard" in my cart
    When I navigate to the home page
    And I navigate back to my cart
    Then my cart should still contain "keyboard"

  Scenario Outline: Apply discount codes
    Given I have items worth <amount> in my cart
    When I apply discount code "<code>"
    Then the discount should be <discount>
    And the total should be <final_amount>

    Examples:
      | amount | code    | discount | final_amount |
      | 100    | SAVE10  | 10       | 90           |
      | 100    | SAVE20  | 20       | 80           |
```

### Step Definitions: `cart.steps.js`

```javascript
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('my cart is empty', async function() {
  await this.page.goto('https://example.com/cart');
  const items = await this.page.locator('[data-test="cart-item"]').count();
  expect(items).toBe(0);
});

When('I search for {string}', async function(query) {
  await this.page.fill('[data-test="search"]', query);
  await this.page.press('[data-test="search"]', 'Enter');
  await this.page.waitForSelector('[data-test="product"]');
});

When('I add the first result to my cart', async function() {
  await this.page.click('[data-test="product"] >> nth=0 >> [data-test="add-to-cart"]');
  await this.page.waitForSelector('[data-test="cart-updated"]');
});

Then('my cart should contain {int} item', async function(count) {
  const badge = await this.page.locator('[data-test="cart-count"]');
  expect(await badge.textContent()).toBe(count.toString());
});

Then('the cart total should be {string}', async function(total) {
  const totalEl = await this.page.locator('[data-test="cart-total"]');
  expect(await totalEl.textContent()).toBe(total);
});
```

---

## 🏋️ Exercises

**Exercise 1:** Convert a user story into Gherkin scenarios

<details>
<summary>✅ Answer</summary>

**User Story:**
"As a customer, I want to filter products by price so that I can find items in my budget"

**Scenarios:**
```gherkin
Feature: Product Filtering
  Scenario: Filter products by price range
    Given I am on the products page
    When I filter products from "$50" to "$100"
    Then I should only see products in this price range

  Scenario: Price filter updates result count
    Given I am viewing all 100 products
    When I apply price filter "$50" to "$100"
    Then the result count should decrease

  Scenario: Clear price filter
    Given I have applied price filter "$50" to "$100"
    When I clear all filters
    Then I should see all products again
```

</details>

**Exercise 2:** Identify what's wrong and fix these scenarios

<details>
<summary>✅ Answer</summary>

**Problems:**
```gherkin
Scenario: Login test
  Given system is running
  When I enter credentials in fields
  And I click button
  Then it logs in
```

**Issues:** Vague steps, no specific values, unclear expectations

**Fixed:**
```gherkin
Scenario: Successful login with valid credentials
  Given I am on the login page
  When I enter email "user@example.com"
  And I enter password "Password123"
  And I click the login button
  Then I should be on the dashboard page
  And I should see "Welcome, User"
```

</details>

---

## 🎤 Interview Questions

1. **What is the difference between a scenario and a test case?**
   <details>
   <summary>Answer</summary>
   - **Scenario:** High-level behavior description in business language (Gherkin)
   - **Test Case:** Detailed technical steps with specific inputs and expected outputs
   - Scenarios are more readable; test cases are more technical
   </details>

2. **How do you decide between Scenario Outline and multiple Scenarios?**
   <details>
   <summary>Answer</summary>
   - Use **Scenario Outline** when testing same behavior with different data
   - Use **Multiple Scenarios** when testing different behaviors
   - Scenario Outlines reduce duplication for parameterized tests
   </details>

3. **What is the purpose of Background in Gherkin?**
   <details>
   <summary>Answer</summary>
   - Define preconditions common to all scenarios in a feature
   - Avoid duplication of setup steps
   - Run before each scenario
   - Improves readability
   </details>

4. **How do you write data-driven tests in BDD?**
   <details>
   <summary>Answer</summary>
   - Use **Scenario Outline** with Examples table
   - Use **Data Tables** in Given/When/Then steps
   - Parametrize tests to run same logic with different inputs
   - Improves test maintainability
   </details>

5. **What makes a good Gherkin scenario?**
   <details>
   <summary>Answer</summary>
   - Clear and specific language
   - Business-focused, not implementation-focused
   - Single responsibility principle
   - Independent from other scenarios
   - Readable by non-technical stakeholders
   - Deterministic and reliable
   </details>

---

**Previous:** [02_Setup_and_Configuration.md](02_Setup_and_Configuration.md)  
**Next:** [04_Gherkin_Feature_Files.md](04_Gherkin_Feature_Files.md)
