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

<details>
<summary>✅ Answer</summary>

```javascript
// test.spec.js
test('Debug mode example', async ({ page }) => {
  // This test can be debugged interactively
  
  await page.goto('https://example.com');
  
  // Inspector will pause here when running in debug mode
  await page.locator('#search').fill('test query');
  
  // Step through each action
  await page.locator('#search-btn').click();
  
  // View element states and DOM
  const results = page.locator('.search-result');
  const count = await results.count();
  
  expect(count).toBeGreaterThan(0);
});

// Run in debug mode:
// npx playwright test --debug
// Or: PWDEBUG=1 npx playwright test
// 
// In debug mode:
// - Code is highlighted with debugger paused
// - Inspect page DOM and element states
// - Step over, into, or out of actions
// - Evaluate expressions in console
```

</details>

**Exercise 2**: Enable tracing and view the trace file.

<details>
<summary>✅ Answer</summary>

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    trace: 'on-first-retry',  // Record trace on test failure
    // or use 'on' to always record
  },
});

// In test file:
test('Trace enabled test', async ({ page, context }) => {
  // Optionally start tracing manually
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  await page.goto('https://example.com');
  await page.click('button');
  await page.fill('input', 'data');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'trace.zip' });
});

// View trace:
// npx playwright show-trace trace.zip
// 
// In trace viewer:
// - Play through test execution
// - View screenshots at each step
// - Inspect DOM snapshots
// - Review network requests
// - Check browser console logs
```

</details>

**Exercise 3**: Add logging and console capture to understand test execution.

<details>
<summary>✅ Answer</summary>

```javascript
test('Logging and console capture', async ({ page, context }) => {
  // Capture console messages
  page.on('console', msg => {
    console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
  });
  
  // Capture page errors
  page.on('pageerror', err => {
    console.error(`Page Error: ${err.message}`);
  });
  
  // Capture request/response logs
  page.on('request', req => {
    console.log(`→ ${req.method()} ${req.url()}`);
  });
  
  page.on('response', res => {
    console.log(`← ${res.status()} ${res.url()}`);
  });
  
  // Add custom logging
  console.log('Test started');
  
  await page.goto('https://example.com');
  console.log('Page loaded');
  
  const element = page.locator('#main-button');
  console.log(`Element visible: ${await element.isVisible()}`);
  
  if (await element.isVisible()) {
    console.log('Clicking button');
    await element.click();
    console.log('Button clicked');
  }
  
  // Check browser console for client-side logs
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  console.log('All console messages:', logs);
});
```

</details>

---

## 🎤 Interview Questions

1. **What is debug mode in Playwright?**
   <details>
   <summary>Answer</summary>
   Interactive debugging mode where you can step through code execution and inspect element states in real-time
   </details>

2. **How do you view test execution trace?**
   <details>
   <summary>Answer</summary>
   Run `npx playwright show-trace trace.zip` to open trace viewer with execution timeline
   </details>

3. **What information is captured in trace?**
   <details>
   <summary>Answer</summary>
   Screenshots, DOM snapshots, network requests/responses, browser console logs, and execution timeline
   </details>

4. **How do you debug a failing test?**
   <details>
   <summary>Answer</summary>
   Use `--debug` flag for interactive debugging, enable tracing, add console logs, take screenshots, check browser events
   </details>

