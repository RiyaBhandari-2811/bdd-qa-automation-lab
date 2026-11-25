# 08: Best Practices

## Writing Good Gherkin

### 1. Clear and Concise Language

#### ❌ Bad Examples
```gherkin
Scenario: System does stuff
  Given some precondition
  When something happens
  Then some result occurs

Scenario: Test login function
  Given I am on page
  When I click thing
  Then I see thing
```

#### ✅ Good Examples
```gherkin
Scenario: Successful login with valid email and password
  Given I am on the login page
  When I enter valid email and password
  And I click the login button
  Then I should be redirected to dashboard

Scenario: Display error message when password is incorrect
  Given I am on the login page
  When I enter valid email and incorrect password
  Then I should see an error message
```

---

## 2. Business-Focused Language

### ❌ Technical Language
```gherkin
Scenario: HTTP 200 response on API call
  When I send GET request to /api/users
  Then response status should be 200
  And response should contain JSON array
```

### ✅ Business Language
```gherkin
Scenario: Retrieve list of users
  When I request the users list
  Then all users should be displayed
  And the list should not be empty
```

---

## 3. Single Responsibility Per Scenario

### ❌ Testing Too Much
```gherkin
Scenario: Complete user journey
  Given I am on the home page
  When I register
  And I login
  And I browse products
  And I add item to cart
  And I checkout
  Then my order should be confirmed
  And inventory should update
  And email should be sent
```

### ✅ Focused Scenarios
```gherkin
Scenario: Register new user account
  When I provide valid registration details
  Then my account should be created
  And I should receive confirmation email

Scenario: Successful user login
  Given I have a registered account
  When I login with valid credentials
  Then I should access my dashboard

Scenario: Purchase item from cart
  Given I have items in cart
  When I proceed to checkout
  Then order should be confirmed
```

---

## 4. Avoid Testing Implementation

### ❌ Testing How, Not What
```gherkin
Scenario: Validate password
  When I check password length is > 8
  And I check contains uppercase
  And I check contains numbers
  Then validation passes

Scenario: Database query
  Given database is connected
  When I execute SELECT query
  Then result set has rows
```

### ✅ Testing Business Behavior
```gherkin
Scenario: Reject weak passwords
  When I try to create account with weak password
  Then system should reject the password
  And show password requirements

Scenario: Retrieve user information
  When I request my profile
  Then my personal information should be displayed
```

---

## 5. Use Consistent Terminology

### ✅ Consistent Terminology
```gherkin
Feature: Product Management
  Scenario: Add product to inventory
    Given I have a product
    When I add the product to inventory
    Then the product should be in inventory

  Scenario: Remove product from inventory
    Given I have a product in inventory
    When I remove the product from inventory
    Then the product should not be in inventory
```

### ❌ Inconsistent Terminology
```gherkin
Feature: Product Management
  Scenario: Add item to stock
    Given I have a commodity
    When I insert the article into warehouse
    Then the item should be in stock

  Scenario: Delete product from inventory
    Given I have an item in stock
    When I take away the product
    Then the commodity should be removed
```

---

## 6. DRY Principle (Don't Repeat Yourself)

### ❌ Repetitive
```gherkin
Scenario: Login as admin
  Given I am on login page
  When I enter "admin@test.com"
  And I enter "admin123"
  Then I should be on dashboard

Scenario: Login as user
  Given I am on login page
  When I enter "user@test.com"
  And I enter "user123"
  Then I should be on dashboard
```

### ✅ Using Scenario Outline
```gherkin
Scenario Outline: Login with different credentials
  Given I am on login page
  When I enter "<email>"
  And I enter "<password>"
  Then I should be on dashboard

  Examples:
    | email           | password |
    | admin@test.com  | admin123 |
    | user@test.com   | user123  |
```

---

## 7. Meaningful Names

### ✅ Good Scenario Names
- "User can login with valid credentials"
- "System rejects login with wrong password"
- "Payment is processed successfully"
- "Inventory updates after purchase"

