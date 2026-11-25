# 07: Advanced Patterns

## Page Object Model with BDD

### Traditional POM Approach

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  get emailInput() {
    return this.page.locator('[data-test="email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="password"]');
  }

  get loginButton() {
    return this.page.locator('[data-test="login-btn"]');
  }

  async navigate() {
    await this.page.goto('https://example.com/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
```

### BDD Integration with POM

```javascript
// features/step_definitions/auth.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../../pages/LoginPage');

Given('I am on the login page', async function() {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigate();
});

When('I login with {string} and {string}', async function(email, password) {
  await this.loginPage.login(email, password);
});

Then('I should be on the dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});
```

---

## Sharing State Between Steps

### Using World/Context Object

```javascript
// features/support/world.js
class AppWorld {
  constructor(options) {
    this.browser = null;
    this.page = null;
    this.userData = {};
    this.cartItems = [];
    this.orderData = null;
  }

  setUserData(user) {
    this.userData = user;
  }

  addToCart(item) {
    this.cartItems.push(item);
  }

  setOrderData(order) {
    this.orderData = order;
  }
}

module.exports = AppWorld;
```

### Using Shared State in Steps

```javascript
// Feature
Given('I register with email {string}', async function(email) {
  this.userData = { email };
});

When('I login with the registered email', async function() {
  await this.page.fill('#email', this.userData.email);
  // ...
});

Then('order should use registered email', async function() {
  expect(this.orderData.email).toBe(this.userData.email);
});
```

---

## Parameterized Hooks

### Dynamic Setup Based on Tags

```javascript
const taggedHooks = require('@cucumber/cucumber').setDefaultTimeout(10000);

Before({ tags: '@critical' }, async function() {
  // Slower browser for debugging
  this.browser = await chromium.launch({ slowMo: 100 });
});

Before({ tags: '@performance' }, async function() {
  // No slowMo for performance tests
  this.browser = await chromium.launch({ headless: true });
});

Before({ tags: '@headless' }, async function() {
  this.browser = await chromium.launch({ headless: true });
});
```

---

## Asynchronous Step Chains

### Wait for Async Operations

```javascript
When('I add {string} to cart', async function(item) {
  await this.page.click(`[data-product="${item}"] .add-btn`);
  
  // Wait for cart update
  await this.page.waitForFunction(() => {
    const count = document.querySelector('[data-test="cart-count"]');
    return count && parseInt(count.textContent()) > 0;
  });
});

Then('cart should be updated', async function() {
  const cartBadge = await this.page.locator('[data-test="cart-count"]');
  await expect(cartBadge).toBeVisible();
});
```

### Network Wait Patterns

```javascript
When('I save the form', async function() {
  // Wait for specific API request
  const responsePromise = this.page.waitForResponse(
    response => response.url().includes('/api/save') && response.status() === 200
  );
  
  await this.page.click('button[type="submit"]');
  const response = await responsePromise;
  
  this.savedData = await response.json();
});
```

---

## Retry Logic

### Flaky Test Handling

```javascript
Then('the element should be visible after retry', async function() {
  let found = false;
  const maxRetries = 3;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const element = this.page.locator('[data-test="target"]');
      await expect(element).toBeVisible({ timeout: 2000 });
      found = true;
      break;
    } catch (error) {
      if (i < maxRetries - 1) {
        await this.page.waitForTimeout(500);
      }
    }
  }
  
  expect(found).toBeTruthy();
});
```

### Retry Entire Step

```javascript
const { Given } = require('@cucumber/cucumber');

function retryWithBackoff(fn, retries = 3, delayMs = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(attemptNum) {
      fn()
        .then(resolve)
        .catch((error) => {
          if (attemptNum < retries) {
            setTimeout(() => attempt(attemptNum + 1), delayMs);
          } else {
            reject(error);
          }
        });
    }
    attempt(0);
  });
}

Given('the API endpoint is available', async function() {
  await retryWithBackoff(async () => {
    const response = await this.page.evaluate(() => 
      fetch('/api/health').then(r => r.json())
    );
    if (!response.ok) throw new Error('API not ready');
  });
});
```

---

## Complex Workflow Example

### Multi-Step Business Process

```gherkin
Feature: Complete Purchase Workflow
  
  @workflow @critical
  Scenario: End-to-end purchase journey
    Given I am browsing the online store
    When I search for "laptop"
    And I add the first result to cart
    And I proceed to checkout
    And I enter shipping address:
      | field | value |
      | street | 123 Main St |
      | city | Springfield |
    And I select payment method "Credit Card"
    And I complete the purchase
    Then my order should be confirmed
    And I should receive confirmation email
    And inventory should be updated
```

### Implementation

```javascript
When('I add the first result to cart', async function() {
  await this.page.click('[data-test="product"] >> nth=0 >> .add-to-cart');
  this.cartItems.push(await this.getProductFromUI());
});

