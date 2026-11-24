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

**Exercise 2**: Enable video recording for your tests and run them.

**Exercise 3**: Create baseline and comparison screenshots for visual regression testing.

---

## 🎤 Interview Questions

1. **What are the different video recording options?**
   - `on`, `off`, `retain-on-failure`

2. **What information is captured in a trace?**
   - Screenshots, snapshots, network activity, browser logs

3. **How do you view test artifacts?**
   - Use `npx playwright show-report` to view HTML report

4. **What's the difference between screenshot and video?**
   - Screenshot captures single frame; video captures entire test execution

