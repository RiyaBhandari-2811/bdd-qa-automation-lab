Feature: Notifications System
  As a user
  I want to receive notifications
  So that I stay informed about important events

  Background:
    Given I am logged in
    And notification system is enabled
    And I have notification preferences set

  @smoke
  Scenario: Receive order confirmation notification
    Given I have placed an order
    When order is confirmed
    Then I should receive notification
    And notification should contain order ID
    And notification should contain order total
    And I should be able to click to view order

  @smoke
  Scenario: Receive order shipment notification
    Given I have order "ORD001"
    When order is shipped
    Then I should receive "Order Shipped" notification
    And notification should include tracking number
    And notification should include carrier name
    And notification should have estimated delivery date

  @regression
  Scenario: Receive order delivery notification
    Given I have order "ORD001" with status "Shipped"
    When order is delivered
    Then I should receive "Order Delivered" notification
    And notification should contain tracking confirmation
    And notification should ask for delivery confirmation
    And notification should offer review option

  @regression
  Scenario: Receive payment failure notification
    Given I attempt to make a payment
    When payment fails
    Then I should receive "Payment Failed" notification
    And notification should state failure reason
    And notification should provide retry option
    And notification should show customer support contact

  @regression
  Scenario: Receive low stock notification
    Given I am an inventory manager
    When product stock falls below reorder level
    Then I should receive low stock alert
    And notification should show product name
    And notification should show current stock level
    And notification should show reorder level
    And I should be able to initiate reorder

  @regression
  Scenario: Receive promotion notification
    Given I am opted in to promotions
    When a promotion matches my preferences
    Then I should receive promotion notification
    And notification should show discount percentage
    And notification should show valid period
    And notification should have link to promotion

  Scenario Outline: Notifications by type
    Given I have enabled notifications for "<type>"
    When "<event>" occurs
    Then I should receive "<notification_type>" notification
    And notification should contain "<content>"

    Examples: Different notification types
      | type        | event           | notification_type | content          |
      | Orders      | Order placed    | Order Confirm     | Order ID         |
      | Orders      | Order shipped   | Order Shipped     | Tracking number  |
      | Payments    | Payment failed  | Payment Failed    | Error reason     |
      | Promotions  | New offer       | Promotion         | Discount details |
      | Inventory   | Low stock       | Low Stock Alert   | Stock level      |

  @regression
  Scenario: Notification preferences management
    Given I am on notification settings
    When I disable "Order Status" notifications
    Then no order status notifications should be sent
    And other notifications should continue
    And preference should be saved

  @regression
  Scenario: Mark notification as read
    Given I have unread notifications
    When I click on a notification
    Then notification should be marked as read
    And it should no longer show as unread
    And notification count should decrease

  @regression
  Scenario: Clear notification history
    Given I have multiple notifications
    When I click "Clear All"
    Then all notifications should be deleted
    And notification list should be empty
    And action should be reversible for 5 minutes

  @regression
  Scenario: Notification retry mechanism
    Given a notification failed to send
    When retry is triggered
    Then notification should be resent
    And retry count should be incremented
    And max 3 retries should be attempted

  Scenario: Notification settings by channel
    Given I am on notification settings
    When I configure notification channels:
      | channel | enabled |
      | Email   | true    |
      | SMS     | true    |
      | Push    | false   |
    Then I should receive notifications via email and SMS only
    And push notifications should be disabled

  @regression
  Scenario: Do Not Disturb mode
    Given I enable "Do Not Disturb" mode
    When notifications are triggered
    Then notifications should be queued
    And I should not receive alerts
    And notification count should show pending notifications
    And When I disable "Do Not Disturb", all queued notifications should be delivered

  @performance
  Scenario: Notification delivery performance
    Given 10000 notifications need to be sent
    When notifications are triggered
    Then 95% should be delivered within 1 minute
    And 99% should be delivered within 5 minutes
    And notification system should not block other operations
