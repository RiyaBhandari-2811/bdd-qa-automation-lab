# 18: CI/CD Integration

## GitHub Actions

### Basic GitHub Actions Workflow

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
```

---

## Docker

### Dockerfile for Playwright

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
```

### Docker Compose

```yaml
version: '3'
services:
  playwright-tests:
    build: .
    environment:
      CI: true
    volumes:
      - ./test-results:/app/test-results
```

### Run Docker Tests

```bash
docker build -t playwright-tests .
docker run --rm -v $(pwd)/test-results:/app/test-results playwright-tests
```

---

## CI Configuration

### Environment Variables

```bash
# .env.ci
API_URL=http://localhost:3000
TEST_USER=ci-user
TEST_PASSWORD=ci-password
HEADLESS=true
```

### playwright.config.js for CI

```javascript
export default defineConfig({
  testDir: './tests',
  fullyParallel: !process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.API_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Different CI Services

### GitLab CI

```yaml
# .gitlab-ci.yml
test:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx playwright install
    - npm test
  artifacts:
    when: always
    paths:
      - test-results/
```

### Jenkins

```groovy
pipeline {
  agent any
  
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
  
  post {
    always {
      publishHTML([
        reportDir: 'test-results/html',
        reportFiles: 'index.html',
        reportName: 'Playwright Report'
      ])
    }
  }
}
```

---

## Reporting

### HTML Report

```bash
# Generate and view report
npx playwright show-report
```

### JUnit XML Report

```javascript
// playwright.config.js
export default defineConfig({
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
});
```

---

## Failure Handling

### Retry on Failure

```javascript
export default defineConfig({
  retries: 2,
  timeout: 30000,
});
```

### Screenshot on Failure

```javascript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
});
```

---

## Performance Optimization

### Parallel Execution in CI

```javascript
export default defineConfig({
  fullyParallel: true,
  workers: 4,
});
```

### Sharding Tests

```bash
# Run specific shard
npx playwright test --shard=1/4  # First quarter of tests
npx playwright test --shard=2/4  # Second quarter
```

---

## Secret Management

### Environment Variables in CI

```yaml
# GitHub Actions
- name: Run tests
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  run: npm test
```

---

## Test Flakiness Handling

### Retry Strategy

```javascript
test.describe('Flaky tests', () => {
  test.describe.configure({ retries: 3 });
  
  test('Potentially flaky test', async ({ page }) => {
    // This test retries up to 3 times
  });
});
```

---

## Post-Test Actions

### Archive Artifacts

```bash
# In CI, automatically save test results
artifact_path="test-results-${BUILD_ID}"
mkdir -p "$artifact_path"
mv test-results/* "$artifact_path/"
```

---

## 🏋️ Exercises

**Exercise 1**: Create a GitHub Actions workflow for Playwright tests.

**Exercise 2**: Set up Docker container to run Playwright tests.

**Exercise 3**: Configure parallel test execution in CI pipeline.

---

## 🎤 Interview Questions

1. **What CI services support Playwright?**
   - GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines, etc.

2. **How do you handle parallel tests in CI?**
   - Set workers and use sharding to distribute tests

3. **What should you do with test results in CI?**
   - Upload artifacts (reports, videos, screenshots) for review

4. **How many retries should you set in CI?**
   - Usually 2-3 for handling flakiness, but address root cause

