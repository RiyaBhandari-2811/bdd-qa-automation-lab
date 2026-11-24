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

**Exercise 2**: Configure parallel test execution and run tests.

**Exercise 3**: Compare selector performance for finding elements.

---

## 🎤 Interview Questions

1. **What is `fullyParallel` in Playwright config?**
   - Enables all tests to run in parallel across multiple workers

2. **How do you measure page performance?**
   - Use `performance.getEntriesByType('navigation')` or 'resource'

3. **Which selector type is fastest?**
   - Attribute selectors and role selectors with specific names

4. **How many workers should you use?**
   - Based on CPU cores; default auto-detects optimal number

