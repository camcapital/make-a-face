Feature: Shared links show Make A Face, not DiceBear
  A link to the editor unfurls with the page's title and favicon. Upstream's
  "Editor | DiceBear" title and DiceBear favicon made the preview look like
  DiceBear's own site.

  Scenario: The page is titled Make A Face
    Given the editor's index.html
    Then the page title is "Make A Face"
    And the "og:title" property is "Make A Face"
    And the "og:site_name" property is "Make A Face"

  Scenario: The favicon is the Make A Face icon
    Given the editor's index.html
    Then the favicon is the PNG "/favicon.png"
    And the DiceBear "favicon.ico" is gone

  Scenario: Shared links preview the Make A Face icon
    Given the editor's index.html
    Then the "og:image" property is "https://makeaface.camcap.dev/favicon.png"
    And the "og:image:type" property is "image/png"
    And the "og:image:width" and "og:image:height" match the icon's size
