# 14: Performance and Optimization

## Measuring Performance

### Page Load Metrics

```javascript
test('Measure page performance', async ({ page }) => {
  const navigationTiming = await page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      loadComplete: timing.loadEventEnd - timing.loadEventStart,
      totalTime: timing.loadEventEnd - timing.fetchStart
    };
  });
  
  console.log('Performance:', navigationTiming);
});
```

### Resource Timing

```javascript
test('Get resource metrics', async ({ page }) => {
  await page.goto('https://example.com');
  
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize
    }));
  });
  
  console.log(resources);
});
```

---

## Optimization Techniques

### Parallel Test Execution

```javascript
// In playwright.config.js
export default defineConfig({
  fullyParallel: true,
  workers: 4,  // Run 4 tests in parallel
});
```

### Reuse Browser Context

```javascript
test.describe('Test suite with shared context', () => {
  let context;
  
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });
  
  test('Test 1', async () => {
    const page = await context.newPage();
    // Use page
  });
  
  test('Test 2', async () => {
    const page = await context.newPage();
    // Use page
  });
  
  test.afterAll(async () => {
    await context.close();
  });
});
```

---

## Faster Selectors

### Selector Performance Comparison

```javascript
// SLOW - Complex XPath
page.locator('/html/body/div[1]/main/section[2]/div/button[contains(text(), "Submit")]')

// MEDIUM - Basic CSS
page.locator('button.submit')

// FAST - Specific with attribute
page.locator('button[data-testid="submit"]')

// FASTEST - Role selector with name
page.locator('role=button[name="Submit"]')
```

---

## Lazy Loading Images

### Skip Image Downloads

```javascript
test('Skip images for speed', async ({ browser }) => {
  const context = await browser.newContext();
  
  await context.route('**/*.png', route => route.abort());
  await context.route('**/*.jpg', route => route.abort());
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // Test faster without images
});
```

---

## Headless vs Headed

```bash
# Headless (faster) - default
npx playwright test

# Headed (slower, visual debugging)
npx playwright test --headed
```

---

## Test Filtering

### Run Only Specific Tests

```bash
# Run specific file
npx playwright test tests/login.spec.js

# Run tests matching pattern
npx playwright test --grep "login"

# Run specific browser
npx playwright test --project=chromium
```

---

## Concurrent vs Sequential

### Sequential Execution (Slower)

```javascript
test.describe.serial('Sequential tests', () => {
  test('Test 1', async ({ page }) => { /* */ });
  test('Test 2', async ({ page }) => { /* */ });
  test('Test 3', async ({ page }) => { /* */ });
});
```

### Parallel Execution (Faster)

```javascript
test.describe('Parallel tests', () => {
  test('Test 1', async ({ page }) => { /* */ });
  test('Test 2', async ({ page }) => { /* */ });
  test('Test 3', async ({ page }) => { /* */ });
});
```

---

## Timeout Optimization

```javascript
// In playwright.config.js
export default defineConfig({
  timeout: 30000,
  expect: {
    timeout: 5000  // Assertion timeout
  },
  use: {
    navigationTimeout: 30000,
    actionTimeout: 10000,
  }
});
```

---

## 🏋️ Exercises

**Exercise 1**: Measure page load time for a website.

<details>
<summary>✅ Answer</summary>

```javascript
test('Measure page load time', async ({ page }) => {
  const startTime = Date.now();
  
  // Navigate and wait for load
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  
  const loadTime = Date.now() - startTime;
  console.log(`Page load time: ${loadTime}ms`);
  
  // Get detailed performance metrics
  const perfMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  });
  
  console.log('Performance Metrics:', perfMetrics);
  
  // Assert load time is acceptable
  expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
});
```

</details>

**Exercise 2**: Configure parallel test execution and run tests.

<details>
<summary>✅ Answer</summary>

```javascript
// playwright.config.js
export default defineConfig({
  // Run tests in parallel (default is 4 workers)
  fullyParallel: true,
  workers: process.env.CI ? 1 : 4,
  
  // Other optimizations
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  
  use: {
    // Reuse browser between tests for speed
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

// Run tests
// npx playwright test  (uses default 4 workers)
// npx playwright test --workers=8  (use 8 workers)
```

</details>

**Exercise 3**: Compare selector performance for finding elements.

<details>
<summary>✅ Answer</summary>

```javascript
test('Compare selector performance', async ({ page }) => {
  await page.goto('https://example.com');
  
  const selectors = {
    'CSS ID': '#user-button',
    'CSS Class': '.primary-button',
    'XPath': "//button[@type='submit']",
    'Role': "role=button[name='Submit']",
    'Text': "button:has-text('Submit')",
  };
  
  for (const [name, selector] of Object.entries(selectors)) {
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      try {
        await page.locator(selector).count();
      } catch (e) {
        // Selector not found
      }
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;
    
    console.log(`${name}: ${avgTime.toFixed(2)}ms per query`);
  }
});
```

</details>

---

## 🎤 Interview Questions

1. **What is `fullyParallel` in Playwright config?**
   <details>
   <summary>Answer</summary>
   Enables all tests to run in parallel across multiple workers instead of sequentially per file
   </details>

2. **How do you measure page performance?**
   <details>
   <summary>Answer</summary>
   Use `performance.getEntriesByType('navigation')` for page metrics or `performance.getEntriesByType('resource')` for resource timing
   </details>

3. **Which selector type is fastest?**
   <details>
   <summary>Answer</summary>
   Attribute selectors with IDs and role selectors, as they're most specific and don't require DOM traversal
   </details>

4. **How many workers should you use?**
   <details>
   <summary>Answer</summary>
   Based on CPU cores; default auto-detects optimal number. Use fewer (1-2) in CI for stability
   </details>

