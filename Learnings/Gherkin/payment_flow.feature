Feature: Payment Flow
  As a customer
  I want to complete a secure payment
  So that I can purchase items

  Background:
    Given I am logged in
    And I have items in my cart worth "$500.00"
    And the payment gateway is configured

  @smoke
  @critical
  Scenario: Successful payment with credit card
    Given I am on the checkout page
    When I enter payment method as "Credit Card"
    And I enter card number "4532015112830366"
    And I enter expiry date "12/25"
    And I enter CVV "123"
    And I enter cardholder name "John Doe"
    And I click the pay button
    Then payment should be processed
    And I should see "Payment successful"
    And order should be created

  @smoke
  Scenario: Successful payment with debit card
    Given I am on the checkout page
    When I enter payment method as "Debit Card"
    And I enter card number "5425233010103442"
    And I enter expiry date "11/24"
    And I enter CVV "456"
    And I click the pay button
    Then payment should be processed
    And I should receive order confirmation

  @regression
  Scenario: Payment fails with invalid card
    Given I am on the checkout page
    When I enter card number "1234567890123456"
    And I enter expiry date "12/25"
    And I enter CVV "123"
    And I click the pay button
    Then payment should fail
    And I should see error "Invalid card number"

  @regression
  Scenario: Payment fails with expired card
    Given I am on the checkout page
    When I enter card number "4532015112830366"
    And I enter expiry date "12/20"
    And I enter CVV "123"
    And I click the pay button
    Then payment should fail
    And I should see error "Card has expired"

  @regression
  Scenario: Payment fails with insufficient funds
    Given I am on the checkout page
    When I enter valid card number
    And the card has insufficient funds
    And I click the pay button
    Then payment should fail
    And I should see error "Insufficient funds"

  @regression
  Scenario: Billing address validation
    Given I am on the checkout page
    When I enter payment details
    And I leave street address empty
    And I click the pay button
    Then I should see validation error "Street address is required"

  Scenario Outline: Payment with different payment methods
    Given I am on the checkout page
    When I select payment method "<method>"
    And I enter valid details for "<method>"
    And I click the pay button
    Then payment should be "<result>"

    Examples: Successful payments
      | method       | result      |
      | Credit Card  | successful  |
      | Debit Card   | successful  |
      | PayPal       | successful  |

  @security
  Scenario: Payment data is encrypted
    Given I am on the checkout page
    When I enter payment details
    Then payment form should be over HTTPS
    And payment data should be encrypted

  @regression
  Scenario: Duplicate payment prevention
    Given I have completed a payment
    When I click the pay button again
    Then only one payment should be processed
    And I should see "Payment already processed"

  Scenario: Payment receipt generation
    Given I have completed a successful payment
    When I view the order confirmation
    Then I should see payment receipt
    And receipt should contain transaction ID
    And receipt should contain order items
    And receipt should contain total amount