When('I proceed to checkout', async function() {
  await this.page.click('[data-test="cart"] >> button:has-text("Checkout")');
  await this.page.waitForURL('**/checkout');
});

When('I enter shipping address:', async function(dataTable) {
  const data = dataTable.rowsHash();
  for (const [field, value] of Object.entries(data)) {
    await this.page.fill(`[data-field="${field}"]`, value);
  }
  this.shippingData = data;
});

Then('inventory should be updated', async function() {
  // Verify via API
  const inventory = await this.page.evaluate(async () => {
    const response = await fetch('/api/inventory');
    return response.json();
  });
  
  expect(inventory.updated).toBeTruthy();
});
```

---

## Cucumber Expressions (Advanced)

### Custom Parameter Types

```javascript
// features/support/hooks.js
const { defineParameterType, BeforeAll } = require('@cucumber/cucumber');

defineParameterType({
  name: 'email',
  regexp: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  transformer: (email) => email
});

defineParameterType({
  name: 'product',
  regexp: /(laptop|mouse|keyboard|monitor)/i,
  transformer: (product) => product.toLowerCase()
});

defineParameterType({
  name: 'currency',
  regexp: /\$([0-9]+(?:\.[0-9]{2})?)/,
  transformer: (amount) => parseFloat(amount)
});
```

### Usage

```gherkin
Then('I should see {email} in the system'
Then('I add {product} to cart'
When('the price is {currency}'
```

---

## 🏋️ Exercises

**Exercise 1:** Implement Page Object Model for shopping flow

<details>
<summary>✅ Answer</summary>

```javascript
// pages/ShoppingCart.js
class ShoppingCart {
  constructor(page) {
    this.page = page;
  }

  async addProduct(productName) {
    await this.page.click(
      `[data-product="${productName}"] >> button:has-text("Add")`
    );
  }

  async getCartCount() {
    const badge = await this.page.locator('[data-test="cart-count"]');
    return parseInt(await badge.textContent());
  }

  async getCartTotal() {
    const total = await this.page.locator('[data-test="cart-total"]');
    return await total.textContent();
  }

  async checkout() {
    await this.page.click('button:has-text("Checkout")');
  }
}

// Step definition
When('I add {string} to cart', async function(product) {
  if (!this.cartPage) {
    this.cartPage = new ShoppingCart(this.page);
  }
  await this.cartPage.addProduct(product);
});
```

</details>

**Exercise 2:** Implement shared state management

<details>
<summary>✅ Answer</summary>

```javascript
// features/support/world.js
class AppWorld {
  constructor() {
    this.user = {};
    this.order = {};
    this.cart = [];
  }

  registerUser(email, password) {
    this.user = { email, password, registered: true };
  }

  createOrder(items, total) {
    this.order = { items, total, created: Date.now() };
  }

  getOrder() {
    return this.order;
  }
}

// Step definitions
Given('I register as {string}', async function(email) {
  this.registerUser(email, 'password123');
  await this.page.fill('#email', email);
});

Then('order should be for registered user', async function() {
  const order = this.getOrder();
  expect(order.user).toBe(this.user.email);
});
```

</details>

---

## 🎤 Interview Questions

1. **What is Page Object Model and why use it in BDD?**
   <details>
   <summary>Answer</summary>
   - Encapsulates page UI elements and interactions
   - Separates UI logic from test logic
   - Makes tests more maintainable
   - Reuses page methods across steps
   - Easier to update when UI changes
   </details>

2. **How do you share state between steps in Cucumber?**
   <details>
   <summary>Answer</summary>
   - Use World/context object
   - Store data in this.variable
   - Accessible across all steps in scenario
   - Each scenario gets fresh World instance
   - Use for user data, order info, etc.
   </details>

3. **What are Cucumber Expressions and custom parameter types?**
   <details>
   <summary>Answer</summary>
   - Define custom step parameters
   - Transform text to specific types
   - Reuse across multiple steps
   - Makes steps more readable
   - Supports regex patterns
   </details>

4. **How do you handle flaky tests in BDD?**
   <details>
   <summary>Answer</summary>
   - Implement retry logic with backoff
   - Use proper waits (waitForFunction, waitForResponse)
   - Avoid sleep/hardcoded waits
   - Fix root cause, not symptoms
   - Use idempotent operations
   </details>

5. **What's the best approach for complex multi-step workflows?**
   <details>
   <summary>Answer</summary>
   - Break into logical steps
   - Share state via World object
   - Use Page Objects for UI interactions
   - Implement helper methods
   - Keep steps focused and readable
   </details>

---

**Previous:** [06_Hooks_and_Setup_Teardown.md](06_Hooks_and_Setup_Teardown.md)  
**Next:** [08_Best_Practices.md](08_Best_Practices.md)
