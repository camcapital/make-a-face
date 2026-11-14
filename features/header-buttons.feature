Feature: The buttons at the top of the editor
  The three buttons above the preview are the editor's main actions. Two of
  them show only an icon, so each button names itself to screen readers and
  shows a tooltip on hover.

  Scenario: The download button says what it does
    Given the editor header
    Then the download button reads "Download"

  Scenario Outline: Each button has an accessible name and title
    Given the editor header
    Then the <button> button is named "<name>"
    And the <button> button has the title "<name>"

    Examples:
      | button     | name       |
      | random     | Random     |
      | fullscreen | Fullscreen |
      | download   | Download   |
