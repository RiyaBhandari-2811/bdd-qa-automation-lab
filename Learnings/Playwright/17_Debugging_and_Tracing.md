# 17: Debugging and Tracing

## Debug Mode

### Run Tests in Debug Mode

```bash
# Interactive debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/login.spec.js --debug
```

In debug mode, you can:
- Step through code
- Inspect variables
- Execute commands in REPL
- Pause on breakpoints

---

## Playwright Inspector

### Interactive Inspector

```bash
# Open inspector UI
PWDEBUG=1 npx playwright test
```

Features:
- Step over/into code
- Watch panel (inspect page)
- Console
- Screenshots at each step

---

## Tracing

### Enable Tracing in Config

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    trace: 'on-first-retry',
    // or
    // trace: 'on',    // Always trace
    // trace: 'off'    // No tracing
  },
});
```

### Manual Tracing

```javascript
test('Trace test execution', async ({ page, context }) => {
  // Start tracing
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
  
  // Perform actions
  await page.goto('https://example.com');
  await page.click('button');
  
  // Stop and save
  await context.tracing.stop({ path: 'trace.zip' });
});
```

### View Trace

```bash
# Open trace viewer
npx playwright show-trace trace.zip
```

---

## Browser DevTools

### Open DevTools

```javascript
test('Open browser DevTools', async ({ page }) => {
  // Open DevTools (Chromium only)
  await page.evaluate(() => window.open('devtools://' + window.location.href));
});
```

---

## Logging

### Console Logging

```javascript
test('Logging', async ({ page }) => {
  // Log from test
  console.log('Starting test');
  
  // Listen to page console
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error);
  });
  
  await page.goto('https://example.com');
});
```

---

## Screenshots on Failure

```javascript
test.afterEach(async ({ page }) => {
  if (test.info().status !== 'passed') {
    // Take screenshot on failure
    await page.screenshot({ path: `failure-${Date.now()}.png` });
  }
});
```

---

## Custom Error Messages

```javascript
test('Better error messages', async ({ page }) => {
  const element = page.locator('.missing-element');
  
  try {
    await element.click();
  } catch (error) {
    throw new Error(
      `Failed to click element. ` +
      `Status: ${error.message}. ` +
      `Page URL: ${page.url()}`
    );
  }
});
```

---

## Page Logs

### Capture Page Events

```javascript
test('Capture page events', async ({ page }) => {
  // Uncaught exceptions
  page.on('crash', () => console.log('Page crashed!'));
  
  // Page closed
  page.on('close', () => console.log('Page closed!'));
  
  // Response received
  page.on('response', response => {
    console.log('Response:', response.url(), response.status());
  });
  
  // Request sent
  page.on('request', request => {
    console.log('Request:', request.url());
  });
  
  await page.goto('https://example.com');
});
```

---

## Slow Motion

### Run Tests Slowly (For Debugging)

```bash
# Run with 1 second delay between actions
npx playwright test --headed --debug-on-failure
```

In config:
```javascript
export default defineConfig({
  use: {
    slowMo: 1000,  // 1 second delay
  },
});
```

---

## Browser Emulation Inspection

```javascript
test('Inspect emulation settings', async ({ page, browserName }) => {
  const viewport = page.viewportSize();
  const context = page.context();
  const cookies = await context.cookies();
  
  console.log('Browser:', browserName);
  console.log('Viewport:', viewport);
  console.log('Cookies:', cookies);
});
```

---

## 🏋️ Exercises

**Exercise 1**: Run a test in debug mode and step through execution.

**Exercise 2**: Enable tracing and view the trace file.

**Exercise 3**: Add logging and console capture to understand test execution.

---

## 🎤 Interview Questions

1. **What is debug mode in Playwright?**
   - Interactive debugging with step-by-step code execution

2. **How do you view test execution trace?**
   - Run `npx playwright show-trace trace.zip` to open trace viewer

3. **What information is captured in trace?**
   - Screenshots, DOM snapshots, network activity, browser logs

4. **How do you debug a failing test?**
   - Use --debug flag, add console logs, take screenshots, enable tracing

