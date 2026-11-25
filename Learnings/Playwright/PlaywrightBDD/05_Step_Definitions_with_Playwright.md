# 05: Step Definitions with Playwright

## Mapping Gherkin Steps to Code

```
Feature File (Gherkin)        Step Definition (JavaScript + Playwright)
Given I am on the login page  →  await this.page.goto('...')
When I enter email "x"        →  await this.page.fill('#email', 'x')
Then I should see dashboard   →  await expect(this.page).toHaveURL('...')
```

---

## Basic Step Definition Pattern

### Without Parameters

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');

Given('I am on the login page', async function() {
  await this.page.goto('https://example.com/login');
});

When('I click the login button', async function() {
  await this.page.click('button[type="submit"]');
});

Then('I should be on the dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});
```

### With Parameters (String)

```javascript
When('I enter email {string}', async function(email) {
  await this.page.fill('#email', email);
});

When('I enter password {string}', async function(password) {
  await this.page.fill('#password', password);
});

Then('I should see {string}', async function(text) {
  await expect(this.page.locator(`text=${text}`)).toBeVisible();
});
```

### With Parameters (Number)

```javascript
Then('cart should contain {int} item', async function(count) {
  const badge = await this.page.locator('[data-test="cart-count"]');
  expect(await badge.textContent()).toBe(count.toString());
});

When('I wait {int} seconds', async function(seconds) {
  await this.page.waitForTimeout(seconds * 1000);
});
```

### With Multiple Parameters

```javascript
When('I fill {string} with {string}', async function(label, value) {
  const input = this.page.locator(`label:has-text("${label}") + input`);
  await input.fill(value);
});

Then('I should see {string} with value {string}', async function(label, value) {
  const element = this.page.locator(`label:has-text("${label}") + div`);
  expect(await element.textContent()).toContain(value);
});
```

---

## Working with Data Tables

### Simple Data Table

**Feature:**
```gherkin
Given I have the following items:
  | item     | quantity | price |
  | Laptop   | 1        | 999   |
  | Mouse    | 2        | 25    |
```

**Step Definition:**
```javascript
Given('I have the following items:', async function(dataTable) {
  const items = dataTable.hashes(); // Array of objects
  
  for (const item of items) {
    await this.addToCart(item.item, item.quantity);
  }
});
```

### Nested Data Table

```gherkin
Given I have the following user profile:
  | field     | value          |
  | firstName | John           |
  | lastName  | Doe            |
  | email     | john@example.com |
```

**Step Definition:**
```javascript
Given('I have the following user profile:', async function(dataTable) {
  const profile = dataTable.rowsHash(); // Object with key-value pairs
  
  await this.fillForm({
    '[data-test="firstName"]': profile.firstName,
    '[data-test="lastName"]': profile.lastName,
    '[data-test="email"]': profile.email
  });
});
```

---

## Working with Multi-line Strings

### Feature File

```gherkin
When I write the following comment:
  """
  This is a multi-line comment
  that spans multiple lines
  and preserves formatting
  """
```

### Step Definition

```javascript
When('I write the following comment:', async function(comment) {
  await this.page.fill('[data-test="comment-textarea"]', comment);
});
```

---

## Advanced Step Definitions

### Conditional Logic

```javascript
When('I click the {string} button if visible', async function(buttonText) {
  const button = this.page.locator(`button:has-text("${buttonText}")`);
  if (await button.isVisible()) {
    await button.click();
  }
});
```

### Reusable Helper Methods

```javascript
// Helper methods in World class
class PlaywrightWorld extends World {
  async fillForm(fields) {
    for (const [selector, value] of Object.entries(fields)) {
      await this.page.fill(selector, value);
    }
  }

  async expectText(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async getTableData(tableSelector) {
    const rows = this.page.locator(`${tableSelector} tbody tr`);
    const count = await rows.count();
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const cells = await rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const rowData = [];
      
      for (let j = 0; j < cellCount; j++) {
        rowData.push(await cells.nth(j).textContent());
      }
      data.push(rowData);
    }
    return data;
  }
}

// Use in steps
When('I fill the registration form with:', async function(dataTable) {
  const data = dataTable.rowsHash();
  await this.fillForm({
    '#firstName': data.firstName,
    '#lastName': data.lastName,
    '#email': data.email
  });
});

Then('I should see the following table data:', async function(dataTable) {
  const tableData = await this.getTableData('table.results');
  const expectedData = dataTable.raw();
  
  expect(tableData).toEqual(expectedData);
});
```

### Async/Await Handling

```javascript
When('I add all products to cart', async function() {
  const products = await this.page.locator('[data-test="product"]').all();
  
  for (const product of products) {
    const addBtn = product.locator('[data-test="add-btn"]');
    await addBtn.click();
    await this.page.waitForTimeout(500); // Wait between clicks
  }
});
```

---

## Error Handling in Steps

### Try-Catch Pattern

```javascript
When('I attempt to upload file {string}', async function(filePath) {
  try {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    this.uploadResult = 'success';
  } catch (error) {
    this.uploadResult = 'failed';
    this.errorMessage = error.message;
  }
});

Then('upload should have {string}', async function(result) {
  expect(this.uploadResult).toBe(result);
});
```

### Custom Assertions

```javascript
Then('the page should load within {int} seconds', async function(timeout) {
  const startTime = Date.now();
  
  try {
    await this.page.waitForLoadState('networkidle', { timeout: timeout * 1000 });
    const loadTime = (Date.now() - startTime) / 1000;
    console.log(`Page loaded in ${loadTime} seconds`);
  } catch (error) {
    throw new Error(`Page did not load within ${timeout} seconds`);
  }
});
```

---

## Organizing Step Definitions

### By Feature

```
features/
├── step_definitions/
│   ├── auth.steps.js          (login, logout, register)
│   ├── products.steps.js      (search, browse, details)
│   ├── cart.steps.js          (add, remove, update)
│   ├── checkout.steps.js      (billing, payment)
│   └── common.steps.js        (navigation, assertions)
```

### File Structure

```javascript
// features/step_definitions/cart.steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Setup
Given('I have {int} items in my cart', async function(count) {
  // Implementation
});

// Actions
When('I add {string} to cart', async function(product) {
  // Implementation
});

When('I remove {string} from cart', async function(product) {
  // Implementation
});

// Verifications
Then('cart total should be {string}', async function(total) {
  // Implementation
});

Then('I should see {int} items in cart', async function(count) {
  // Implementation
});
```

---

## 🏋️ Exercises

**Exercise 1:** Write step definitions for a login scenario

<details>
<summary>✅ Answer</summary>

**Feature:**
```gherkin
Scenario: Login with email and password
  Given I am on the login page
  When I enter email "user@example.com"
  And I enter password "Password123"
  And I click the login button
  Then I should be redirected to the dashboard
```

**Step Definitions:**
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function() {
  await this.page.goto('https://example.com/login');
  await expect(this.page.locator('h1')).toContainText('Login');
});

When('I enter email {string}', async function(email) {
  await this.page.fill('[data-test="email"]', email);
});

When('I enter password {string}', async function(password) {
  await this.page.fill('[data-test="password"]', password);
});

When('I click the login button', async function() {
  await this.page.click('[data-test="login-btn"]');
});

Then('I should be redirected to the dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});
```

</details>

**Exercise 2:** Create step definitions with data table

<details>
<summary>✅ Answer</summary>

**Feature:**
```gherkin
When I register with the following details:
  | field     | value          |
  | email     | john@example.com |
  | password  | Pass123!       |
  | firstName | John           |
  | lastName  | Doe            |
```

**Step Definition:**
```javascript
When('I register with the following details:', async function(dataTable) {
  const data = dataTable.rowsHash();
  
  await this.page.fill('[data-test="email"]', data.email);
  await this.page.fill('[data-test="password"]', data.password);
  await this.page.fill('[data-test="firstName"]', data.firstName);
  await this.page.fill('[data-test="lastName"]', data.lastName);
  await this.page.click('[data-test="register-btn"]');
});
```

</details>

---

## 🎤 Interview Questions

1. **What are step parameters and how do you use them?**
   <details>
   <summary>Answer</summary>
   - Parameters capture values from Gherkin steps
   - {string} for text values
   - {int} for integer values
   - {float} for decimal values
   - Reuse same step with different data
   </details>

2. **How do you handle data tables in step definitions?**
   <details>
   <summary>Answer</summary>
   - Use dataTable.hashes() for array of objects
   - Use dataTable.rowsHash() for key-value pairs
   - Use dataTable.raw() for 2D array
   - Iterate through data for processing
   </details>

3. **What's the best way to organize step definitions?**
   <details>
   <summary>Answer</summary>
   - Group by feature/domain (auth, products, cart)
   - Create common.steps.js for shared steps
   - Use helper methods in World class
   - Follow consistent naming patterns
   - Keep files focused and maintainable
   </details>

4. **How do you handle errors in step definitions?**
   <details>
   <summary>Answer</summary>
   - Use try-catch for expected failures
   - Create custom error messages
   - Use expect() for assertions
   - Log errors for debugging
   - Re-throw for step failure
   </details>

5. **How do you reuse steps across features?**
   <details>
   <summary>Answer</summary>
   - Define generic steps in common.steps.js
   - Use parameters for flexibility
   - Create helper methods in World class
   - Avoid duplicate step definitions
   - Share utilities through context
   </details>

---

**Previous:** [04_Gherkin_Feature_Files.md](04_Gherkin_Feature_Files.md)  
**Next:** [06_Hooks_and_Setup_Teardown.md](06_Hooks_and_Setup_Teardown.md)
