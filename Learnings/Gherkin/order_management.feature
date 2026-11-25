Feature: Order Management
  As a customer
  I want to manage my orders
  So that I can track purchases and returns

  Background:
    Given I am logged in
    And the order management system is running
    And the following orders exist:
      | order_id | status       | total  | date       |
      | ORD001   | Delivered    | 1299   | 2024-01-15 |
      | ORD002   | Shipped      | 450    | 2024-01-18 |
      | ORD003   | Processing   | 850    | 2024-01-20 |

  @smoke
  Scenario: View order list
    Given I am on the orders page
    When I view my orders
    Then I should see all my orders with details
    And each order should show order ID, date, and total
    And orders should be sorted by date (newest first)

  @smoke
  Scenario: View order details
    Given I have placed order "ORD001"
    When I click on the order
    Then I should see order details:
      | field             | value    |
      | Order ID          | ORD001   |
      | Order Date        | 2024-01-15 |
      | Status            | Delivered |
      | Total             | $1,299.00  |
      | Items             | Laptop, Mouse |
      | Shipping Address  | visible  |
      | Payment Method    | visible  |

  @regression
  Scenario: Track order shipment
    Given I have order "ORD002" with status "Shipped"
    When I click tracking
    Then I should see tracking information
    And tracking status should show current location
    And estimated delivery date should be displayed
    And carrier information should be shown

  @regression
  Scenario: Cancel pending order
    Given I have order "ORD003" with status "Processing"
    When I request to cancel the order
    Then cancellation request should be submitted
    And I should see "Cancellation requested"
    And refund should be initiated

  @regression
  Scenario: Cannot cancel shipped order
    Given I have order "ORD002" with status "Shipped"
    When I try to cancel the order
    Then cancellation should fail
    And I should see "Cannot cancel shipped order"
    And return/exchange options should be shown

  Scenario Outline: Order status transitions
    Given I have order "<order_id>" with status "<current_status>"
    When the order progresses
    Then status should change to "<next_status>"
    And status update should be notified
    And order page should reflect the change

    Examples: Order status flow
      | order_id | current_status | next_status   |
      | ORD001   | Processing     | Shipped       |
      | ORD002   | Shipped        | Delivered     |
      | ORD003   | Pending        | Processing    |

  @regression
  Scenario: Return order item
    Given I have received order "ORD001"
    And it has been delivered for 10 days
    When I request to return "Laptop"
    Then return request should be created
    And return shipping label should be generated
    And return instructions should be provided
    And refund timeline should be shown

  @regression
  Scenario: Exchange order item
    Given I have order "ORD001"
    When I request to exchange "Mouse" for "Keyboard"
    Then exchange request should be submitted
    And I should be charged difference if applicable
    And new tracking number should be provided

  @regression
  Scenario: Order history filtering
    Given I have multiple orders with different statuses
    When I filter orders by status "Delivered"
    Then only delivered orders should be shown
    And other statuses should be hidden

  Scenario: Invoice generation
    Given I have completed order "ORD001"
    When I request invoice
    Then invoice PDF should be generated
    And invoice should contain order details
    And invoice should include itemized list
    And invoice should show payment summary
    And I should be able to download it

  @regression
  Scenario: Reorder previous items
    Given I have delivered order "ORD001"
    When I click "Reorder"
    Then items from "ORD001" should be added to cart
    And quantities should match original order
    And I should proceed to checkout

  Scenario: Order confirmation email
    Given I have placed a new order
    When order is confirmed
    Then I should receive confirmation email
    And email should contain order number
    And email should contain order items
    And email should contain total amount
    And email should contain tracking link once shipped

  @regression
  Scenario: Address changes not allowed for shipped order
    Given I have order "ORD002" with status "Shipped"
    When I try to change delivery address
    Then change should be rejected
    And I should see "Cannot modify shipped order"
    And alternative options should be provided
