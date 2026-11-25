# 08: Best Practices for Playwright BDD

## 1. Writing Maintainable Feature Files

### ✅ Good - Clear and Business-Focused

```gherkin
Feature: User Account Management
  Users can create and manage their accounts

  Scenario: User can reset forgotten password
    Given I am on the login page
    When I click "Forgot Password" link
    Then I should see the password reset form
    When I enter my email address
    And I click "Send Reset Link"
    Then I should see confirmation message
    And I should receive password reset email
```

### ❌ Bad - Vague and Technical

```gherkin
Feature: Account stuff

  Scenario: Password thing
    When I do something
    Then stuff happens
    And more stuff
```

---

## 2. Step Definition Best Practices

### ✅ Reusable and Maintainable

```javascript
// Good: Flexible step with parameters
When('I fill the form with:', async function(dataTable) {
  const data = dataTable.rowsHash();
  for (const [field, value] of Object.entries(data)) {
    await this.page.fill(`[data-field="${field}"]`, value);
  }
});

// Good: Helper method for common action
async fillLoginForm(email, password) {
  await this.page.fill('#email', email);
  await this.page.fill('#password', password);
}

// Good: Descriptive assertions
Then('I should see success message', async function() {
  const message = this.page.locator('[role="alert"].success');
  await expect(message).toContainText('Success');
});
```

### ❌ Hardcoded and Brittle

```javascript
// Bad: Hardcoded values
When('I login', async function() {
  await this.page.fill('#email', 'user@example.com');
  await this.page.fill('#password', 'password123');
  await this.page.click('button'); // Which button?
});

// Bad: Specific assertion
Then('I should see welcome', async function() {
  const text = await this.page.textContent();
  expect(text).toBe('Welcome to our site!'); // Too specific
});
```

---

## 3. Selector Strategy

### ✅ Best Practices

```javascript
// 1. Prefer data-test attributes (most stable)
await this.page.fill('[data-test="email"]', email);

// 2. Use role-based selectors (accessible)
await this.page.click('button:has-text("Login")');

// 3. Use label association (semantic)
const emailInput = this.page.locator('label:has-text("Email") + input');

// 4. Last resort: CSS/XPath
await this.page.click('div.form button.btn-primary');
```

### ❌ Anti-Patterns

```javascript
// Bad: Class-based (brittle with style changes)
await this.page.click('.btn-primary.ml-3.mt-2');

// Bad: Index-based (order matters)
await this.page.click('button >> nth=5');

// Bad: Long XPath (fragile)
await this.page.click('/html/body/div[2]/form/button[1]');
```

---

## 4. Explicit Waits vs Implicit

### ✅ Use Explicit Waits

```javascript
// Good: Wait for specific condition
When('I search for products', async function(query) {
  await this.page.fill('[data-test="search"]', query);
  await this.page.press('[data-test="search"]', 'Enter');
  
  // Wait for results to load
  await this.page.waitForSelector('[data-test="product-item"]');
});

// Good: Wait for navigation
When('I click the checkout button', async function() {
  await this.page.click('[data-test="checkout"]');
  
  // Wait for page load
  await this.page.waitForURL('**/checkout');
});

// Good: Wait for API response
When('I save the form', async function() {
  const responsePromise = this.page.waitForResponse(
    res => res.url().includes('/api/save') && res.status() === 200
  );
  
  await this.page.click('[data-test="save-btn"]');
  await responsePromise; // Ensure API call completed
});
```

### ❌ Avoid Hardcoded Waits

```javascript
// Bad: Sleep (unreliable)
When('I click the button', async function() {
  await this.page.click('button');
  await this.page.waitForTimeout(2000); // Magic number!
});

// Bad: Implicit retry without verification
When('I do something', async function() {
  // Hoping element appears eventually
  await this.page.click('button'); // Will fail if not ready
});
```

---

## 5. Error Handling and Debugging

### Meaningful Error Messages

