# 02: Setup and Configuration

## Project Setup

### Step 1: Initialize Project

```bash
mkdir my-bdd-project
cd my-bdd-project
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install --save-dev @cucumber/cucumber @playwright/test playwright
```

### Step 3: Create Project Structure

```bash
mkdir -p features/step_definitions features/support
mkdir -p test-results reports
```

---

## Project Structure

```
my-bdd-project/
├── features/
│   ├── step_definitions/
│   │   ├── common.steps.js
│   │   ├── user.steps.js
│   │   ├── product.steps.js
│   │   └── cart.steps.js
│   ├── support/
│   │   ├── hooks.js
│   │   ├── world.js
│   │   └── helpers.js
│   ├── user_login.feature
│   ├── product_search.feature
│   └── shopping_cart.feature
├── cucumber.js
├── playwright.config.js
├── package.json
└── README.md
```

---

## Cucumber Configuration

### cucumber.js

```javascript
module.exports = {
  default: {
    require: ['features/step_definitions/**/*.js'],
    requireModule: ['@babel/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 2
  },
  smoke: {
    tags: '@smoke',
    require: ['features/step_definitions/**/*.js'],
    format: ['html:reports/smoke-report.html']
  },
  regression: {
    tags: '@regression',
    require: ['features/step_definitions/**/*.js'],
    format: ['html:reports/regression-report.html']
  }
};
```

### Playwright Configuration

```javascript
// playwright.config.js
module.exports = {
  testDir: 'features',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { outputFolder: 'reports/playwright' }],
    ['json', { outputFile: 'reports/results.json' }]
  ],
  use: {
    baseURL: 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI
  }
};
```

---

## Package.json Scripts

```json
{
  "name": "my-bdd-project",
  "version": "1.0.0",
  "scripts": {
    "test": "cucumber-js",
    "test:smoke": "cucumber-js --profile smoke",
    "test:regression": "cucumber-js --profile regression",
    "test:debug": "node --inspect-brk ./node_modules/.bin/cucumber-js",
    "test:watch": "nodemon --exec 'npm test'",
    "test:parallel": "cucumber-js --parallel 4",
    "report": "node scripts/generateReport.js"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^9.0.0",
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0"
  }
}
```

---

## World and Context Setup

### world.js

```javascript
// features/support/world.js
const { World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

class PlaywrightWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async launchBrowser(browserType = 'chromium') {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    await this.context.close();
    await this.browser.close();
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async fillInput(selector, text) {
    await this.page.fill(selector, text);
  }

  async clickButton(selector) {
    await this.page.click(selector);
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(fileName) {
    await this.page.screenshot({ path: `reports/screenshots/${fileName}.png` });
  }
}

module.exports = PlaywrightWorld;
```

### hooks.js

```javascript
// features/support/hooks.js
const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const PlaywrightWorld = require('./world');

BeforeAll(async function() {
  console.log('🚀 Starting test suite...');
});

Before(async function(scenario) {
  console.log(`\n📌 Starting scenario: ${scenario.pickle.name}`);
  
  // Launch browser for each scenario
  await this.launchBrowser('chromium');
});

Before('@logged-in', async function() {
  // Pre-login for specific scenarios
  await this.navigateTo('https://example.com/login');
  await this.fillInput('#email', 'user@example.com');
  await this.fillInput('#password', 'password123');
  await this.clickButton('button[type="submit"]');
  await this.page.waitForURL('**/dashboard');
});

After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    console.log('❌ Test failed, taking screenshot...');
    const fileName = `${scenario.pickle.name.replace(/ /g, '_')}_${Date.now()}`;
    await this.takeScreenshot(fileName);
  }

  // Close browser after each scenario
  await this.closeBrowser();
});

AfterAll(async function() {
  console.log('\n✅ Test suite completed!');
});

module.exports = { PlaywrightWorld };
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Profile
```bash
npm run test:smoke
npm run test:regression
```

### Run Specific Feature File
```bash
npx cucumber-js features/login.feature
```

### Run with Tags
```bash
npx cucumber-js --tags @smoke
npx cucumber-js --tags @smoke --tags @login
npx cucumber-js --tags "@smoke or @regression"
```

### Debug Mode
```bash
npm run test:debug
# Then open chrome://inspect in browser
```

### Parallel Execution
```bash
npx cucumber-js --parallel 4
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/bdd-tests.yml
name: Playwright BDD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run BDD tests
        run: npm test
      
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cucumber-reports
          path: reports/
```

---

## 🏋️ Exercises

**Exercise 1:** Set up a complete Playwright BDD project structure

<details>
<summary>✅ Answer</summary>

```bash
# Create project
mkdir my-bdd-project && cd my-bdd-project
npm init -y

# Install dependencies
npm install --save-dev @cucumber/cucumber @playwright/test playwright

# Create structure
mkdir -p features/step_definitions features/support
mkdir -p reports/screenshots

# Create essential files
touch features/example.feature
touch features/support/world.js
touch features/support/hooks.js
touch features/step_definitions/example.steps.js
touch cucumber.js
touch package.json

# Add npm scripts to package.json
npm set-script test "cucumber-js"
npm set-script test:debug "node --inspect-brk ./node_modules/.bin/cucumber-js"
```

</details>

**Exercise 2:** Create a custom World class with utility methods

<details>
<summary>✅ Answer</summary>

```javascript
class PlaywrightWorld extends World {
  async fillForm(formData) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.fill(selector, value);
    }
  }

  async expectText(text) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  async expectUrl(url) {
    await expect(this.page).toHaveURL(url);
  }

  async getTableData(tableSelector) {
    return await this.page.locator(tableSelector).allTextContents();
  }

  async handleAlert(action = 'accept') {
    this.page.on('dialog', dialog => {
      if (action === 'accept') dialog.accept();
      else dialog.dismiss();
    });
  }
}
```

</details>

---

## 🎤 Interview Questions

1. **What are the essential dependencies for Playwright BDD?**
   <details>
   <summary>Answer</summary>
   - @cucumber/cucumber (BDD framework)
   - @playwright/test (Playwright library)
   - playwright (browser installation)
   - Optional: @babel/register, formatters, reporters
   </details>

2. **What is the World/Context in Cucumber?**
   <details>
   <summary>Answer</summary>
   - Shared state between step definitions
   - Holds Playwright objects (page, browser, context)
   - Custom methods and utilities
   - Instantiated once per scenario
   - Cleaned up after scenario completes
   </details>

3. **How do Hooks work in Playwright BDD?**
   <details>
   <summary>Answer</summary>
   - Before: Runs before each scenario (browser launch)
   - After: Runs after each scenario (browser cleanup)
   - BeforeAll/AfterAll: Run once per test suite
   - Tagged hooks: Run only for scenarios with specific tags
   </details>

4. **How do you configure parallel execution?**
   <details>
   <summary>Answer</summary>
   - In cucumber.js: `parallel: 4`
   - Run with flag: `cucumber-js --parallel 4`
   - Each worker gets independent browser instance
   - Improves execution speed
   </details>

5. **What's the purpose of cucumber.js configuration file?**
   <details>
   <summary>Answer</summary>
   - Define test profiles (smoke, regression)
   - Configure formatters and reporters
   - Set step definition paths
   - Configure parallel execution
   - Set output directories
   </details>

---

**Previous:** [01_Introduction_to_Playwright_BDD.md](01_Introduction_to_Playwright_BDD.md)  
**Next:** [03_Writing_Tests_with_BDD.md](03_Writing_Tests_with_BDD.md)
