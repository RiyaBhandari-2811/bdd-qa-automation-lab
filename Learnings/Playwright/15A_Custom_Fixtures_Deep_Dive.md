# 15A: Custom Fixtures - Deep Dive Theory & Practical Guide

## 📚 Table of Contents
1. [What Are Fixtures?](#what-are-fixtures)
2. [Why Use Fixtures?](#why-use-fixtures)
3. [How Fixtures Work](#how-fixtures-work)
4. [Built-in Fixtures](#built-in-fixtures)
5. [Creating Custom Fixtures](#creating-custom-fixtures)
6. [Fixture Lifecycle](#fixture-lifecycle)
7. [Practical Patterns](#practical-patterns)
8. [Advanced Concepts](#advanced-concepts)
9. [Interview Questions](#interview-questions)

---

## What Are Fixtures?

**Simple Definition:**
Fixtures are **reusable setup and teardown logic** that runs before and after tests automatically.

**Analogy:**
Think of a fixture like a **restaurant kitchen setup**:
- **Setup:** Clean pans, prep ingredients, heat oven (runs BEFORE cooking)
- **Test:** Cook the meal (the actual test runs HERE)
- **Teardown:** Wash pans, clean counter (runs AFTER cooking)

---

## Why Use Fixtures?

### ❌ Without Fixtures (Lots of Repetition)
```javascript
test('Test 1: Add Todo', async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');  // 🔄 Repeated
  await page.waitForSelector('[data-testid="text-input"]');     // 🔄 Repeated
  
  // Test logic
  await page.fill('[data-testid="text-input"]', 'Task 1');
  await page.press('[data-testid="text-input"]', 'Enter');
  expect(await page.getByRole('listitem').count()).toBe(1);
});

test('Test 2: Complete Todo', async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');  // 🔄 Repeated
  await page.waitForSelector('[data-testid="text-input"]');     // 🔄 Repeated
  
  // Add todo first
  await page.fill('[data-testid="text-input"]', 'Task 1');
  await page.press('[data-testid="text-input"]', 'Enter');
  
  // Test logic
  await page.click('[data-testid="todo-item-toggle"]');
  expect(await page.locator('.completed')).toBeVisible();
});

test('Test 3: Filter Todos', async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');  // 🔄 Repeated
  await page.waitForSelector('[data-testid="text-input"]');     // 🔄 Repeated
  
  // Test logic
  await page.click('a:has-text("Active")');
  // ...
});
```

**Problems:**
- 🔴 Lots of repetition (DRY violation)
- 🔴 If setup changes, must update 3+ tests
- 🔴 Test code is cluttered with setup
- 🔴 Easy to make setup mistakes

### ✅ With Fixtures (Clean & DRY)
```javascript
// Define fixture once
const test = base.extend({
  todoPageReady: async ({ page }, use) => {
    await page.goto('https://todomvc.com/examples/react/dist/');
    await page.waitForSelector('[data-testid="text-input"]');
    await use(page);
  }
});

// Use in multiple tests (all get same setup!)
test('Test 1: Add Todo', async ({ todoPageReady: page }) => {
  await page.fill('[data-testid="text-input"]', 'Task 1');
  expect(await page.getByRole('listitem').count()).toBe(1);
});

test('Test 2: Complete Todo', async ({ todoPageReady: page }) => {
  await page.fill('[data-testid="text-input"]', 'Task 1');
  await page.press('[data-testid="text-input"]', 'Enter');
  await page.click('[data-testid="todo-item-toggle"]');
  expect(await page.locator('.completed')).toBeVisible();
});

test('Test 3: Filter Todos', async ({ todoPageReady: page }) => {
  await page.click('a:has-text("Active")');
  // ...
});
```

**Benefits:**
- ✅ DRY - Setup defined once, used everywhere
- ✅ Maintainable - Change setup in one place
- ✅ Cleaner tests - Focus on WHAT, not HOW
- ✅ Consistent - All tests get identical setup

---

## How Fixtures Work

### The 3-Phase Lifecycle

```javascript
const test = base.extend({
  myFixture: async ({ page }, use) => {
    // ============ PHASE 1: SETUP ============
    // Runs BEFORE the test
    console.log('⬆️ SETUP: Preparing test environment');
    await page.goto('https://example.com');
    const data = { username: 'john', password: 'pass123' };
    
    // ============ PHASE 2: TEST RUNS HERE ============
    // Everything between await use() runs the actual test
    await use(data);  // 👈 Test runs HERE!
    
    // ============ PHASE 3: CLEANUP ============
    // Runs AFTER the test completes (or fails)
    console.log('⬇️ CLEANUP: Cleaning up');
    await page.close();
  }
});

// Visual Flow:
// SETUP (before) ──→ TEST ──→ CLEANUP (after)
```

### Execution Order Diagram

```
Test File Execution:
├── Fixture Setup Phase 1
│   └── await page.goto(...)
│   └── await page.waitForSelector(...)
│
├── TEST RUNS
│   └── await page.fill('...')
│   └── await expect(...)
│
└── Fixture Cleanup Phase
    └── console.log('Done')
```

---

## Built-in Fixtures

Playwright provides these fixtures automatically (no setup needed):

### Available Built-in Fixtures

```javascript
test('Built-in fixtures', async ({
  page,          // The browser page object
  browser,       // The browser instance
  context,       // Browser context (cookies, storage, etc)
  browserName,   // 'chromium', 'firefox', or 'webkit'
  request,       // HTTP request object for API testing
  expect,        // Assertion library
}) => {
  
  // All available without any setup!
  console.log(browserName);  // Which browser are we testing?
  
  // page has all navigation methods
  await page.goto('https://example.com');
  
  // context controls cookies, storage
  await context.addCookies([{ name: 'auth', value: 'token' }]);
  
  // request is for API calls
  const response = await request.get('https://api.example.com/data');
});
```

**Key Point:** These built-in fixtures are automatically provided. You can extend them with custom ones.

---

## Creating Custom Fixtures

### Step 1: Import Base Test
```javascript
// fixtures.js
import { test as base } from '@playwright/test';

// Don't use 'test' directly, use 'base'
// We'll extend it with our custom fixtures
```

### Step 2: Extend with Custom Fixture
```javascript
export const test = base.extend({
  // Fixture name: fixture implementation
  myFixture: async ({ page }, use) => {
    // Setup code here
    console.log('Setting up...');
    
    // Provide to test
    await use(page);
    
    // Cleanup code here
    console.log('Cleaning up...');
  }
});
```

### Step 3: Use in Test
```javascript
// test.spec.js
import { test, expect } from './fixtures';

test('Use my custom fixture', async ({ myFixture }) => {
  // myFixture has gone through setup already!
  // Can immediately use it
  await myFixture.click('button');
});
```

---

## Fixture Lifecycle Detailed

### Complete Example with Logging

```javascript
const test = base.extend({
  loadedPage: async ({ page }, use) => {
    console.log('1. SETUP START - Preparing test');
    
    // Setup Phase
    console.log('2. Navigating to URL...');
    await page.goto('https://example.com');
    
    console.log('3. Waiting for page to be ready...');
    await page.waitForLoadState('networkidle');
    
    console.log('4. SETUP COMPLETE - Page is ready!');
    
    // ==========================================
    // 👇 TEST RUNS HERE 👇
    console.log('5. TEST STARTING...');
    await use(page);
    console.log('6. TEST COMPLETED!');
    // 👆 TEST RUNS HERE 👆
    // ==========================================
    
    // Cleanup Phase
    console.log('7. CLEANUP START - Cleaning up');
    console.log('8. Logging out...');
    await page.click('.logout-btn').catch(() => {});  // Might not exist
    
    console.log('9. CLEANUP COMPLETE - All clean!');
  }
});

// When you run: test('My Test', async ({ loadedPage }) => { ... })
// Console output:
// 1. SETUP START - Preparing test
// 2. Navigating to URL...
// 3. Waiting for page to be ready...
// 4. SETUP COMPLETE - Page is ready!
// 5. TEST STARTING...
// (YOUR TEST CODE RUNS HERE)
// 6. TEST COMPLETED!
// 7. CLEANUP START - Cleaning up
// 8. Logging out...
// 9. CLEANUP COMPLETE - All clean!
```

---

## Practical Patterns

### Pattern 1: Page Setup Fixture
**Problem:** Every test needs to navigate to the page

```javascript
const test = base.extend({
  pageReady: async ({ page }, use) => {
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
    await use(page);
  }
});

test('Feature A', async ({ pageReady: page }) => {
  // page already navigated!
  await page.click('button');
});
```

### Pattern 2: Pre-populated Data Fixture
**Problem:** Every test needs the same test data added

```javascript
const test = base.extend({
  pageWithData: async ({ page }, use) => {
    await page.goto('https://todoapp.com');
    
    // Add test data
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    for (const todo of todos) {
      await page.fill('[data-testid="input"]', todo);
      await page.press('[data-testid="input"]', 'Enter');
    }
    
    await use(page);
  }
});

test('Filter active todos', async ({ pageWithData: page }) => {
  // 3 todos already exist! Skip adding them
  await page.click('a:has-text("Active")');
  expect(await page.getByRole('listitem').count()).toBe(3);
});
```

### Pattern 3: Authentication Fixture
**Problem:** Need to log in for every test

```javascript
const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    await page.goto('https://app.example.com/login');
    
    // Login
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    await use(page);
    
    // Cleanup: logout
    await page.click('.menu-btn');
    await page.click('button:has-text("Logout")').catch(() => {});
  }
});

test('View user profile', async ({ loggedInPage: page }) => {
  // Already logged in!
  await page.click('a[href="/profile"]');
  expect(await page.locator('.profile-name')).toBeVisible();
});
```

### Pattern 4: Metrics Tracking Fixture
**Problem:** Want to track timing for every test

```javascript
const test = base.extend({
  pageWithMetrics: async ({ page }, use) => {
    const metrics = {
      startTime: Date.now(),
      actions: []
    };
    
    // Add tracking to page
    page._metrics = metrics;
    
    await page.goto('https://example.com');
    
    await use(page);
    
    // Log metrics after test
    const duration = Date.now() - metrics.startTime;
    console.log(`Test took ${duration}ms`);
    console.log(`Actions performed: ${metrics.actions.length}`);
  }
});

test('Track performance', async ({ pageWithMetrics: page }) => {
  page._metrics.actions.push('click');
  await page.click('button');
  
  page._metrics.actions.push('fill');
  await page.fill('input', 'text');
});
```

---

## Advanced Concepts

### Multiple Dependent Fixtures

```javascript
const test = base.extend({
  // Fixture 1: Independent
  authToken: async ({}, use) => {
    const token = 'auth_token_12345';
    await use(token);
  },
  
  // Fixture 2: Depends on authToken
  authenticatedPage: async ({ page, authToken }, use) => {
    // Can access authToken!
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    await page.goto('https://api.example.com/authenticated');
    await use(page);
  },
  
  // Fixture 3: Depends on authenticatedPage
  userContext: async ({ authenticatedPage, authToken }, use) => {
    // Can access both!
    const userContext = {
      page: authenticatedPage,
      token: authToken,
      userId: 'user_123'
    };
    await use(userContext);
  }
});

test('Use dependent fixtures', async ({ userContext }) => {
  // userContext has page, token, and userId all ready!
  expect(userContext.userId).toBe('user_123');
});
```

### Fixture Scopes

```javascript
const test = base.extend({
  // Test scope: New instance for EACH test (default)
  freshPage: [
    async ({ page }, use) => {
      console.log('New page for this test only');
      await use(page);
    },
    { scope: 'test' }  // 👈 Explicit test scope
  ],
  
  // Worker scope: Reused across tests in same worker
  sharedDatabase: [
    async ({}, use) => {
      console.log('Database created once, reused for all tests');
      const db = await setupDatabase();
      await use(db);
      await db.close();
    },
    { scope: 'worker' }  // 👈 Worker scope
  ],
});
```

---

## 🏋️ Exercises

### Exercise 1: Create a Basic Fixture
Create a fixture that navigates to TodoMVC and waits for the input to be ready.

<details>
<summary>✅ Solution</summary>

```javascript
// fixtures.js
import { test as base } from '@playwright/test';

const BASE_URL = 'https://todomvc.com/examples/react/dist/';

export const test = base.extend({
  todoApp: async ({ page }, use) => {
    // Setup
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="text-input"]');
    
    // Provide to test
    await use(page);
    
    // Cleanup
    console.log('TodoApp test completed');
  }
});

export { expect } from '@playwright/test';

// test.spec.js
import { test, expect } from './fixtures';

test('Use todoApp fixture', async ({ todoApp: page }) => {
  await page.fill('[data-testid="text-input"]', 'Learn Fixtures');
  await page.press('[data-testid="text-input"]', 'Enter');
  expect(await page.getByRole('listitem').count()).toBe(1);
});
```

</details>

### Exercise 2: Create a Fixture with Pre-populated Data
Create a fixture that loads TodoMVC and adds 3 sample todos automatically.

<details>
<summary>✅ Solution</summary>

```javascript
// fixtures.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  todoAppWithTasks: async ({ page }, use) => {
    // Setup - navigate and add todos
    await page.goto('https://todomvc.com/examples/react/dist/');
    await page.waitForSelector('[data-testid="text-input"]');
    
    const todos = ['Buy milk', 'Learn Playwright', 'Study Fixtures'];
    for (const todo of todos) {
      await page.fill('[data-testid="text-input"]', todo);
      await page.press('[data-testid="text-input"]', 'Enter');
    }
    
    // Provide to test
    await use(page);
    
    // Cleanup - optional
    console.log('TodoApp with tasks test completed');
  }
});

export { expect } from '@playwright/test';

// test.spec.js
test('All todos already exist', async ({ todoAppWithTasks: page }) => {
  // 3 todos already added!
  const count = await page.getByRole('listitem').count();
  expect(count).toBe(3);
  
  // Test filtering without adding todos
  await page.click('a:has-text("Active")');
  expect(await page.getByRole('listitem').count()).toBe(3);
});
```

</details>

### Exercise 3: Create a Dependent Fixture
Create a fixture that depends on authToken and sets authentication headers.

<details>
<summary>✅ Solution</summary>

```javascript
// fixtures.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  authToken: async ({}, use) => {
    // Generate or retrieve token
    const token = 'test_token_' + Date.now();
    await use(token);
  },
  
  authenticatedRequest: async ({ request, authToken }, use) => {
    // Create request object with auth headers
    const authenticatedRequest = async (method, url, options = {}) => {
      return request[method.toLowerCase()](url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${authToken}`
        }
      });
    };
    
    await use(authenticatedRequest);
  }
});

export { expect } from '@playwright/test';

// test.spec.js
test('Use authenticated request', async ({ authenticatedRequest }) => {
  // Authorization header automatically added!
  const response = await authenticatedRequest('get', 'https://api.example.com/user');
  expect(response.ok()).toBeTruthy();
});
```

</details>

---

## 📋 Interview Questions & Answers

### Q1: What is a Playwright fixture?
**Answer:** A fixture is reusable setup and teardown logic that runs before and after tests. It follows a 3-phase lifecycle: Setup → Test Runs → Cleanup.

```javascript
const test = base.extend({
  myFixture: async ({ page }, use) => {
    // Setup
    await page.goto('https://example.com');
    
    // Test runs here
    await use(page);
    
    // Cleanup
    console.log('Done');
  }
});
```

### Q2: Why should you use fixtures instead of repeating setup in each test?
**Answer:** 
- **DRY principle** - Setup code in one place
- **Maintainability** - Change setup once, affects all tests
- **Consistency** - All tests get identical setup
- **Cleaner code** - Tests focus on WHAT, not HOW
- **Less bugs** - No repeated setup mistakes

### Q3: What's the difference between test and worker scope?
**Answer:**
- **Test scope** (default): New instance for each test
  ```javascript
  { scope: 'test' }  // Fresh page per test
  ```
- **Worker scope**: Instance reused across all tests
  ```javascript
  { scope: 'worker' }  // One database for all tests
  ```

### Q4: How do you create dependent fixtures?
**Answer:** Access other fixtures as parameters:
```javascript
const test = base.extend({
  token: async ({}, use) => {
    await use('token_123');
  },
  
  // This fixture depends on 'token'
  authenticatedPage: async ({ page, token }, use) => {
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`
    });
    await use(page);
  }
});
```

### Q5: When would you use a worker scope fixture?
**Answer:** When you have expensive setup that multiple tests can share:
- Database connection (expensive to create)
- API server startup
- File system setup
- Large data preparation

```javascript
const test = base.extend({
  db: [
    async ({}, use) => {
      // Expensive! Only do once
      const db = await setupDatabase();
      await use(db);
      await db.close();
    },
    { scope: 'worker' }  // Share across tests
  ]
});
```

### Q6: Can a fixture be reused across multiple test files?
**Answer:** Yes! Export the fixture and import it:

```javascript
// fixtures.js (shared fixtures)
export const test = base.extend({ ... });

// test1.spec.js
import { test } from './fixtures';

// test2.spec.js
import { test } from './fixtures';

// Both files use the same fixture!
```

### Q7: How do you handle errors in fixture cleanup?
**Answer:** Use try-catch or handle errors gracefully:
```javascript
const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);
    
    // Cleanup - might fail, that's OK
    try {
      await page.click('.logout-btn');
    } catch (e) {
      console.log('Logout button not found, skipping');
    }
  }
});
```

### Q8: Can you combine multiple fixtures in one test?
**Answer:** Yes! Just list them in parameters:
```javascript
test('Use multiple fixtures', async ({ 
  todoApp,           // Fixture 1
  authToken,         // Fixture 2
  pageWithMetrics    // Fixture 3
}) => {
  // All 3 fixtures are ready!
});
```

### Q9: What happens if a fixture fails during setup?
**Answer:** The test fails immediately and cleanup is still called:
```javascript
// If setup fails (await page.goto() throws):
// 1. Test fails
// 2. Cleanup still runs
// 3. Test marked as failed

const test = base.extend({
  page: async ({ page }, use) => {
    // If this fails, test fails and cleanup runs
    await page.goto('https://nonexistent.com');  // 404
    await use(page);
    // Cleanup still happens
  }
});
```

### Q10: When would you use a fixture instead of beforeEach?
**Answer:** Fixtures are better than beforeEach because:
- Automatic cleanup even if test fails
- Cleaner dependency injection
- Reusable across files
- Better with TypeScript
- Scopes (test vs worker)

```javascript
// ❌ Old way (beforeEach - not recommended)
test.beforeEach(async ({ page }) => {
  await page.goto('...');
});

// ✅ New way (fixtures - recommended)
const test = base.extend({
  pageReady: async ({ page }, use) => {
    await page.goto('...');
    await use(page);
  }
});
```

---

## 🎓 Key Takeaways

✅ **Fixtures = Reusable Setup + Teardown**
✅ **3 Phases: Setup → Test → Cleanup**
✅ **Write once, use everywhere (DRY)**
✅ **Built-in fixtures available automatically**
✅ **Custom fixtures via test.extend()**
✅ **Can depend on other fixtures**
✅ **Different scopes (test vs worker)**
✅ **Cleanup runs even if test fails**

---

## 🚀 Next Steps

1. Create a custom fixture for your app
2. Add setup/teardown logic
3. Reuse across multiple tests
4. Use dependent fixtures for complex scenarios
5. Consider worker scope for expensive operations

---

**Start using fixtures to make your tests cleaner, faster, and more maintainable!** 🎉