```javascript
// Good: Descriptive error
Then('payment should succeed', async function() {
  const statusElement = this.page.locator('[data-test="payment-status"]');
  const status = await statusElement.textContent();
  
  expect(status).toBe('SUCCESS', 
    `Expected payment status 'SUCCESS' but got '${status}'`
  );
});

// Good: Multiple assertion details
Then('cart should have correct totals', async function() {
  const subtotal = await this.getTotal('subtotal');
  const tax = await this.getTotal('tax');
  const shipping = await this.getTotal('shipping');
  const total = await this.getTotal('total');
  
  const calculated = subtotal + tax + shipping;
  expect(total).toBe(calculated,
    `Total (${total}) should equal subtotal (${subtotal}) + tax (${tax}) + shipping (${shipping})`
  );
});
```

---

## 6. Test Isolation

### Each Test Should Be Independent

```javascript
// Good: Setup per test
Before(async function() {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
});

After(async function() {
  await this.page.close();
  await this.browser.close();
});

// Bad: Shared state between tests
let globalPage; // Will cause issues!

Before(async function() {
  if (!globalPage) {
    globalPage = await browser.newPage();
  }
  this.page = globalPage;
});
```

---

## 7. Performance Optimization

### Avoid Unnecessary Navigation

```javascript
// Good: Reuse page context
Given('I am logged in', async function() {
  await this.page.goto('https://example.com/login');
  // Login once
  this.isLoggedIn = true;
});

When('I go to dashboard', async function() {
  if (this.isLoggedIn) {
    // Navigate without re-login
    await this.page.goto('https://example.com/dashboard');
  }
});

// Bad: Unnecessary page reloads
When('I do something', async function() {
  await this.page.goto('https://example.com'); // Unnecessary reload
  await this.page.click('button');
});
```

### Parallel Execution

```javascript
// cucumber.js
module.exports = {
  default: {
    parallel: 4, // Run 4 scenarios in parallel
    require: ['features/step_definitions/**/*.js']
  }
};

// Each scenario gets isolated browser instance
Before(async function() {
  this.browser = await chromium.launch();
  // Independent context per scenario
});
```

---

## 8. Reporting and Artifacts

### Capture Evidence

```javascript
After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    // Screenshot
    const fileName = `${scenario.pickle.name}`;
    await this.page.screenshot({ 
      path: `reports/screenshots/${fileName}.png` 
    });

    // Page source
    const html = await this.page.content();
    fs.writeFileSync(`reports/html/${fileName}.html`, html);

    // Browser logs
    console.log('Console logs:', this.consoleLogs);
    
    // Network logs
    console.log('Failed requests:', this.failedRequests);
  }
});
```

---

## 9. Data Management

### Use Test Data Builders

```javascript
// Good: Reusable data
const testData = {
  validUser: {
    email: 'test@example.com',
    password: 'ValidPass123'
  },
  invalidUser: {
    email: 'invalid@test',
    password: 'short'
  },
  products: [
    { name: 'Laptop', price: 999 },
    { name: 'Mouse', price: 25 }
  ]
};

// Use in steps
When('I login with valid credentials', async function() {
  const user = testData.validUser;
  await this.page.fill('#email', user.email);
  await this.page.fill('#password', user.password);
});

// Bad: Hardcoded in steps
When('I login', async function() {
  await this.page.fill('#email', 'test@example.com');
  await this.page.fill('#password', 'ValidPass123');
});
```

---

## 10. Common Pitfalls to Avoid

### ❌ Over-Testing Implementation

```gherkin
# Bad: Testing implementation details
Scenario: Check DOM structure
  When I check the div has class "hidden"
  Then the element should have display: none CSS

# Good: Test observable behavior
Scenario: Element is hidden
  When I perform action
  Then element should not be visible
```

### ❌ Brittle Feature Files

```gherkin
# Bad: Too specific
Scenario: User can purchase item
  When I click button at coordinates 123, 456
  Then I see text exactly "Thank you for your order #12345!"

# Good: Flexible
Scenario: User receives order confirmation
  When I complete the purchase
  Then I should see confirmation message
  And I should receive confirmation email
```

### ❌ Ignoring Flakiness

```javascript
// Bad: Ignore test failures
it.skip('sometimes flaky test', () => {
  // Will never run!
});

// Good: Fix root cause
When('element appears', async function() {
  // Use proper waits instead of sleep
  await this.page.waitForSelector('[data-test="element"]');
});
```

---

## Checklist: Before Committing Tests

