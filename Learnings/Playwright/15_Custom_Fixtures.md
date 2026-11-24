# 15: Custom Fixtures

## Understanding Fixtures

Fixtures are reusable setup/teardown logic shared across tests. Playwright provides built-in fixtures and allows custom ones.

---

## Built-in Fixtures

```javascript
test('Built-in fixtures', async ({ page, browser, context, browserName }) => {
  console.log(browserName);  // 'chromium', 'firefox', 'webkit'
  // page, browser, context already provided
});
```

---

## Creating Custom Fixtures

### Basic Custom Fixture

```javascript
// fixtures.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  customPage: async ({ page }, use) => {
    // Setup
    await page.goto('https://example.com');
    
    // Provide to test
    await use(page);
    
    // Teardown
    console.log('Test completed');
  },
});

// Use in test
export { expect } from '@playwright/test';
```

### Using Custom Fixture

```javascript
// test.spec.js
import { test, expect } from './fixtures';

test('Use custom fixture', async ({ customPage }) => {
  // customPage already navigated to example.com
  await customPage.click('button');
});
```

---

## Fixture with Setup & Teardown

```javascript
// fixtures.js
import { test as base } from '@playwright/test';
import Database from './database';

export const test = base.extend({
  db: async ({}, use) => {
    // Setup - create database connection
    const db = new Database();
    await db.connect();
    
    // Provide to test
    await use(db);
    
    // Teardown - close connection
    await db.disconnect();
  },
});
```

```javascript
// test.spec.js
import { test } from './fixtures';

test('Use database fixture', async ({ db, page }) => {
  const user = await db.query('SELECT * FROM users LIMIT 1');
  
  // Use in test
  await page.goto('https://example.com');
});
```

---

## Parameterized Fixtures

```javascript
// fixtures.js
export const test = base.extend({
  apiUrl: async ({}, use) => {
    const url = process.env.API_URL || 'http://localhost:3000';
    await use(url);
  },
  
  testUser: async ({}, use) => {
    const user = {
      email: 'test@example.com',
      password: 'password123'
    };
    await use(user);
  },
});
```

```javascript
// test.spec.js
test('Use parameterized fixtures', async ({ apiUrl, testUser, page }) => {
  await page.goto(`${apiUrl}/login`);
  await page.locator('#email').fill(testUser.email);
  await page.locator('#password').fill(testUser.password);
});
```

---

## Dependent Fixtures

```javascript
export const test = base.extend({
  // First fixture
  authToken: async ({}, use) => {
    const token = 'auth_token_123';
    await use(token);
  },
  
  // Depends on first
  authenticatedPage: async ({ page, authToken }, use) => {
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    await use(page);
  },
});
```

---

## Fixture Scope

### Fixtures with Different Scopes

```javascript
export const test = base.extend({
  // Test scope - new for each test
  freshPage: async ({ page }, use) => {
    await use(page);
  },
  
  // Worker scope - shared by multiple tests in same worker
  sharedDatabase: [async ({}, use) => {
    const db = await setupDatabase();
    await use(db);
    await db.close();
  }, { scope: 'worker' }],
});
```

---

## Page with Authentication

### Common Pattern: Authenticated Page

```javascript
// fixtures.js
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Load saved authentication
    const storageState = require('./auth.json');
    
    // Create new context with auth
    await page.context().addCookies(storageState.cookies);
    
    // Navigate to app
    await page.goto('https://example.com');
    
    // Provide to test
    await use(page);
  },
});
```

---

## Logging Fixture

```javascript
export const test = base.extend({
  logger: async ({}, use) => {
    const logs = [];
    
    const logger = {
      log: (message) => {
        logs.push(`[${new Date().toISOString()}] ${message}`);
      },
      getLogs: () => logs,
    };
    
    await use(logger);
  },
});
```

---

## 🏋️ Exercises

**Exercise 1**: Create a custom fixture that sets up a database connection.

**Exercise 2**: Create an authenticated page fixture that logs in before each test.

**Exercise 3**: Create a parameterized fixture with test user credentials.

---

## 🎤 Interview Questions

1. **What is a fixture in Playwright?**
   - Reusable setup/teardown logic shared across tests

2. **What are fixture scopes?**
   - test (new each test), worker (shared in worker), suite (all tests)

3. **How do you create a custom fixture?**
   - Use `test.extend({ name: async ({}, use) => { ... } })`

4. **Can fixtures depend on other fixtures?**
   - Yes, include them as parameters: `async ({ otherFixture }, use)`

