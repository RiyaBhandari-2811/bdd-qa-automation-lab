# 10: Screenshots and Videos

## Taking Screenshots

### Full Page Screenshot

```javascript
test('Take full page screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Full page screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
```

### Element Screenshot

```javascript
test('Screenshot specific element', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Screenshot only element
  const element = page.locator('.card');
  await element.screenshot({ path: 'card.png' });
});
```

### Screenshots with Options

```javascript
test('Screenshot with options', async ({ page }) => {
  await page.screenshot({
    path: 'screenshot.png',
    fullPage: true,
    type: 'png',  // or 'jpeg'
    quality: 90   // only for jpeg
  });
});
```

---

## Recording Videos

### Configure in playwright.config.js

```javascript
export default defineConfig({
  use: {
    video: 'retain-on-failure',  // Record only on failure
    // or
    // video: 'on',  // Always record
    // video: 'off'  // No recording
  },
});
```

Video saved to: `test-results/` directory

---

## Tracing

### Enable Tracing

```javascript
export default defineConfig({
  use: {
    trace: 'on-first-retry',  // Trace on first retry
    // or
    // trace: 'on',    // Always trace
    // trace: 'off'    // No tracing
  },
});
```

### Manual Tracing

```javascript
test('Trace test execution', async ({ page, context }) => {
  // Start trace
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  // Perform actions
  await page.goto('https://example.com');
  await page.click('button');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'trace.zip' });
});
```

---

## Visual Comparison

### Take Reference Screenshots

```javascript
test('Visual regression - create baseline', async ({ page }) => {
  await page.goto('https://example.com/homepage');
  
  // Take baseline screenshot
  await expect(page).toHaveScreenshot('homepage-baseline.png');
});
```

### Compare Screenshots

```javascript
test('Visual regression - compare', async ({ page }) => {
  await page.goto('https://example.com/homepage');
  
  // Compare against baseline
  await expect(page).toHaveScreenshot('homepage-baseline.png');
});
```

---

## Attachment Feature

```javascript
import { test, expect } from '@playwright/test';

test('Attach screenshot on failure', async ({ page }) => {
  await page.goto('https://example.com');
  
  try {
    await expect(page.locator('.missing')).toBeVisible();
  } catch (error) {
    // Attach screenshot to report
    await page.screenshot({ path: 'failed-screenshot.png' });
    throw error;
  }
});
```

---

## View Artifacts

```bash
# View HTML report with screenshots/videos
npx playwright show-report

# Generate Mochawesome report with artifacts
npx playwright test --reporter=mochawesome
```

---

## 🏋️ Exercises

**Exercise 1**: Take a screenshot of a specific element and save it.

<details>
<summary>✅ Answer</summary>

```javascript
test('Screenshot specific element', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Get specific element
  const headerElement = page.locator('header');
  
  // Take screenshot of element
  await headerElement.screenshot({ path: 'header-screenshot.png' });
  
  // Verify file was created
  const fs = require('fs');
  expect(fs.existsSync('header-screenshot.png')).toBeTruthy();
});
```

</details>

**Exercise 2**: Enable video recording for your tests and run them.

<details>
<summary>✅ Answer</summary>

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    video: 'retain-on-failure',  // Record only on failure
    // or use 'on' to always record
  },
});

// In tests:
test('Video recording enabled', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Perform actions
  await page.click('button');
  await page.fill('input', 'test');
  
  // Video will be saved automatically
  // View with: npx playwright show-report
});
```

**Run with video:**
```bash
npx playwright test --headed
# Videos saved in test-results/
```

</details>

**Exercise 3**: Create baseline and comparison screenshots for visual regression testing.

<details>
<summary>✅ Answer</summary>

```javascript
test('Visual regression - create baseline', async ({ page }) => {
  await page.goto('https://example.com/homepage');
  
  // Create baseline screenshot
  await expect(page).toHaveScreenshot('homepage.png');
});

test('Visual regression - compare', async ({ page }) => {
  await page.goto('https://example.com/homepage');
  
  // Compare against baseline
  // Fails if significant visual changes detected
  await expect(page).toHaveScreenshot('homepage.png');
});

// Run with:
// npx playwright test --update-snapshots  (create baselines)
// npx playwright test                      (compare)
```

</details>

---

## 🎤 Interview Questions

1. **What are the different video recording options?**
   <details>
   <summary>Answer</summary>
   `on` (always record), `off` (no recording), `retain-on-failure` (record only on test failure)
   </details>

2. **What information is captured in a trace?**
   <details>
   <summary>Answer</summary>
   Screenshots, DOM snapshots, network activity, browser logs, and execution timeline
   </details>

3. **How do you view test artifacts?**
   <details>
   <summary>Answer</summary>
   Use `npx playwright show-report` to view HTML report with screenshots, videos, and traces
   </details>

4. **What's the difference between screenshot and video?**
   <details>
   <summary>Answer</summary>
   Screenshot captures single frame at specific moment; video captures entire test execution with all actions
   </details>