- ✅ Feature file is readable by non-technical people
- ✅ Steps are independent and reusable
- ✅ All selectors use data-test attributes
- ✅ No hardcoded waits (sleep)
- ✅ Proper error messages for failures
- ✅ Tests pass consistently (no flakiness)
- ✅ Each test is isolated
- ✅ Resources are cleaned up after tests
- ✅ Performance is acceptable
- ✅ Code follows team conventions

---

## 🏋️ Exercises

**Exercise 1:** Identify and fix issues in this test

<details>
<summary>✅ Answer</summary>

**Problems:**
```javascript
// Bad example
When('I add product', async function() {
  await this.page.click('button'); // Which button?
  await this.page.waitForTimeout(2000); // Magic wait
});

Then('it works', async function() {
  expect(true).toBe(true); // No real assertion
});
```

**Fixed:**
```javascript
When('I add {string} to cart', async function(productName) {
  const addBtn = this.page.locator(
    `[data-test="product-${productName}"] button:has-text("Add")`
  );
  await addBtn.click();
});

Then('cart should contain {string}', async function(productName) {
  const cartItem = this.page.locator(
    `[data-test="cart-item-${productName}"]`
  );
  await expect(cartItem).toBeVisible();
});
```

</details>

**Exercise 2:** Refactor tests for better maintainability

<details>
<summary>✅ Answer</summary>

**Before:**
```javascript
Given('I login as admin', async function() {
  await this.page.goto('https://example.com/login');
  await this.page.fill('#email', 'admin@example.com');
  await this.page.fill('#password', 'Admin123!');
  await this.page.click('button[type="submit"]');
  await this.page.waitForURL('**/dashboard');
});

Given('I login as user', async function() {
  await this.page.goto('https://example.com/login');
  await this.page.fill('#email', 'user@example.com');
  await this.page.fill('#password', 'User123!');
  await this.page.click('button[type="submit"]');
  await this.page.waitForURL('**/dashboard');
});
```

**After (DRY):**
```javascript
// Define test users
const testUsers = {
  admin: { email: 'admin@example.com', password: 'Admin123!' },
  user: { email: 'user@example.com', password: 'User123!' }
};

// Reusable step
Given('I am logged in as {string}', async function(role) {
  const userCreds = testUsers[role];
  await this.page.goto('https://example.com/login');
  await this.page.fill('[data-test="email"]', userCreds.email);
  await this.page.fill('[data-test="password"]', userCreds.password);
  await this.page.click('[data-test="login-btn"]');
  await this.page.waitForURL('**/dashboard');
});
```

</details>

---

## 🎤 Interview Questions

1. **What makes a good Gherkin scenario?**
   <details>
   <summary>Answer</summary>
   - Clear, specific language
   - Business-focused, not technical
   - Single responsibility
   - Independent from other scenarios
   - Readable by non-technical stakeholders
   - Deterministic and reliable
   </details>

2. **How do you avoid flaky tests?**
   <details>
   <summary>Answer</summary>
   - Use explicit waits (waitFor methods)
   - Avoid hardcoded sleep
   - Use stable selectors (data-test)
   - Ensure proper test isolation
   - Fix root causes, not symptoms
   - Run tests multiple times to verify
   </details>

3. **What's the difference between good and bad selectors?**
   <details>
   <summary>Answer</summary>
   - **Good:** data-test attributes, role-based, semantic HTML
   - **Bad:** Class-based (style changes), index-based (order matters), XPath (fragile)
   - Prefer explicit over implicit
   - Maintenance matters more than brevity
   </details>

4. **How do you maintain test code as project grows?**
   <details>
   <summary>Answer</summary>
   - Use Page Object Model
   - Create reusable helper methods
   - Avoid code duplication
   - Use data builders for test data
   - Follow consistent naming
   - Organize by feature/domain
   </details>

5. **What's the relationship between feature files and step definitions?**
   <details>
   <summary>Answer</summary>
   - Feature files describe WHAT (business language)
   - Step definitions describe HOW (Playwright code)
   - Loose coupling via step patterns
   - Multiple features can share steps
   - Easy to refactor either independently
   </details>

---

**Previous:** [07_Advanced_Patterns.md](07_Advanced_Patterns.md)  
**Back to:** [00_TABLE_OF_CONTENTS.md](00_TABLE_OF_CONTENTS.md)
