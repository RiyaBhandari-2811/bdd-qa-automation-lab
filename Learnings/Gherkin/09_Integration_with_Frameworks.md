# 09: Integration with Frameworks

## Popular BDD Frameworks

### Cucumber (Java/Ruby/JavaScript)
Cucumber is the most popular BDD framework supporting multiple languages.

**Installation (JavaScript):**
```bash
npm install @cucumber/cucumber @cucumber/cucumber-expressions
```

**Configuration (cucumber.js):**
```javascript
module.exports = {
  default: {
    require: ['features/step_definitions/**/*.js'],
    format: ['progress', 'html:cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
```

**Running:**
```bash
npx cucumber-js
npx cucumber-js --tags @smoke
npx cucumber-js features/login.feature
```

---

### Behave (Python)
Lightweight BDD framework for Python.

**Installation:**
```bash
pip install behave
```

**Directory Structure:**
```
features/
├── login.feature
└── steps/
    └── login_steps.py
```

**Running:**
```bash
behave
behave --tags=@smoke
behave features/login.feature
```

---

### SpecFlow (.NET)
BDD framework for .NET/C#.

**Installation:**
```bash
dotnet add package SpecFlow
```

**Running:**
```bash
dotnet test
dotnet test --filter Category=Smoke
```

---

## Integration with Test Frameworks

### Cucumber + Playwright (JavaScript)
```javascript
// features/support/hooks.js
const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

Before(async function() {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function() {
  await this.context.close();
  await this.browser.close();
});

// features/step_definitions/login.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function() {
  await this.page.goto('https://example.com/login');
});

When('I login with {string} and {string}', async function(email, password) {
  await this.page.fill('#email', email);
  await this.page.fill('#password', password);
  await this.page.click('button[type="submit"]');
});

Then('I should be on dashboard', async function() {
  await expect(this.page).toHaveURL('**/dashboard');
});
```

---

### Behave + Selenium (Python)
```python
# features/steps/login_steps.py
from behave import given, when, then
from selenium.webdriver.common.by import By

@given('I am on the login page')
def step_goto_login(context):
    context.driver.get('https://example.com/login')

@when('I login with {email} and {password}')
def step_login(context, email, password):
    context.driver.find_element(By.ID, 'email').send_keys(email)
    context.driver.find_element(By.ID, 'password').send_keys(password)
    context.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

@then('I should see dashboard')
def step_verify_dashboard(context):
    assert 'dashboard' in context.driver.current_url
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Cucumber Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Cucumber tests
        run: npx cucumber-js
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: cucumber-report
          path: cucumber-report.html
```

### GitLab CI
```yaml
test:
  image: node:18
  script:
    - npm ci
    - npm run test:bdd
  artifacts:
    reports:
      cucumber: cucumber-report.json
    when: always
  tags:
    - docker
```

---

## Reporting

### HTML Reports
```bash
npx cucumber-js --format html:reports/cucumber-report.html
```

### JSON Reports
```bash
npx cucumber-js --format json:reports/cucumber-report.json
```

### JUnit Reports
```bash
npx cucumber-js --format junit:reports/cucumber-report.xml
```

---

## Plugin Architecture

### Custom Formatters
```javascript
class CustomFormatter {
  constructor(options) {
    options.eventBroadcaster.on('test-run-finished', this.onFinished);
  }

  onFinished() {
    // Custom reporting logic
  }
}

module.exports = CustomFormatter;
```

---

## Best Practices for Framework Integration

### 1. Separation of Concerns
```
features/
├── step_definitions/      # Step implementation
├── support/
│   ├── hooks.js           # Setup/teardown
│   └── world.js           # Shared context
└── *.feature              # Test scenarios
```

### 2. Reusable Hooks
```javascript
Before('@logged-in', async function() {
  await this.login('user@test.com');
});

Before('@admin', async function() {
  await this.login('admin@test.com');
});
```

### 3. Error Handling
```javascript
After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    // Take screenshot on failure
    await this.page.screenshot({ path: `failed-${scenario.name}.png` });
  }
  await this.page.close();
});
```

---

## 🏋️ Exercises

**Exercise 1**: Set up Cucumber with Playwright

<details>
<summary>✅ Answer</summary>

```bash
# Install dependencies
npm init
npm install @cucumber/cucumber @playwright/test

# Create structure
mkdir features features/step_definitions features/support

# Create feature file
cat > features/login.feature << 'EOF'
Feature: Login
  Scenario: Successful login
    Given I am on login page
    When I login with "user@test.com"
    Then I should be logged in
EOF

# Create steps
cat > features/step_definitions/login.js << 'EOF'
const { Given, When, Then } = require('@cucumber/cucumber');

Given('I am on login page', async function() {
  await this.page.goto('https://example.com/login');
});

When('I login with {string}', async function(email) {
  // Implementation
});

Then('I should be logged in', async function() {
  // Assertion
});
EOF

# Run
npx cucumber-js
```

</details>

**Exercise 2**: Configure GitHub Actions for Cucumber

<details>
<summary>✅ Answer</summary>

```yaml
# .github/workflows/bdd.yml
name: BDD Tests

on: [push, pull_request]

jobs:
  bdd-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - run: npm run test:bdd
      
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: bdd-reports
          path: reports/
```

</details>

---

## 🎤 Interview Questions

1. **What is Cucumber and why use it?**
   <details>
   <summary>Answer</summary>
   Open-source BDD framework supporting multiple languages, enabling non-technical stakeholders to understand tests
   </details>

2. **How do you integrate Cucumber with Playwright?**
   <details>
   <summary>Answer</summary>
   Install both packages, write feature files, implement step definitions using Playwright API, run with Cucumber CLI
   </details>

3. **What frameworks support Gherkin?**
   <details>
   <summary>Answer</summary>
   Cucumber (multiple languages), Behave (Python), SpecFlow (.NET), Gauge, and others
   </details>

4. **How do you set up CI/CD for BDD?**
   <details>
   <summary>Answer</summary>
   Create workflow file, install dependencies, run tests in CI pipeline, generate and upload reports
   </details>

5. **What reporting formats does Cucumber support?**
   <details>
   <summary>Answer</summary>
   HTML, JSON, JUnit XML, and can be extended with custom formatters
   </details>
