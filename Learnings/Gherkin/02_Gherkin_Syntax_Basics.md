# 02: Gherkin Syntax Basics

## Gherkin Keywords

Gherkin has specific keywords that structure scenarios. These keywords are consistent across all languages.

---

## Main Keywords

### Feature
Describes a software feature or capability.

```gherkin
Feature: User Login
  Provides access control to the application
```

### Scenario
Describes a specific situation or test case.

```gherkin
Scenario: Successful login
  ...steps...
```

### Given (Precondition)
Sets up the initial state/context before the action.

```gherkin
Given I am on the login page
Given the user has an active account
Given I have 3 items in my cart
```

### When (Action)
Describes the user action or event that triggers behavior.

```gherkin
When I click the login button
When I submit the form
When the system processes the payment
```

### Then (Assertion)
Verifies the expected outcome/result.

```gherkin
Then I should see the dashboard
Then an error message should appear
Then the order should be confirmed
```

### And / But
Used to add additional steps without repeating Given/When/Then.

```gherkin
Given I am logged in
And I have an active subscription
When I click the upgrade button
And I select the premium plan
Then my account should be upgraded
And I should see a confirmation email
But I should not be charged again
```

---

## Step Types and Examples

### Given Steps (Setup/Context)
```gherkin
Given I am on the home page
Given the user has 5 notifications
Given a product exists in inventory
Given the system time is 9:00 AM
```

### When Steps (Action)
```gherkin
When I click the search button
When I enter "laptop" in the search box
When I select the first result
When I add the item to cart
When 5 minutes pass
```

### Then Steps (Verification)
```gherkin
Then I should see search results
Then the product page should load
Then the item count should be 1
Then I should see a success message
```

### And / But Steps
```gherkin
Given I am logged in
And I have an active subscription
When I attempt to cancel
Then my cancellation should be processed
But I should still have access until end of month
And I should receive a confirmation
```

---

## Comments

Comments start with `#` and are ignored during execution.

```gherkin
# This is a comment
Feature: Shopping Cart
  # Feature description comment
  
  Scenario: Add item to cart
    # Setup
    Given I am on the product page  # Inline comment
    When I click add to cart
    Then the item should be in cart
```

---

## Multi-line Strings

Use triple quotes for multi-line text (useful for forms, emails, etc.):

```gherkin
Scenario: Submit feedback
  Given I am on the feedback form
  When I enter the following feedback:
    """
    The application is great but needs better
    error messages when forms fail validation.
    Please improve this in the next release.
    """
  And I click submit
  Then my feedback should be recorded
```

---

## Data Tables

Use tables to organize related data:

```gherkin
Scenario: Verify user roles
  Given the following users exist:
    | name    | email              | role      |
    | Alice   | alice@example.com  | Admin     |
    | Bob     | bob@example.com    | User      |
    | Charlie | charlie@example.com| Moderator |
  When I view the users list
  Then all users should be displayed
```

---

## Background

Use Background to avoid repeating Given steps across scenarios:

```gherkin
Feature: Shopping Cart
  
  Background:
    Given I am logged in
    And I am on the shopping page
    And the following products are available:
      | Product | Price |
      | Laptop  | 999   |
      | Mouse   | 25    |

  Scenario: Add product to cart
    When I add "Laptop" to cart
    Then cart should contain 1 item

  Scenario: Add multiple products
    When I add "Laptop" to cart
    And I add "Mouse" to cart
    Then cart should contain 2 items
```

---

## Best Practices

### ✅ DO

```gherkin
Scenario: User can login with valid credentials
  Given I am on the login page
  When I enter valid email and password
  And I click the login button
  Then I should be redirected to dashboard
```

### ❌ DON'T

```gherkin
Scenario: Login
  Given I do something
  When I do another thing
  Then something happens
```

---

## Real-World Example

```gherkin
Feature: Order Processing
  As a customer
  I want to place and confirm orders
  So that I can receive my purchases

  Background:
    Given I am logged in
    And I have items in my cart

  Scenario: Place order with valid payment
    When I proceed to checkout
    And I enter valid payment details
    And I confirm the order
    Then my order should be confirmed
    And I should receive confirmation email
    And inventory should be updated

  Scenario: Order rejected with invalid payment
    When I proceed to checkout
    And I enter invalid payment details
    But the payment is declined
    Then my order should not be created
    And I should see error message
```

---

## 🏋️ Exercises

**Exercise 1**: Identify the keywords in this scenario

<details>
<summary>✅ Answer</summary>

```gherkin
Scenario: Successful purchase           ← Scenario keyword
  Given I am on the product page        ← Given keyword (setup)
  When I click buy now                  ← When keyword (action)
  And I enter payment details           ← And keyword (additional action)
  Then my order should be confirmed     ← Then keyword (assertion)
  And I should see confirmation email   ← And keyword (additional assertion)
```

</details>

**Exercise 2**: Write a scenario using Background to avoid repetition

<details>
<summary>✅ Answer</summary>

```gherkin
Feature: User Account Management

Background:
  Given I am logged in
  And I am on my profile page

Scenario: Update email address
  When I change my email to "newemail@test.com"
  And I save changes
  Then my new email should be saved

Scenario: Change password
  When I click change password
  And I enter new password
  Then my password should be updated
```

</details>

---

## 🎤 Interview Questions

1. **What is the purpose of Given, When, Then?**
   <details>
   <summary>Answer</summary>
   Given sets preconditions, When describes action, Then verifies result. This follows the AAA pattern (Arrange, Act, Assert)
   </details>

2. **What is the difference between And and But?**
   <details>
   <summary>Answer</summary>
   Both allow adding steps without repeating Given/When/Then. But implies negation/exception while And is additive
   </details>

3. **What are data tables used for?**
   <details>
   <summary>Answer</summary>
   Organizing related test data in readable format, useful for multiple inputs or database-like data
   </details>

4. **Why use Background?**
   <details>
   <summary>Answer</summary>
   Avoids repeating common Given steps across multiple scenarios, makes features more readable and maintainable
   </details>

5. **What is a multi-line string in Gherkin?**
   <details>
   <summary>Answer</summary>
   Text wrapped in triple quotes (""") used for long text inputs like emails, feedback, JSON data
   </details>
