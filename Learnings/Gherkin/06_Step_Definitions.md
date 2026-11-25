# 06: Step Definitions

## What are Step Definitions?

Step definitions are code that implements the action described by Gherkin steps. They bridge the gap between human-readable scenarios and automation code.

---

## How Step Definitions Work

```
Gherkin (Feature File)
       ↓
Given I am on the login page
       ↓
Cucumber looks for matching step definition
       ↓
Automation code executes
       ↓
Step passes or fails
```

---

## JavaScript/Node.js with Cucumber

### Installation
```bash
npm install @cucumber/cucumber playwright
```

### Step Definitions File Structure
```javascript
// features/step_definitions/login.steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function() {
  await this.page.goto('https://example.com/login');
});

When('I enter {string} and {string}', async function(email, password) {
  await this.page.fill('#email', email);
  await this.page.fill('#password', password);
});

Then('I should see the dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});
```

---

## Step Definition Patterns

### 1. Basic Steps (No Parameters)
```javascript
Given('I am logged in', async function() {
  // Implementation
  await login(this.page);
});

When('I click the submit button', async function() {
  await this.page.click('button[type="submit"]');
});

Then('I should see success message', async function() {
  await expect(this.page.locator('.success')).toBeVisible();
});
```

### 2. Steps with Parameters (Strings)
```javascript
// Gherkin:
// When I enter "john@example.com" in email field

When('I enter {string} in email field', async function(email) {
  await this.page.fill('#email', email);
});

// Gherkin:
// When I fill form with "John" and "password123"

When('I fill form with {string} and {string}', async function(name, password) {
  await this.page.fill('#name', name);
  await this.page.fill('#password', password);
});
```

### 3. Steps with Numeric Parameters
```javascript
// Gherkin:
// When I add 5 items to cart

When('I add {int} items to cart', async function(quantity) {
  for (let i = 0; i < quantity; i++) {
    await this.page.click('#addToCart');
  }
});
```

### 4. Steps with Data Tables
```javascript
// Gherkin:
// Given the following users exist:
//   | name  | email            |
//   | Alice | alice@test.com   |
//   | Bob   | bob@test.com     |

Given('the following users exist:', async function(dataTable) {
  const users = dataTable.hashes(); // Convert to array of objects
  for (const user of users) {
    await createUser(user.name, user.email);
  }
});
```

### 5. Steps with Multi-line Strings
```javascript
// Gherkin:
// When I enter the following feedback:
//   """
//   Great application but needs improvement
//   """

When('I enter the following feedback:', async function(text) {
  await this.page.fill('#feedback', text);
});
```

---

## Hooks (Setup and Teardown)

### Before and After Hooks
```javascript
const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');

BeforeAll(async function() {
  console.log('Running before all scenarios');
  // Start server, initialize DB
});

Before(async function() {
  console.log('Running before each scenario');
  // Setup browser context
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
});

After(async function() {
  console.log('Running after each scenario');
  // Cleanup
  await this.page.close();
  await this.browser.close();
});

AfterAll(async function() {
  console.log('Running after all scenarios');
  // Cleanup server, close DB
});
```

### Hooks with Tags
```javascript
Before('@authentication', async function() {
  // Only runs for scenarios tagged with @authentication
  await this.page.goto('https://example.com/login');
  await this.login('user@test.com', 'password');
});

After('@cleanup', async function() {
  // Only runs for scenarios tagged with @cleanup
  await this.logout();
});
```

---

## Step Definition Best Practices

### 1. Keep Steps Simple
```javascript
// ✅ GOOD - Single responsibility
Given('I am on the home page', async function() {
  await this.page.goto('https://example.com');
});

// ❌ BAD - Too complex
Given('I go home and login and check notifications', async function() {
  // Multiple responsibilities
});
```

### 2. Reusable Steps
```javascript
// ✅ GOOD - Reusable across scenarios
Given('I am logged in as {string}', async function(username) {
  await this.login(username);
});

// ❌ BAD - Hardcoded
Given('I am logged in as alice', async function() {
  await this.login('alice@test.com');
});
```

### 3. Descriptive Error Messages
```javascript
// ✅ GOOD - Clear error messages
Then('I should see success message', async function() {
  const message = await this.page.locator('.success').textContent();
  expect(message).toContain('Success');
});

// ❌ BAD - Unclear errors
Then('something happens', async function() {
  expect(true).toBe(true);
});
```

---

## Python (Behave) Example

```python
# features/steps/login_steps.py

from behave import given, when, then

@given('I am on the login page')
def step_goto_login(context):
    context.browser.get('https://example.com/login')

@when('I enter {email} and {password}')
def step_enter_credentials(context, email, password):
    context.browser.find_element('id', 'email').send_keys(email)
    context.browser.find_element('id', 'password').send_keys(password)

@then('I should be logged in')
def step_verify_login(context):
    assert 'dashboard' in context.browser.current_url
```

---

## 🏋️ Exercises

**Exercise 1**: Write step definitions for a login scenario

<details>
<summary>✅ Answer</summary>

```javascript
// features/step_definitions/login.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function() {
  await this.page.goto('https://example.com/login');
});

When('I enter {string} and {string}', async function(email, password) {
  await this.page.fill('#email', email);
  await this.page.fill('#password', password);
});

When('I click the login button', async function() {
  await this.page.click('button[type="submit"]');
});

Then('I should be on the dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});

Then('I should see error message', async function() {
  await expect(this.page.locator('.error')).toBeVisible();
});
```

</details>

**Exercise 2**: Write a step with data table

<details>
<summary>✅ Answer</summary>

```javascript
Given('the following products are available:', async function(dataTable) {
  const products = dataTable.hashes();
  for (const product of products) {
    // Assume API or database method
    await this.createProduct({
      name: product.name,
      price: parseFloat(product.price),
      category: product.category
    });
  }
});

// Gherkin:
// Given the following products are available:
//   | name   | price | category |
//   | Laptop | 999   | Electronics |
//   | Mouse  | 25    | Electronics |
```

</details>

---

## 🎤 Interview Questions

1. **What are step definitions?**
   <details>
   <summary>Answer</summary>
   Code that implements Gherkin steps, translating human-readable scenarios into automation code
   </details>

2. **What programming languages support step definitions?**
   <details>
   <summary>Answer</summary>
   JavaScript (Cucumber-JS), Java, Python (Behave), Ruby, C# (SpecFlow), Go, and many others
   </details>

3. **What are hooks used for?**
   <details>
   <summary>Answer</summary>
   Setup (Before) and cleanup (After) logic that runs before/after scenarios, like launching browser
   </details>

4. **How do you pass parameters to steps?**
   <details>
   <summary>Answer</summary>
   Use curly braces with type: {string}, {int}, {float}. Data tables and multi-line strings also work
   </details>

5. **What's the best practice for step definitions?**
   <details>
   <summary>Answer</summary>
   Keep them simple, reusable, with clear error messages. One step = one action/assertion
   </details>
