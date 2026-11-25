# 02: Installation and Setup

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Text editor (VS Code recommended)
- Basic JavaScript knowledge

---

## Installation Steps

### Step 1: Create Project Directory
```bash
mkdir playwright-project
cd playwright-project
npm init -y
```

### Step 2: Install Playwright
```bash
npm install -D @playwright/test
npm install -D @playwright/test@latest
```

### Step 3: Install Browsers
```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers (~300MB).

---

## Project Structure

```
playwright-project/
├── tests/
│   └── example.spec.js
├── playwright.config.js
├── package.json
└── package-lock.json
```

---

## First Test Script

### Create test file: `tests/first.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('should load Google homepage', async ({ page }) => {
  // Navigate to URL
  await page.goto('https://www.google.com');
  
  // Verify title
  expect(page.url()).toContain('google.com');
});
```

### Run the test
```bash
npx playwright test
```

---

## Configuration: `playwright.config.js`

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/first.spec.js

# Run with UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
```

---

## Useful npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report"
  }
}
```

---

## 🏋️ Exercises

**Exercise 1**: Install Playwright and create your first test.

<details>
<summary>✅ Answer</summary>

```bash
# Step 1: Create project
mkdir playwright-project
cd playwright-project
npm init -y

# Step 2: Install Playwright
npm install -D @playwright/test

# Step 3: Install browsers
npx playwright install

# Step 4: Create first test
# Create file: tests/first.spec.js
```

**tests/first.spec.js:**
```javascript
import { test, expect } from '@playwright/test';

test('should load example website', async ({ page }) => {
  await page.goto('https://example.com');
  
  expect(page.url()).toContain('example.com');
  expect(await page.title()).toBeTruthy();
});
```

**Step 5: Run test**
```bash
npx playwright test
```

</details>

**Exercise 2**: Modify config to run only Chromium and Firefox.

<details>
<summary>✅ Answer</summary>

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

</details>

**Exercise 3**: Create a test that navigates to your favorite website and prints the title.

<details>
<summary>✅ Answer</summary>

```javascript
test('Get website title', async ({ page }) => {
  await page.goto('https://github.com');
  
  const title = await page.title();
  console.log(`Website Title: ${title}`);
  
  expect(title).toContain('GitHub');
});
```

</details>

---

## 🎤 Interview Questions

1. **What command installs Playwright browsers?**
   <details>
   <summary>Answer</summary>
   `npx playwright install` - Downloads Chromium, Firefox, and WebKit browsers (~300MB)
   </details>

2. **What is `playwright.config.js` used for?**
   <details>
   <summary>Answer</summary>
   Configure test settings like browsers, timeout, reporters, baseURL, parallelization, retries, etc.
   </details>

3. **How do you run tests in headed mode?**
   <details>
   <summary>Answer</summary>
   `npx playwright test --headed` - Shows browser window while tests run
   </details>

4. **What is the default test directory?**
   <details>
   <summary>Answer</summary>
   `./tests` directory by default (configurable in playwright.config.js)
   </details>

