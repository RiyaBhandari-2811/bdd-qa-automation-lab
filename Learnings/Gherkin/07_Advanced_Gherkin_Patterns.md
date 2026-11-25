# 07: Advanced Gherkin Patterns

## Complex Scenarios

### Scenario with Extensive Background
```gherkin
Feature: Enterprise Order Management

Background:
  Given the system has the following configurations:
    | setting              | value        |
    | currency             | USD          |
    | tax_rate             | 10%          |
    | shipping_cost        | 10           |
    | minimum_order_amount | 50           |
  And the following products exist:
    | name   | price | stock |
    | Laptop | 1000  | 5     |
    | Mouse  | 25    | 100   |
  And I am logged in as an admin
  And the inventory system is synchronized

Scenario: Process bulk order
  When I place order for 3 laptops
  Then the order should include tax and shipping
  And inventory should be updated
```

---

## Conditional Scenarios

### Using Tags for Conditional Execution
```gherkin
@desktop
Scenario: Desktop-specific feature
  Given I am on desktop browser
  When I interact with desktop UI
  Then desktop-specific elements should work

@mobile
Scenario: Mobile-specific feature
  Given I am on mobile browser
  When I interact with mobile UI
  Then mobile-specific elements should work
```

---

## Parameterized Complex Scenarios

```gherkin
Scenario Outline: Multi-step purchase flow with various scenarios
  Given I am logged in as <user_type>
  And I have items in cart
  When I proceed to checkout as <checkout_method>
  And I apply discount code <discount_code>
  Then final total should be <expected_total>
  And order status should be <status>

  Examples: Standard customers
    | user_type | checkout_method | discount_code | expected_total | status    |
    | regular   | credit_card     | SAVE10        | 109.00         | confirmed |
    | regular   | paypal          | none          | 121.00         | confirmed |

  Examples: VIP customers
    | user_type | checkout_method | discount_code | expected_total | status    |
    | vip       | credit_card     | SAVE25        | 90.75          | confirmed |
    | vip       | bank_transfer   | SAVE25        | 90.75          | confirmed |
```

---

## Nested Data Structures

```gherkin
Scenario: Complex purchase with nested data
  Given I have a cart with these items:
    """
    {
      "items": [
        {
          "product": "Laptop",
          "price": 1000,
          "quantity": 1,
          "tax": "included"
        },
        {
          "product": "Mouse",
          "price": 25,
          "quantity": 3,
          "tax": "excluded"
        }
      ],
      "shipping": "express",
      "coupon": "SAVE20"
    }
    """
  When I process payment
  Then my order total should be calculated correctly
```

---

## Related Scenarios (Information Flow)

```gherkin
Feature: User Account Lifecycle

Scenario 1: User Registration
  Scenario: Register new account
    Given I am on registration page
    When I provide valid information
    Then account should be created

Scenario 2: User Activation (depends on Scenario 1)
  Scenario: Activate account via email
    Given I have created an account
    When I click activation link in email
    Then my account should be active

Scenario 3: User Login (depends on Scenario 2)
  Scenario: Login to activated account
    Given my account is active
    When I login with valid credentials
    Then I should access my dashboard
```

---

## Anti-Patterns to Avoid

### ❌ Over-complicated Scenario
```gherkin
Scenario: Everything in one test
  Given I register, login, add items, process payment, verify order, download invoice, check email, update profile, change password, and logout
  When I do something
  Then everything should work
```

**Better:** Split into focused scenarios

### ❌ Hidden Dependencies
```gherkin
Scenario: First test
  When I create user "alice"
  Then user should exist

Scenario: Second test
  When I login as "alice"  # Depends on first test running first!
  Then I should be logged in
```

**Better:** Use Background to set up preconditions

### ❌ Implementation Details
```gherkin
# ❌ BAD - Implementation focused
Scenario: Technical implementation
  Given database connection is open
  When I execute SQL query
  Then result set should return 5 rows

# ✅ GOOD - Behavior focused
Scenario: Retrieve user list
  When I request the user list
  Then I should see 5 users
```

---

## Performance Considerations

### Slow Scenario Pattern
```gherkin
@slow
@performance
Scenario: System load test
  Given 10000 users are registered
  When all users try to login simultaneously
  Then response time should be under 2 seconds
  And no errors should occur
```

### Optimized Pattern
```gherkin
@smoke
@fast
Scenario: Quick validation
  Given I am on the home page
  When I load the page
  Then page should load in under 2 seconds
```

---

## Maintainability Patterns

### Using Step Definitions Effectively
```gherkin
# ✅ GOOD - Reusable steps
Scenario: Multiple login attempts
  Given I am on the login page
  When I attempt login with <credentials>
  Then I should see <message>

# ✅ GOOD - Helper steps for complex operations
Scenario: Complete purchase
  Given I have <quantity> items in cart
  When I proceed through checkout
  Then order should be <status>
```

---

## 🏋️ Exercises

**Exercise 1**: Identify issues in complex scenario

<details>
<summary>✅ Answer</summary>

```gherkin
# ISSUES:
Scenario: Complex and unclear
  Given I do many things in background
  When I execute multiple operations
  Then everything should work

# PROBLEMS:
# 1. Too vague - unclear what is being tested
# 2. Hidden setup - readers don't understand preconditions
# 3. Multiple assertions - hard to debug failures

# BETTER:
Scenario: Process payment successfully
  Given I have items in cart
  When I proceed to checkout
  And I enter valid payment details
  Then payment should be processed
  And order should be confirmed
  And inventory should be updated
```

</details>

**Exercise 2**: Design complex scenario with data tables

<details>
<summary>✅ Answer</summary>

```gherkin
Scenario: Bulk user creation with roles
  Given I have admin access
  When I create users with these details:
    | username | email               | role       | active |
    | alice    | alice@example.com   | admin      | yes    |
    | bob      | bob@example.com     | editor     | yes    |
    | charlie  | charlie@example.com | viewer     | no     |
  Then all users should be created
  And each user should have correct role
  And inactive users should not be able to login
```

</details>

---

## 🎤 Interview Questions

1. **What are common anti-patterns in Gherkin?**
   <details>
   <summary>Answer</summary>
   Over-complicated scenarios, hidden dependencies, implementation details, lack of focus, too many assertions
   </details>

2. **How do you handle complex test scenarios?**
   <details>
   <summary>Answer</summary>
   Break into smaller focused scenarios, use Background for common setup, leverage step definition reuse
   </details>

3. **What is a scenario with information flow?**
   <details>
   <summary>Answer</summary>
   Multiple scenarios that depend on each other, like registration → activation → login (use with caution)
   </details>

4. **How do you optimize slow scenarios?**
   <details>
   <summary>Answer</summary>
   Tag with @slow, run separately in CI, use test data optimization, consider API setup instead of UI
   </details>

5. **When should scenarios use nested data?**
   <details>
   <summary>Answer</summary>
   When complex JSON/structured data needs to be passed, like configuration or multi-level order details
   </details>
