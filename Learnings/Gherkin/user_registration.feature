Feature: User Registration
  As a new user
  I want to create an account
  So that I can access the application

  @smoke
  @critical
  Scenario: Successful registration with valid data
    Given I am on the registration page
    When I enter first name "John"
    And I enter last name "Doe"
    And I enter email "john.doe@example.com"
    And I enter password "SecurePass123!"
    And I enter password confirmation "SecurePass123!"
    And I accept the terms of service
    And I click the register button
    Then my account should be created
    And I should see "Registration successful"
    And I should receive confirmation email

  @regression
  Scenario: Registration fails with existing email
    Given I am on the registration page
    When I enter first name "Jane"
    And I enter last name "Smith"
    And I enter email "existing@example.com"
    And I enter password "SecurePass123!"
    And I enter password confirmation "SecurePass123!"
    And I click the register button
    Then I should see error "Email already registered"

  @regression
  Scenario: Password confirmation mismatch
    Given I am on the registration page
    When I enter email "new@example.com"
    And I enter password "SecurePass123!"
    And I enter password confirmation "DifferentPass123!"
    And I click the register button
    Then I should see error "Passwords do not match"

  @regression
  Scenario: Weak password validation
    Given I am on the registration page
    When I enter email "user@example.com"
    And I enter password "weak"
    And I enter password confirmation "weak"
    And I click the register button
    Then I should see error "Password must be at least 8 characters"

  @regression
  Scenario: Invalid email format
    Given I am on the registration page
    When I enter email "invalid-email"
    And I enter password "SecurePass123!"
    And I enter password confirmation "SecurePass123!"
    And I click the register button
    Then I should see error "Invalid email format"

  @regression
  Scenario: Terms of service must be accepted
    Given I am on the registration page
    When I fill all fields with valid data
    But I do not accept the terms of service
    And I click the register button
    Then I should see error "You must accept the terms of service"

  Scenario Outline: Validate multiple user registrations
    Given I am on the registration page
    When I enter email "<email>"
    And I enter password "<password>"
    And I enter password confirmation "<password>"
    And I accept the terms of service
    And I click the register button
    Then I should see "<result>"

    Examples: Valid registrations
      | email               | password        | result              |
      | user1@example.com   | SecurePass123!  | Registration successful |
      | user2@example.com   | Str0ng@Pass!    | Registration successful |

    Examples: Invalid registrations
      | email               | password        | result              |
      | user3@example       | WeakPass1       | Invalid email format |
      | user4@example.com   | short           | Password too weak    |
