Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my account

  Background:
    Given the application is running
    And the login page is accessible

  @smoke
  @critical
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email "user@example.com"
    And I enter valid password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Welcome"

  @regression
  Scenario: Login fails with wrong password
    Given I am on the login page
    When I enter email "user@example.com"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see error message "Invalid credentials"
    And I should remain on the login page

  @regression
  Scenario: Login fails with non-existent email
    Given I am on the login page
    When I enter email "nonexistent@example.com"
    And I enter password "password123"
    And I click the login button
    Then I should see error message "User not found"

  @regression
  Scenario: Empty email field validation
    Given I am on the login page
    When I leave email field empty
    And I enter password "password123"
    And I click the login button
    Then I should see validation error "Email is required"

  @regression
  Scenario: Empty password field validation
    Given I am on the login page
    When I enter email "user@example.com"
    And I leave password field empty
    And I click the login button
    Then I should see validation error "Password is required"

  @accessibility
  Scenario: Login form is keyboard accessible
    Given I am on the login page
    When I tab through form fields
    Then all fields should be reachable via keyboard
    And submit button should be focusable
