Feature: Product Search
  As a customer
  I want to search for products
  So that I can find items I want to purchase

  Background:
    Given the product database contains 1000 products
    And the search engine is indexed
    And the following products exist:
      | name              | category    | price | rating |
      | MacBook Pro 16"   | Computers   | 2499  | 4.8    |
      | Dell XPS 15       | Computers   | 1899  | 4.7    |
      | iPad Pro          | Tablets     | 1099  | 4.9    |
      | Samsung Galaxy S24| Phones      | 999   | 4.6    |

  @smoke
  Scenario: Basic product search
    Given I am on the search page
    When I enter "laptop" in the search box
    And I press enter
    Then search results should display matching products
    And results should be relevant to "laptop"
    And product count should be displayed

  @smoke
  Scenario: Search with no results
    Given I am on the search page
    When I search for "nonexistent_product_xyz"
    Then I should see "No results found"
    And I should see "Did you mean?" suggestions

  @regression
  Scenario: Search is case insensitive
    Given I am on the search page
    When I search for "LAPTOP"
    And I search for "laptop"
    And I search for "LaPtOp"
    Then all searches should return the same results

  @regression
  Scenario: Search filters by category
    Given I have search results for "laptop"
    When I filter by category "Computers"
    Then all results should be in "Computers" category
    And unrelated categories should be hidden

  Scenario Outline: Search with different filters
    Given I am on the search page
    When I search for "<query>"
    And I apply filter "<filter>" with value "<value>"
    Then results should be filtered by "<filter>"
    And results should match "<expected_count>" items

    Examples: Search with filters
      | query | filter  | value  | expected_count |
      | phone | brand   | Apple  | 5              |
      | phone | price   | <500   | 12             |
      | phone | rating  | 4+     | 8              |
      | laptop| category| Gaming | 15             |

  @regression
  Scenario: Search autocomplete
    Given I am on the search page
    When I type "macb" in the search box
    Then autocomplete suggestions should appear
    And suggestions should include "MacBook Pro"
    And suggestions should include "MacBook Air"

  @regression
  Scenario: Search with special characters
    Given I am on the search page
    When I search for "laptop & tablet"
    Then search should handle special characters correctly
    And results should be relevant

  @performance
  Scenario: Search performance
    Given I am on the search page
    When I search for a popular term like "phone"
    Then results should load within 2 seconds
    And all results should be displayed

  @regression
  Scenario: Sort search results
    Given I have search results for "laptop"
    When I sort by "Price: Low to High"
    Then products should be sorted by price ascending
    And first result should be cheapest
    And last result should be most expensive

  Scenario: Search history
    Given I am logged in
    When I search for "laptop"
    And I search for "phone"
    And I search for "tablet"
    Then my search history should contain all three searches
    And I should be able to see recent searches
    And I should be able to clear history

  @regression
  Scenario: Advanced search
    Given I am on the advanced search page
    When I enter:
      | field       | value          |
      | Product     | laptop         |
      | Category    | Computers      |
      | Price Range | 1000 - 2500    |
      | Rating      | 4 stars & up   |
      | Availability| In Stock       |
    And I click search
    Then results should match all criteria
    And all results should be available for purchase

  Scenario: Search relevance ranking
    Given I search for "apple"
    When results are displayed
    Then "Apple iPhone" should rank higher than "Apple Pie (gadget)"
    And exact matches should appear first
    And relevant results should be ordered by relevance score
