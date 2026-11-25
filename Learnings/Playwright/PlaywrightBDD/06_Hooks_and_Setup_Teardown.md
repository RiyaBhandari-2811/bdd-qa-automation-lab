# 06: Hooks and Setup/Teardown

## Understanding Hooks

Hooks are functions that run at specific points during test execution:

```
Test Start
   ↓
BeforeAll (once)
   ↓
Scenario 1 ← Before (runs)
   Step 1
   Step 2
   Step 3
         ↓
        After (runs)
   ↓
Scenario 2 ← Before (runs)
   Step 1
   Step 2
         ↓
        After (runs)
   ↓
AfterAll (once)
Test End
```

---

## Hook Types

### BeforeAll / AfterAll

Runs once per entire test suite (not per scenario):

```javascript
const { BeforeAll, AfterAll } = require('@cucumber/cucumber');

BeforeAll(async function() {
  console.log('🚀 Starting entire test suite');
  // Create test database
  // Start test server
  // Initialize global state
});

AfterAll(async function() {
  console.log('✅ Test suite completed');
  // Stop test server
  // Clean up test database
  // Generate final reports
});
```

### Before / After

Runs before and after each scenario:

```javascript
const { Before, After } = require('@cucumber/cucumber');

Before(async function(scenario) {
  console.log(`📌 Starting: ${scenario.pickle.name}`);
  
  // Launch browser
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function(scenario) {
  console.log(`✔️ Completed: ${scenario.pickle.name}`);
  
  // Close browser
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});
```

### Tagged Hooks

Run only for scenarios with specific tags:

```javascript
Before('@logged-in', async function() {
  console.log('🔐 Pre-authenticating user...');
  await this.page.goto('https://example.com/login');
  await this.page.fill('#email', 'user@example.com');
  await this.page.fill('#password', 'password123');
  await this.page.click('button[type="submit"]');
  await this.page.waitForURL('**/dashboard');
});

Before('@admin', async function() {
  console.log('👑 Pre-authenticating as admin...');
  await this.page.goto('https://example.com/login');
  await this.page.fill('#email', 'admin@example.com');
  await this.page.fill('#password', 'admin123');
  await this.page.click('button[type="submit"]');
  await this.page.waitForURL('**/admin');
});

After('@slow', async function(scenario) {
  // Extra cleanup for slow tests
  console.log('Clearing browser cache...');
  await this.context.clearCookies();
});
```

---

## Browser Lifecycle Management

### Setup Browser

```javascript
Before(async function() {
  // Launch browser once per scenario
  this.browser = await chromium.launch({
    headless: process.env.CI === 'true',
    slowMo: 100 // For debugging
  });

  // Create context with specific options
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    offline: false,
    recordVideo: { dir: 'videos' },
    recordHar: { path: 'archive.har' }
  });

  // Create page
  this.page = await this.context.newPage();
  
  // Set default timeout
  this.page.setDefaultTimeout(5000);
  this.page.setDefaultNavigationTimeout(5000);
});
```

### Cleanup After Test Failure

```javascript
After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    // Capture failure evidence
    const fileName = `failure_${Date.now()}`;
    
    // Screenshot
    await this.page.screenshot({ 
      path: `reports/screenshots/${fileName}.png` 
    });
    
    // Page source
    const html = await this.page.content();
    const fs = require('fs');
    fs.writeFileSync(
      `reports/html/${fileName}.html`, 
      html
    );
    
    // Console logs
    console.log('Page console output:', this.consoleLogs);
  }

  // Always cleanup
  await this.context?.close();
  await this.browser?.close();
});
```

---

## Capturing Browser Events

### Console Logs

```javascript
Before(async function() {
  this.page = await this.context.newPage();
  this.consoleLogs = [];

  this.page.on('console', (msg) => {
    this.consoleLogs.push({
      type: msg.type(),
      text: msg.text()
    });
  });
});

Then('I should see console message {string}', async function(message) {
  const found = this.consoleLogs.some(log => 
    log.text.includes(message)
  );
  expect(found).toBeTruthy();
});
```

### Request/Response Interception

```javascript
Before(async function() {
  this.requests = [];
  this.responses = [];

  this.page.on('request', (request) => {
    this.requests.push({
      url: request.url(),
      method: request.method(),
      time: Date.now()
    });
  });

  this.page.on('response', (response) => {
    this.responses.push({
      url: response.url(),
      status: response.status(),
      time: Date.now()
    });
  });
});

Then('API endpoint {string} should be called', async function(endpoint) {
  const found = this.requests.some(req => 
    req.url.includes(endpoint)
  );
  expect(found).toBeTruthy();
});
```

### Dialog Handling

