@smoke @notes
Feature: Simple Notes Application
  As a user
  I want to create and manage notes
  So that I can keep track of important information

  @smoke
  Scenario: Create a new note
    Given I am on the Notes app
    When I click "New Note" button
    And I enter title "My First Note"
    And I enter content "This is a test note"
    And I click "Save" button
    Then the note should be saved successfully
    And I should see "My First Note" in notes list

  Scenario: Add multiple notes
    Given I am on the Notes app
    When I create a note with title "Note 1" and content "Content 1"
    And I create a note with title "Note 2" and content "Content 2"
    Then the notes count should be "2"

  Scenario: Delete a note
    Given I am on the Notes app
    And I have a note titled "Temporary Note"
    When I click delete button for "Temporary Note"
    Then the note should be removed
    And the notes list should not contain "Temporary Note"

  Scenario: Edit a note
    Given I am on the Notes app
    And I have a note titled "Original Title"
    When I click on "Original Title" to edit
    And I change title to "Updated Title"
    And I click "Save" button
    Then the note should be updated
    And I should see "Updated Title" in notes list
