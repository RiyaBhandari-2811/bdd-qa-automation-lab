Feature: Inventory Management
  As an inventory manager
  I want to manage product stock levels
  So that I can track availability

  Background:
    Given I am logged in as an admin
    And the inventory system is initialized
    And the following products exist:
      | sku    | name     | stock | reorder_level |
      | LAP001 | Laptop   | 50    | 10            |
      | MOU002 | Mouse    | 150   | 25            |
      | KEY003 | Keyboard | 80    | 20            |

  @smoke
  Scenario: View current inventory levels
    Given I am on the inventory dashboard
    When I view the inventory list
    Then I should see all products with their stock levels
    And stock counts should be accurate
    And reorder levels should be displayed

  @smoke
  Scenario: Add stock to product
    Given I am viewing "Laptop" inventory
    When I add 25 units to stock
    Then stock quantity should increase to 75
    And stock history should record the addition

  @regression
  Scenario: Reduce stock after purchase
    Given "Keyboard" has 80 units in stock
    When a customer purchases 5 units
    Then stock should decrease to 75
    And inventory log should record the transaction

  @regression
  Scenario: Low stock alert
    Given "Mouse" has 25 units in stock
    And the reorder level is 25 units
    When stock quantity reaches reorder level
    Then I should see "Low stock alert"
    And the product should be highlighted

  @critical
  Scenario: Out of stock handling
    Given "Laptop" is out of stock
    When a customer tries to purchase
    Then purchase should be blocked
    And customer should see "Out of stock"
    And product should show "Not available"

  Scenario Outline: Stock movements
    Given "<product>" has "<initial_stock>" units
    When I perform "<action>" with "<quantity>" units
    Then stock should be "<final_stock>"
    And status should be "<status>"

    Examples: Different stock movements
      | product   | initial_stock | action | quantity | final_stock | status          |
      | Laptop    | 50            | add    | 20       | 70          | In stock        |
      | Mouse     | 150           | reduce | 50       | 100         | In stock        |
      | Keyboard  | 80            | add    | 100      | 180         | In stock        |
      | Laptop    | 10            | reduce | 10       | 0           | Out of stock    |

  @regression
  Scenario: Inventory reconciliation
    Given I have inventory records for all products
    When I perform physical inventory count
    And I compare with system records
    Then discrepancies should be identified
    And I should be able to adjust quantities

  @regression
  Scenario: Stock transfer between warehouses
    Given I have two warehouses
    When I transfer 20 units from "Warehouse A" to "Warehouse B"
    Then "Warehouse A" stock decreases by 20
    And "Warehouse B" stock increases by 20
    And transfer should be logged

  @regression
  Scenario: Bulk import inventory
    Given I have an inventory file with 100 products
    When I upload the inventory file
    Then all products should be imported
    And stock levels should be updated
    And import report should show success

  Scenario: Expiry date tracking
    Given products have expiry dates
    When I view inventory
    Then products nearing expiry should be highlighted
    And I should see days remaining to expiry
    And expired products should be marked as unusable

  @regression
  Scenario: Inventory forecast
    Given I have 6 months of sales data
    When I generate inventory forecast
    Then forecast should predict stock needs
    And recommendations should be provided
    And upcoming reorders should be suggested
