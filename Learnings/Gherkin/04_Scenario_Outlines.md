# 04: Scenario Outlines

## What are Scenario Outlines?

Scenario Outlines allow you to run the same scenario multiple times with different test data. This is the **data-driven testing** approach in Gherkin.

---

## Basic Syntax

```gherkin
Scenario Outline: Descriptive name
  Given <placeholder>
  When <placeholder>
  Then <placeholder>

  Examples:
    | placeholder1 | placeholder2 |
    | value1       | value2       |
    | value3       | value4       |
```

---

## Real-World Example

### Without Scenario Outline (Repetitive)
```gherkin
Scenario: Login with alice
  Given I am on the login page
  When I enter "alice@test.com"
  And I enter "password123"
  And I click login
  Then I should see "Welcome Alice"

Scenario: Login with bob
  Given I am on the login page
  When I enter "bob@test.com"
  And I enter "password456"
  And I click login
  Then I should see "Welcome Bob"

Scenario: Login with charlie
  Given I am on the login page
  When I enter "charlie@test.com"
  And I enter "password789"
  And I click login
  Then I should see "Welcome Charlie"
```

### With Scenario Outline (DRY)
```gherkin
Scenario Outline: User login with valid credentials
  Given I am on the login page
  When I enter "<email>"
  And I enter "<password>"
  And I click login
  Then I should see "Welcome <name>"

  Examples:
    | email               | password   | name    |
    | alice@test.com      | password123| Alice   |
    | bob@test.com        | password456| Bob     |
    | charlie@test.com    | password789| Charlie |
```

---

## Multiple Example Sets

You can have multiple `Examples:` blocks:

```gherkin
Scenario Outline: Discount calculation
  Given a product costs <price>
  When applying <discount>% discount
  Then final price should be <final>

  Examples: Percentage discounts
    | price | discount | final |
    | 100   | 10       | 90    |
    | 200   | 20       | 160   |

  Examples: Seasonal discounts
    | price | discount | final |
    | 100   | 25       | 75    |
    | 200   | 30       | 140   |
```

---

## Parameterization Types

### 1. Simple Values
```gherkin
Scenario Outline: Currency conversion
  When I convert <amount> <from_currency> to <to_currency>
  Then I should see the converted amount

  Examples:
    | amount | from_currency | to_currency |
    | 100    | USD          | EUR        |
    | 50     | GBP          | JPY        |
```

### 2. Boolean Values
```gherkin
Scenario Outline: Feature access based on subscription
  Given I have <subscription> subscription
  When I try to access premium feature
  Then access should be <allowed>

  Examples:
    | subscription | allowed |
    | premium      | yes     |
    | basic        | no      |
    | trial        | yes     |
```

### 3. Null/Empty Values
```gherkin
Scenario Outline: Form validation
  When I submit form with email "<email>"
  Then validation should be <result>

  Examples:
    | email               | result      |
    | user@example.com    | successful  |
    |                     | failed      |
    | invalid-email       | failed      |
```

---

## Common Pitfalls

### ❌ Too Many Parameters
```gherkin
Scenario Outline: Too complex
  Given user is <age> years old
  And has <income> income
  And has <credit_score> credit score
  And lives in <country>
  When applying for <loan_type> loan
  Then approval should be <result>
```

**Better approach:** Separate into focused scenarios

### ✅ Focused Parameters
```gherkin
Scenario Outline: Loan approval based on income
  When applying for loan with <income>
  Then approval should be <result>

  Examples:
    | income | result   |
    | 50000  | approved |
    | 30000  | pending  |
    | 20000  | denied   |
```

---

## Best Practices

### 1. Keep Examples Focused
```gherkin
# ✅ GOOD - Tests one aspect
Scenario Outline: Search with different queries
  When I search for "<query>"
  Then results should contain "<query>"

  Examples:
    | query  |
    | laptop |
    | mouse  |
    | desk   |

# ❌ BAD - Tests multiple aspects
Scenario Outline: Complex purchase flow
  Given I have <items> items
  When I apply <discount>
  And I use <payment> payment
  Then cost should be <total>
```

### 2. Use Meaningful Headers
```gherkin
# ✅ GOOD - Clear and descriptive
Examples: Valid email addresses
  | email_address       |
  | user@example.com    |
  | name.surname@co.uk  |

# ❌ BAD - Unclear
Examples:
  | email |
  | ...   |
```

### 3. Avoid Hardcoding
```gherkin
# ✅ GOOD - Parametrized
When I apply <discount>% discount

# ❌ BAD - Hardcoded
When I apply 10% discount
Then I apply 20% discount
Then I apply 30% discount
```

---

## 🏋️ Exercises

**Exercise 1**: Convert repetitive scenarios to Scenario Outline

<details>
<summary>✅ Answer</summary>

```gherkin
# BEFORE (Repetitive):
Scenario: Add 1 item to cart
  When I add 1 items to cart
  Then cart total should be 1

Scenario: Add 2 items to cart
  When I add 2 items to cart
  Then cart total should be 2

# AFTER (Using Scenario Outline):
Scenario Outline: Add items to cart
  When I add <quantity> items to cart
  Then cart total should be <quantity>

  Examples:
    | quantity |
    | 1        |
    | 2        |
    | 5        |
    | 10       |
```

</details>

**Exercise 2**: Create a Scenario Outline for user role permissions

<details>
<summary>✅ Answer</summary>

```gherkin
Scenario Outline: User access based on role
  Given I am logged in as <role>
  When I try to access admin panel
  Then access should be <access_level>

  Examples: Different user roles
    | role      | access_level |
    | admin     | allowed      |
    | editor    | denied       |
    | viewer    | denied       |
    | moderator | limited      |
```

</details>

---

## 🎤 Interview Questions

1. **What is a Scenario Outline?**
   <details>
   <summary>Answer</summary>
   Template for running same scenario with multiple data sets, implementing data-driven testing in Gherkin
   </details>

2. **What is the difference between Scenario and Scenario Outline?**
   <details>
   <summary>Answer</summary>
   Scenario runs once, Scenario Outline runs multiple times with different data provided in Examples table
   </details>

3. **How do you parameterize steps?**
   <details>
   <summary>Answer</summary>
   Use angle brackets <parameter_name> in steps, then provide values in Examples table
   </details>

4. **Can you have multiple Examples blocks?**
   <details>
   <summary>Answer</summary>
   Yes, multiple Examples: blocks can be used to organize different test data sets
   </details>

5. **What's the benefit of Scenario Outlines?**
   <details>
   <summary>Answer</summary>
   Reduces code duplication, improves maintainability, easier to add new test cases, keeps scenarios readable
   </details>
