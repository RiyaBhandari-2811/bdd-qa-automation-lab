Feature: Shopping Cart
  As a customer
  I want to manage my shopping cart
  So that I can purchase items

  Background:
    Given I am logged in
    And the following products are available:
      | name       | price | quantity |
      | Laptop     | 999   | 10       |
      | Mouse      | 25    | 50       |
      | Keyboard   | 75    | 30       |
      | Monitor    | 299   | 15       |

  @smoke
  Scenario: Add single item to cart
    Given I am on the products page
    When I add "Laptop" to cart
    Then cart should contain 1 item
    And cart total should be "$999.00"

  @smoke
  Scenario: Add multiple items to cart
    Given I am on the products page
    When I add "Laptop" to cart
    And I add "Mouse" to cart
    And I add "Keyboard" to cart
    Then cart should contain 3 items
    And cart total should be "$1,099.00"

  Scenario Outline: Add items with different quantities
    Given I am on the products page
    When I add "<quantity>" of "<product>" to cart
    Then cart total should be "<total>"

    Examples: Different quantities
      | product   | quantity | total     |
      | Laptop    | 1        | $999.00   |
      | Laptop    | 2        | $1,998.00 |
      | Mouse     | 5        | $125.00   |
      | Keyboard  | 3        | $225.00   |

  @regression
  Scenario: Remove item from cart
    Given I have "Laptop" in my cart
    When I remove "Laptop" from cart
    Then cart should be empty
    And cart total should be "$0.00"

  @regression
  Scenario: Update item quantity in cart
    Given I have "Mouse" in my cart with quantity 1
    When I update quantity to 5
    Then cart should show quantity 5
    And cart total should be "$125.00"

  @regression
  Scenario: Clear entire cart
    Given I have multiple items in my cart
    When I clear the cart
    Then cart should be empty
    And all items should be removed

  @regression
  Scenario: Cart persists on page refresh
    Given I have items in my cart
    When I refresh the page
    Then my cart should still contain the items
    And cart total should remain the same

  @regression
  Scenario: Cannot add out-of-stock item
    Given "Monitor" is out of stock
    When I try to add "Monitor" to cart
    Then I should see message "Item is out of stock"
    And item should not be added to cart

  @regression
  Scenario: Cart updates when product price changes
    Given I have "Laptop" in my cart for "$999.00"
    When the product price changes to "$899.00"
    And I refresh the page
    Then cart total should update to "$899.00"

  Scenario: Cart summary shows discount applied
    Given I have items worth $1,000 in cart
    When I apply discount code "SAVE10"
    Then discount should be shown as "$100.00"
    And cart total should be "$900.00"
