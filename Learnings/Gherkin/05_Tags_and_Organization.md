# 05: Tags and Organization

## What are Tags?

Tags are labels prefixed with `@` that organize and categorize scenarios. They enable selective test execution and grouping.

---

## Basic Syntax

```gherkin
@tag1 @tag2
Scenario: Scenario description
  ...steps...
```

---

## Common Tagging Patterns

### 1. By Test Type
```gherkin
@smoke
Scenario: Critical user login

@regression
Scenario: Edge case password validation

@acceptance
Scenario: Business requirement verification

@performance
Scenario: Page load time verification
```

### 2. By Feature Area
```gherkin
@authentication
Scenario: User login

@payment
Scenario: Process credit card

@inventory
Scenario: Update stock levels
```

### 3. By Priority
```gherkin
@critical
Scenario: User cannot lose data

@high
Scenario: Payment processing

@medium
Scenario: Search functionality

@low
Scenario: Display formatting
```

### 4. By Browser/Device
```gherkin
@chrome
@firefox
@safari
Scenario: Cross-browser login test

@mobile
@tablet
Scenario: Responsive design

@desktop
Scenario: Desktop-only feature
```

---

## Running Tests by Tags

### Cucumber (JavaScript)
```bash
# Run only smoke tests
npx cucumber-js --tags @smoke

# Run smoke AND regression
npx cucumber-js --tags @smoke\ and\ @regression

# Run everything except slow tests
npx cucumber-js --tags 'not @slow'

# Run (critical AND high) OR emergency
npx cucumber-js --tags '(@critical and @high) or @emergency'
```

### Behave (Python)
```bash
# Run only smoke tests
behave --tags=@smoke

# Run multiple tags
behave --tags=@smoke,@critical

# Skip tags
behave --tags=-@slow
```

### SpecFlow (.NET)
```bash
# Run only smoke tests
dotnet test -- --filter Category=smoke
```

---

## Complex Tag Expressions

### AND Logic
```gherkin
@smoke @critical
Scenario: Both tags required
```

Run with: `--tags '@smoke and @critical'`

### OR Logic
```gherkin
@smoke
Scenario: One tag OR the other
```

Run with: `--tags '@smoke or @regression'`

### NOT Logic
```gherkin
@wip
Scenario: Under development
```

Run with: `--tags 'not @wip'` (skip WIP scenarios)

---

## Real-World Tagging Strategy

```gherkin
# File: features/auth/login.feature

@authentication
@smoke
@critical
Feature: User Login

  @login_valid_credentials
  @desktop
  @chrome
  Scenario: Successful login with valid email
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

  @login_invalid_password
  @mobile
  @retry
  Scenario: Failed login with invalid password
    Given I am on the login page
    When I enter invalid password
    Then I should see error message

  @wip
  Scenario: Login with biometric
    Given I have enabled biometric
    When I authenticate with fingerprint
    Then I should be logged in

  @slow
  @performance
  Scenario: Login performance under load
    When 1000 users login simultaneously
    Then response time should be under 2 seconds
```

---

## Tag Usage Examples

### By CI/CD Pipeline
```gherkin
@smoke    # Quick validation (< 5 mins)
@sanity   # Basic functionality
@full     # Complete test suite
@nightly  # Long-running tests
```

### By Test Stability
```gherkin
@stable   # Always passes
@flaky    # Sometimes fails (investigate)
@known_issue  # Known defect
```

### By Platform
```gherkin
@web
@mobile
@api
@desktop
```

### By Release Phase
```gherkin
@v1.0
@v2.0
@beta
@production
```

---

## Best Practices

### 1. Keep Tags Consistent
```gherkin
# ✅ GOOD - Consistent naming
@authentication
@payment
@inventory

# ❌ BAD - Inconsistent
@auth
@payment-module
@inv
```

### 2. Avoid Tag Overload
```gherkin
# ❌ BAD - Too many tags
@critical @smoke @regression @high @production @web @browser @chrome @desktop @auth @login @valid @credentials @english @us

# ✅ GOOD - Focused tags
@smoke
@critical
@authentication
```

### 3. Use Tags Strategically
```gherkin
# ✅ GOOD - Clear purpose
@smoke       # Quick validation
@regression  # Comprehensive testing
@wip         # Work in progress

# ❌ BAD - Redundant
@test
@scenario
@feature
```

---

## 🏋️ Exercises

**Exercise 1**: Tag scenarios appropriately

<details>
<summary>✅ Answer</summary>

```gherkin
Feature: Payment Processing

@smoke
@critical
@payment
Scenario: Successful payment with valid card
  Given I have items in cart
  When I proceed to payment
  And I enter valid card details
  Then payment should be processed
  And order should be confirmed

@regression
@payment
@edge_case
Scenario: Reject payment with expired card
  Given I have items in cart
  When I try to pay with expired card
  Then payment should be declined

@wip
@payment
Scenario: Payment with cryptocurrency
  Given I accept cryptocurrency
  When I proceed with crypto payment
  Then payment should process
```

</details>

**Exercise 2**: Write Cucumber command to run specific tests

<details>
<summary>✅ Answer</summary>

```bash
# Run only smoke tests (quick validation)
npx cucumber-js --tags @smoke

# Run smoke and critical (high priority)
npx cucumber-js --tags '@smoke and @critical'

# Run regression but skip slow tests
npx cucumber-js --tags '@regression and not @slow'

# Run everything except work-in-progress
npx cucumber-js --tags 'not @wip'

# Run payment tests for desktop
npx cucumber-js --tags '@payment and @desktop'
```

</details>

---

## 🎤 Interview Questions

1. **What are tags used for?**
   <details>
   <summary>Answer</summary>
   Tags organize scenarios, enable selective test execution, group by type/priority/platform, and support CI/CD workflows
   </details>

2. **How do you run tests with specific tags?**
   <details>
   <summary>Answer</summary>
   Use command-line options like `--tags @smoke` or `--tags '@critical and @high'` depending on framework
   </details>

3. **What's the best tagging strategy?**
   <details>
   <summary>Answer</summary>
   Use meaningful tags for test type (smoke, regression), priority (critical, high), and platform (web, mobile)
   </details>

4. **Can you combine multiple tags?**
   <details>
   <summary>Answer</summary>
   Yes, use AND (both required) or OR (either one) logic to combine tag expressions
   </details>

5. **What tags help with CI/CD?**
   <details>
   <summary>Answer</summary>
   @smoke (quick validation), @regression (full suite), @nightly (long-running), @wip (skip unfinished)
   </details>
