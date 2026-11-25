# 03: Feature Files Structure

## Feature File Basics

A feature file is a `.feature` file that contains feature descriptions and scenarios written in Gherkin language.

### File Naming Convention
```
feature_name.feature
Examples:
- login.feature
- shopping_cart.feature
- payment_processing.feature
- user_registration.feature
```

---

## Anatomy of a Feature File

```gherkin
# File: login.feature

# 1. Feature header
Feature: User Login
  
  # 2. Narrative (optional but recommended)
  As a registered user
  I want to log in to my account
  So that I can access my personal data

  # 3. Description (optional)
  Users can authenticate using email and password.
  Failed login attempts are logged for security.

  # 4. Background (optional, shared setup)
  Background:
    Given the application is running
    And the login page is accessible

  # 5. Scenario 1
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email and password
    And I click the login button
    Then I should be redirected to dashboard

  # 6. Scenario 2
  Scenario: Failed login with invalid password
    Given I am on the login page
    When I enter valid email and invalid password
    And I click the login button
    Then I should see an error message
    And I should remain on login page
```

---

## Component Details

### 1. Feature Header
```gherkin
Feature: User Login
```
- Describes the high-level functionality
- Usually one per file
- Should be specific and descriptive

### 2. Narrative (User Story Format)
```gherkin
As a registered user
I want to log in to my account
So that I can access my personal data
```

**Purpose:**
- Provides context
- Explains who, what, why
- Helps understand business value

### 3. Feature Description
```gherkin
Feature: User Login
  Users can authenticate using email and password.
  Accounts are locked after 5 failed attempts.
  Multi-factor authentication is optional.
```

---

## Scenario Structure

### Simple Scenario
```gherkin
Scenario: Successful purchase
  Given I have items in my cart
  When I proceed to checkout
  Then my order should be confirmed
```

### Detailed Scenario with Multiple Steps
```gherkin
Scenario: Complete user registration
  Given I am on the registration page
  When I enter valid personal information
  And I accept the terms of service
  And I submit the form
  Then my account should be created
  And I should receive confirmation email
  And I should be redirected to dashboard
```

### Scenario with Data Tables
```gherkin
Scenario: Verify user permissions
  Given the following users exist:
    | username | role       | can_edit |
    | alice    | admin      | yes      |
    | bob      | editor     | yes      |
    | charlie  | viewer     | no       |
  When I check permissions
  Then all users should have correct access levels
```

---

## Organization Best Practices

### Single Responsibility
One feature file = One feature

```gherkin
# ✅ GOOD - Focused feature
Feature: User Login
  
# ❌ BAD - Multiple unrelated features
Feature: User Login and Payment Processing
```

### Meaningful Scenario Names
```gherkin
# ✅ GOOD - Clear and specific
Scenario: User cannot login with expired password

# ❌ BAD - Vague
Scenario: Password test
```

### Group Related Scenarios
```gherkin
Feature: Shopping Cart

  # Group: Adding items
  Scenario: Add single item to cart
    ...
  
  Scenario: Add multiple items to cart
    ...

  # Group: Removing items
  Scenario: Remove item from cart
    ...
  
  Scenario: Clear entire cart
    ...
```

---

## Feature File Examples

### Example 1: Simple Feature
```gherkin
Feature: Search Functionality
  Users should be able to search for products

  Scenario: Search for existing product
    Given I am on the product page
    When I search for "laptop"
    Then I should see laptop in results

  Scenario: Empty search shows all products
    Given I am on the product page
    When I search for ""
    Then all products should be displayed
```

### Example 2: Complex Feature
```gherkin
Feature: Order Management
  As a customer
  I want to manage my orders
  So that I can track and modify purchases

  Background:
    Given I am logged in
    And I have previous orders

  Scenario: View order history
    When I navigate to order history
    Then all my orders should be listed
    And orders should be sorted by date

  Scenario: Track order status
    When I select an order
    Then I should see detailed order information
    And I should see current shipping status

  Scenario: Cancel unshipped order
    Given I have an order that hasn't shipped
    When I request cancellation
    Then the order should be cancelled
    And I should receive refund
```

---

## File Organization in Projects

### Structure
```
features/
├── auth/
│   ├── login.feature
│   ├── registration.feature
│   └── password_reset.feature
├── shopping/
│   ├── browse_products.feature
│   ├── shopping_cart.feature
│   └── checkout.feature
├── account/
│   ├── profile.feature
│   ├── settings.feature
│   └── payment_methods.feature
└── admin/
    ├── user_management.feature
    ├── reports.feature
    └── content_management.feature
```

### By Domain
Organize features by business domain rather than by page or layer.

---

## 🏋️ Exercises

**Exercise 1**: Create a feature file structure for an e-commerce site

<details>
<summary>✅ Answer</summary>

```gherkin
# File: features/catalog/product_browsing.feature

Feature: Product Browsing
  As a customer
  I want to browse products
  So that I can find items to purchase

  Background:
    Given the product catalog is available
    And the following products exist:
      | name   | price | category |
      | Laptop | 999   | Electronics |
      | Mouse  | 25    | Electronics |
      | Desk   | 199   | Furniture |

  Scenario: View all products
    When I navigate to the catalog
    Then all products should be displayed

  Scenario: Filter products by category
    When I filter by "Electronics"
    Then only electronics should be shown
```

</details>

**Exercise 2**: Identify issues in this feature file

<details>
<summary>✅ Answer</summary>

```gherkin
# ISSUES with this file:

Feature: Everything
  Users can login, pay, and manage accounts  ← ISSUE: Too many features
  
  Scenario: Login and Pay
    Given I have an account                  ← Unclear precondition
    When I do something                      ← Vague action
    Then something happens                   ← Vague assertion

# BETTER VERSION:

Feature: User Login
  Users can authenticate with their credentials

  Scenario: Successful login with valid email and password
    Given I am on the login page
    When I enter "user@example.com"
    And I enter "password123"
    And I click the login button
    Then I should be redirected to dashboard
```

</details>

---

## 🎤 Interview Questions

1. **What is a feature file?**
   <details>
   <summary>Answer</summary>
   A .feature file containing Gherkin scenarios that describe software behavior in human-readable format
   </details>

2. **What should each feature file contain?**
   <details>
   <summary>Answer</summary>
   One feature with related scenarios, narrative (user story), and clear acceptance criteria
   </details>

3. **What is the narrative section for?**
   <details>
   <summary>Answer</summary>
   It provides context using "As a..., I want..., So that..." format to explain user value and motivation
   </details>

4. **How should feature files be organized?**
   <details>
   <summary>Answer</summary>
   Organize by business domain/feature area, not by technical layer. Each folder represents a feature area
   </details>

5. **What makes a good feature file?**
   <details>
   <summary>Answer</summary>
   Single responsibility, clear scenarios, specific step names, organized narratives, and meaningful test data
   </details>
