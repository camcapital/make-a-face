Feature: Credits sit behind a link below the options
  The credits used to fill a panel under every options tab. They now stay
  folded behind a "Credits" link until someone asks for them.

  Scenario: The credits start hidden
    Given the options footer
    Then I see a "Credits" link
    And the credits are hidden

  Scenario: The Credits link shows and hides the credits
    Given the options footer
    When I click the "Credits" link
    Then the credits are shown
    When I click the "Credits" link again
    Then the credits are hidden again

  Scenario: The credits name Make A Face and the editor it is based on
    Given the options footer
    When I click the "Credits" link
    Then the first line of the credits reads "Make A Face"
    And the next line reads "based on DiceBear Editor - v." and the build version

  Scenario: The credits carry no sponsor advertisement
    Given the options footer
    When I click the "Credits" link
    Then the credits do not mention "CDN Sponsored"
    And the credits do not link to "bunny.net"
