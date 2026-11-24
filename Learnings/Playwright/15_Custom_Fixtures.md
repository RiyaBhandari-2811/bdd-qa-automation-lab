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

<details>
<summary>✅ Answer</summary>

```javascript
// fixtures.ts
import { test as base } from '@playwright/test';
import Database from 'sqlite3';

type Fixtures = {
  db: Database.Database;
};

export const test = base.extend<Fixtures>({
  db: async ({}, use) => {
    // Setup - create and open database
    const db = new Database.Database(':memory:');
    
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT
      )
    `);
    
    db.run(`
      INSERT INTO users (email, name) VALUES
      ('user1@test.com', 'User One'),
      ('user2@test.com', 'User Two')
    `);
    
    // Provide database to test
    await use(db);
    
    // Teardown - close database
    db.close();
  },
});

export { expect } from '@playwright/test';

// In test:
test('Use database fixture', async ({ db }) => {
  db.all('SELECT * FROM users', (err, rows) => {
    expect(rows.length).toBe(2);
  });
});
```

</details>

**Exercise 2**: Create an authenticated page fixture that logs in before each test.

<details>
<summary>✅ Answer</summary>

```javascript
// fixtures.ts
import { test as base, expect } from '@playwright/test';

type Fixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup - login before test
    await page.goto('https://example.com/login');
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    // Wait for authentication
    await page.waitForURL('**/dashboard');
    
    // Provide authenticated page to test
    await use(page);
    
    // Teardown - logout
    await page.click('.user-menu');
    await page.click('button:has-text("Logout")');
  },
});

// In test:
test('Use authenticated page', async ({ authenticatedPage }) => {
  // Already logged in and on dashboard
  await expect(authenticatedPage.locator('.welcome-message')).toBeVisible();
  await expect(authenticatedPage).toHaveURL('**/dashboard');
});
```

</details>

**Exercise 3**: Create a parameterized fixture with test user credentials.

<details>
<summary>✅ Answer</summary>

```javascript
// fixtures.ts
import { test as base } from '@playwright/test';

type Fixtures = {
  testUser: { email: string; password: string };
};

export const test = base.extend<Fixtures>({
  testUser: async ({}, use) => {
    // Define different users for parameterization
    const users = {
      admin: {
        email: 'admin@example.com',
        password: 'AdminPass123!',
      },
      regular: {
        email: 'user@example.com',
        password: 'UserPass123!',
      },
      guest: {
        email: 'guest@example.com',
        password: 'GuestPass123!',
      },
    };
    
    // Use specific user (can be parameterized)
    const userRole = process.env.TEST_USER || 'regular';
    const testUser = users[userRole];
    
    await use(testUser);
  },
});

// In test:
test('Login with parameterized user', async ({ page, testUser }) => {
  await page.goto('https://example.com/login');
  await page.fill('#email', testUser.email);
  await page.fill('#password', testUser.password);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/dashboard');
});

// Run with different users:
// npx playwright test  (uses 'regular' user)
// TEST_USER=admin npx playwright test  (uses 'admin')
```

</details>

---

## 🎤 Interview Questions

1. **What is a fixture in Playwright?**
   <details>
   <summary>Answer</summary>
   Reusable setup and teardown logic that runs before and after tests for data preparation and cleanup
   </details>

2. **What are fixture scopes?**
   <details>
   <summary>Answer</summary>
   test (new each test), worker (shared within worker), suite (shared per test file), session (global)
   </details>

3. **How do you create a custom fixture?**
   <details>
   <summary>Answer</summary>
   Use `test.extend({ fixtureName: async ({}, use) => { setup; await use(value); teardown; } })`
   </details>

4. **Can fixtures depend on other fixtures?**
   <details>
   <summary>Answer</summary>
   Yes, include them as parameters: `async ({ page, anotherFixture }, use) => { ... }`
   </details>

