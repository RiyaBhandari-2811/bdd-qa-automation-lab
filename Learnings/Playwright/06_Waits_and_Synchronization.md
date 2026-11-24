# 06: Waits and Synchronization

## Why Waits Matter

Web applications are asynchronous. Elements may not be immediately visible or ready. Waits prevent **flaky tests** (tests that fail randomly).

---

## Auto-Wait (Playwright's Superpower)

Playwright **automatically waits** for elements before interacting:

```javascript
// Playwright automatically waits for button to appear
await page.locator('button').click();
```

Default timeout: **30 seconds** (configurable)

---

## Wait Methods

### 1. Wait for Element Visibility

```javascript
// Wait for element to be visible
await page.locator('.modal').waitFor({ state: 'visible' });

// Wait for element to be hidden
await page.locator('.loading').waitFor({ state: 'hidden' });

// Wait for element to be in DOM (may not be visible)
await page.locator('.element').waitFor({ state: 'attached' });
```

### 2. Wait for Navigation

```javascript
// Wait for navigation to complete
await Promise.all([
  page.waitForNavigation(),
  page.locator('a').click()  // This triggers navigation
]);
```

### 3. Wait for URL

```javascript
// Wait for URL to change
await page.waitForURL(/dashboard/);
```

### 4. Wait for Function

```javascript
// Wait for custom condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 5;
});
```

### 5. Wait for API Response

```javascript
// Wait for specific API call
await page.waitForResponse(response => 
  response.url().includes('/api/users') && response.status() === 200
);
```

---

## Timeout Management

```javascript
// Set timeout for specific action (ms)
await page.locator('.button', { timeout: 5000 }).click();

// Set global timeout in config
export default defineConfig({
  timeout: 30000,
  use: {
    navigationTimeout: 30000,
  }
});
```

---

## Common Wait Scenarios

### Wait for Dynamic Content
```javascript
test('Wait for dynamic content', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to trigger AJAX
  await page.locator('#load-more').click();
  
  // Wait for new items to appear
  await page.locator('.new-item').first().waitFor({ state: 'visible' });
});
```

### Wait Before & After Action
```javascript
test('Wait for async operation', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Perform action
  await page.locator('#update-btn').click();
  
  // Wait for success message
  await expect(page.locator('.success')).toBeVisible();
});
```

---

## Anti-Patterns ❌

```javascript
// DON'T: Hard sleep
await page.waitForTimeout(5000);  // Bad, unreliable

// DON'T: Too short timeout
await page.locator('#element', { timeout: 100 }).click();

// DON'T: Waiting for exact same element twice
await page.locator('#btn').waitFor();
await page.locator('#btn').click();  // Already waited
```

---

## Best Practices ✅

```javascript
// DO: Wait for visibility before assertions
await expect(page.locator('.message')).toBeVisible();

// DO: Use meaningful timeouts
const SHORT_WAIT = 5000;
const LONG_WAIT = 30000;

// DO: Use auto-wait for interactions
await page.locator('#btn').click();  // Auto-waits
```

---

## 🏋️ Exercises

**Exercise 1**: Create a test that clicks a "Load More" button and waits for new items to appear.

<details>
<summary>✅ Answer</summary>

```javascript
test('Load more with dynamic content', async ({ page }) => {
  await page.goto('https://example.com/items');
  
  // Count initial items
  const initialCount = await page.locator('.item').count();
  
  // Click load more button
  await page.locator('button:has-text("Load More")').click();
  
  // Wait for new items to appear
  await page.locator('.item').nth(initialCount).waitFor({ state: 'visible' });
  
  // Verify items increased
  const finalCount = await page.locator('.item').count();
  expect(finalCount).toBeGreaterThan(initialCount);
});
```

</details>

**Exercise 2**: Write a test that navigates to a page and waits for an API call to complete.

<details>
<summary>✅ Answer</summary>

```javascript
test('Wait for API response', async ({ page }) => {
  // Start waiting for API response
  const apiResponsePromise = page.waitForResponse(response => 
    response.url().includes('/api/users') && response.status() === 200
  );
  
  // Navigate to page (triggers API call)
  await page.goto('https://example.com/users');
  
  // Wait for response
  const response = await apiResponsePromise;
  const data = await response.json();
  
  // Verify data
  expect(data.length).toBeGreaterThan(0);
  
  // Verify data displayed on page
  await expect(page.locator(`text=${data[0].name}`)).toBeVisible();
});
```

</details>

**Exercise 3**: Create a test with multiple async operations and proper wait handling.

<details>
<summary>✅ Answer</summary>

```javascript
test('Multiple async operations', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  
  // Wait 1: Wait for dashboard to load
  await page.locator('.dashboard').waitFor({ state: 'visible' });
  
  // Click to trigger data fetch
  await page.locator('#loadData').click();
  
  // Wait 2: Wait for data table to appear
  await page.locator('.data-table').waitFor({ state: 'visible' });
  
  // Click export button
  await page.locator('#exportBtn').click();
  
  // Wait 3: Wait for export success message
  await page.locator('.success-toast').waitFor({ state: 'visible' });
  
  // Verify final state
  expect(page.url()).toContain('/dashboard');
});
```

</details>

---

## 🎤 Interview Questions

1. **What is Playwright's auto-wait feature?**
   <details>
   <summary>Answer</summary>
   Automatically waits for elements to be ready before interactions (30s default timeout). Prevents flaky tests.
   </details>

2. **What's the difference between `visible` and `attached` states?**
   <details>
   <summary>Answer</summary>
   Visible means element is in DOM AND displayed on screen; attached means just in DOM (may be hidden)
   </details>

3. **How do you wait for an element to disappear?**
   <details>
   <summary>Answer</summary>
   Use `waitFor({ state: 'hidden' })` on the element locator
   </details>

4. **Should you use `page.waitForTimeout()` in tests?**
   <details>
   <summary>Answer</summary>
   No, it's unreliable and anti-pattern. Use specific waitFor methods like `waitFor()`, `waitForNavigation()`, `waitForResponse()`
   </details>

5. **How do you wait for an API call in Playwright?**
   <details>
   <summary>Answer</summary>
   Use `waitForResponse()` to wait for specific network response with matching URL and status
   </details>