### ❌ Bad Scenario Names
- "Test 1"
- "Login test"
- "Scenario"
- "Check stuff"

---

## Common Pitfalls and Solutions

### Pitfall 1: Too Many Assertions
```gherkin
# ❌ BAD - Multiple unrelated assertions
Scenario: User registration
  When I submit registration form
  Then user should be created
  And email should be sent
  And inventory should update
  And analytics should track event
  And preferences should be initialized

# ✅ GOOD - Focus on main assertion
Scenario: User registration creates account
  When I submit valid registration form
  Then my account should be created

Scenario: Welcome email sent on registration
  When I register new account
  Then I should receive welcome email
```

### Pitfall 2: Ambiguous Steps
```gherkin
# ❌ BAD - What is "it"?
Scenario: Process order
  When I do it
  Then it should work

# ✅ GOOD - Specific action and assertion
Scenario: Process payment for order
  When I submit payment details
  Then my order should be confirmed
```

### Pitfall 3: Hardcoded Values
```gherkin
# ❌ BAD - Hardcoded
Scenario: Check discount
  When I apply "SAVE10"
  And item price is "100"
  Then final price should be "90"

# ✅ GOOD - Parameterized
Scenario Outline: Apply discount codes
  When I apply "<discount_code>"
  And item price is "<price>"
  Then final price should be "<expected_price>"

  Examples:
    | discount_code | price | expected_price |
    | SAVE10        | 100   | 90             |
    | SAVE20        | 100   | 80             |
```

---

## 8. Maintenance Guidelines

### Regular Review
- Review scenarios quarterly
- Remove outdated scenarios
- Update changed terminology
- Consolidate redundant scenarios

### Version Control
```bash
git log features/
git diff features/login.feature
```

### Documentation
```gherkin
Feature: Payment Processing
  # This feature handles all payment-related operations
  # Last updated: 2026-11-25
  # Owner: QA Team
  
  Scenario: Process credit card payment
    ...
```

---

## 🏋️ Exercises

**Exercise 1**: Improve this poorly written scenario

<details>
<summary>✅ Answer</summary>

```gherkin
# BEFORE (Poor):
Scenario: Test stuff
  Given something
  When I click button
  Then result happens

# AFTER (Improved):
Scenario: User can submit feedback form
  Given I am on the feedback page
  When I enter my feedback
  And I click the submit button
  Then my feedback should be recorded
  And I should see confirmation message
```

</details>

**Exercise 2**: Create consistent, reusable scenarios

<details>
<summary>✅ Answer</summary>

```gherkin
Feature: Search Functionality

Background:
  Given the product database is initialized

Scenario Outline: Search for products
  When I search for "<product>"
  Then I should see results for "<product>"
  And results should be relevant

  Examples: Popular products
    | product |
    | laptop  |
    | mouse   |
    | keyboard|

  Examples: Electronics
    | product |
    | monitor |
    | printer |
```

</details>

---

## 🎤 Interview Questions

1. **What makes good Gherkin?**
   <details>
   <summary>Answer</summary>
   Clear business language, single responsibility, meaningful names, no implementation details, easy to understand
   </details>

2. **What are common Gherkin mistakes?**
   <details>
   <summary>Answer</summary>
   Vague language, testing implementation, too many assertions, hardcoded values, inconsistent terminology
   </details>

3. **Why avoid testing implementation?**
   <details>
   <summary>Answer</summary>
   Implementation details change frequently; focus on business behavior so scenarios remain stable and readable
   </details>

4. **How do you keep scenarios maintainable?**
   <details>
   <summary>Answer</summary>
   Use Scenario Outlines for similar cases, consistent terminology, single responsibility, regular review and cleanup
   </details>

5. **What is the goal of Gherkin?**
   <details>
   <summary>Answer</summary>
   Bridge communication between business and technical teams through executable documentation
   </details>
