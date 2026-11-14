Feature: The editor does not report visitors to DiceBear
  Upstream's page loads DiceBear's own analytics and cookie-consent config,
  keyed to their site. Our copy must not send our visitors to them.

  Scenario: The page loads no third-party scripts
    Given the editor's index.html
    Then it loads no script from another origin

  Scenario: The page has no DiceBear analytics or consent config
    Given the editor's index.html
    Then it does not mention "u.dicebear.com"
    And it does not configure iubenda