```javascript
Before(async function() {
  this.page.on('dialog', async (dialog) => {
    console.log('Dialog detected:', dialog.message());
    await dialog.accept(); // Auto-accept dialogs
  });
});
```

---

## Multiple Browser Contexts

### Cross-Browser Testing

```javascript
Before('@chrome', async function() {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

Before('@firefox', async function() {
  this.browser = await firefox.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

Before('@webkit', async function() {
  this.browser = await webkit.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});
```

### Parallel Scenario Testing

```javascript
// Each scenario gets isolated browser context
Before(async function(scenario) {
  this.context = await this.browser.newContext({
    // Isolated storage per scenario
  });
  this.page = await this.context.newPage();
});
```

---

## Conditional Hooks

### Environment-Based Setup

```javascript
Before(async function() {
  const env = process.env.ENVIRONMENT || 'staging';
  
  if (env === 'local') {
    this.baseURL = 'http://localhost:3000';
  } else if (env === 'staging') {
    this.baseURL = 'https://staging.example.com';
  } else {
    this.baseURL = 'https://example.com';
  }

  this.page = await this.context.newPage();
  await this.page.goto(this.baseURL);
});
```

### Skip Hook Based on Tags

```javascript
Before(function(scenario) {
  // Skip for certain tags
  if (scenario.pickle.tags.some(tag => tag.name === '@skip-cleanup')) {
    return 'skipped';
  }
});
```

---

## 🏋️ Exercises

**Exercise 1:** Create hooks for browser setup and cleanup

<details>
<summary>✅ Answer</summary>

```javascript
const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');

BeforeAll(async function() {
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
  }
  console.log('📋 Test suite started');
});

Before(async function(scenario) {
  // Select browser based on tag
  let browser;
  if (scenario.pickle.tags.some(t => t.name === '@firefox')) {
    browser = await firefox.launch();
  } else if (scenario.pickle.tags.some(t => t.name === '@webkit')) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch({ headless: false });
  }

  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    const name = scenario.pickle.name.replace(/ /g, '_');
    await this.page.screenshot({ 
      path: `reports/${name}_failed.png` 
    });
  }

  await this.context.close();
  await this.browser.close();
});

AfterAll(async function() {
  console.log('✅ Test suite completed');
});
```

</details>

**Exercise 2:** Create tagged hooks for pre-login

<details>
<summary>✅ Answer</summary>

```javascript
Before('@logged-in', async function() {
  await this.page.goto('https://example.com/login');
  await this.page.fill('[data-test="email"]', 'user@example.com');
  await this.page.fill('[data-test="password"]', 'Password123');
  await this.page.click('[data-test="login-btn"]');
  await this.page.waitForURL('**/dashboard');
});

Before('@admin', async function() {
  await this.page.goto('https://example.com/login');
  await this.page.fill('[data-test="email"]', 'admin@example.com');
  await this.page.fill('[data-test="password"]', 'Admin123');
  await this.page.click('[data-test="login-btn"]');
  await this.page.waitForURL('**/admin');
});

Before('@guest', async function() {
  // Stay logged out for guest tests
  await this.page.goto('https://example.com');
});
```

</details>

---

## 🎤 Interview Questions

1. **What are Cucumber hooks and when do they run?**
   <details>
   <summary>Answer</summary>
   - Functions that run at specific test lifecycle points
   - BeforeAll/AfterAll: Once per suite
   - Before/After: Before/after each scenario
   - Can be tagged for conditional execution
   </details>

2. **Why is it important to clean up after tests?**
   <details>
   <summary>Answer</summary>
   - Prevent state leakage between tests
   - Free browser resources
   - Clean up test data
   - Ensure consistent test isolation
   - Prevent flaky tests
   </details>

3. **How do you handle test failures in hooks?**
   <details>
   <summary>Answer</summary>
   - Check scenario.result.status
   - Take screenshot on failure
   - Capture page HTML
   - Log console messages
   - Store diagnostic information
   </details>

4. **What's the difference between Before and tagged Before hooks?**
   <details>
   <summary>Answer</summary>
   - Before: Runs for all scenarios
   - Before(@tag): Runs only for scenarios with that tag
   - Multiple hooks can run (inheritance)
   - Useful for specific setup (login, admin, etc.)
   </details>

5. **How do you support multiple browsers in hooks?**
   <details>
   <summary>Answer</summary>
   - Create separate hooks for each browser
   - Use tags to identify which browser to use
   - Launch appropriate browser in hook
   - Reuse same step definitions
   - Each browser gets its own context
   </details>

---

**Previous:** [05_Step_Definitions_with_Playwright.md](05_Step_Definitions_with_Playwright.md)  
**Next:** [07_Advanced_Patterns.md](07_Advanced_Patterns.md)
