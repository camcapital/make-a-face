Feature: Avatar URLs point at our DiceBear API
  The editor draws avatars in the browser, but the URL it copies and the PNG it
  downloads come from a DiceBear API server. That server is ours, not
  api.dicebear.com, and it only serves the 10.x API.

  Scenario: URLs use our server by default
    Given no API URL or version is configured
    When I build the svg URL for the "adventurer" style
    Then the URL starts with "https://dice-lab.camcap.co/10.x/adventurer/svg"

  Scenario: Downloads use our server by default
    Given no API URL or version is configured
    When I build the png URL for the "big-smile" style
    Then the URL starts with "https://dice-lab.camcap.co/10.x/big-smile/png"

  Scenario: Every style uses our server
    Given no API URL or version is configured
    When I build a URL for every style with random options
    Then every URL starts with "https://dice-lab.camcap.co/10.x/"

  Scenario: The API URL and version can be configured
    Given the API URL is "https://avatars.example.com/" and the version is "9.x"
    When I build the svg URL for the "adventurer" style
    Then the URL starts with "https://avatars.example.com/9.x/adventurer/svg"
