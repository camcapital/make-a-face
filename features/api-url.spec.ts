import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import availableStyles from '@/config/styles';
import getRandomOptions from '@/utils/getRandomOptions';

const feature = await loadFeature('features/api-url.feature');

type GetApiUrl = typeof import('@/utils/getApiUrl').default;

// getApiUrl reads its env vars once, at import, so each scenario imports a
// fresh copy with the env it describes. Every step is its own vitest test, so
// the env is stubbed and the module imported within the same Given step.
async function loadGetApiUrl(apiUrl: string, apiVersion: string) {
  vi.stubEnv('VITE_API_URL', apiUrl);
  vi.stubEnv('VITE_API_VERSION', apiVersion);
  vi.resetModules();
  try {
    return (await import('@/utils/getApiUrl')).default;
  } finally {
    vi.unstubAllEnvs();
  }
}

function urlFor(getApiUrl: GetApiUrl, styleName: string, format: string) {
  return getApiUrl(
    styleName,
    getRandomOptions(availableStyles[styleName].options),
    format,
  );
}

describeFeature(feature, ({ Scenario }) => {
  Scenario('URLs use our server by default', ({ Given, When, Then }) => {
    let getApiUrl: GetApiUrl;
    let url = '';

    Given('no API URL or version is configured', async () => {
      getApiUrl = await loadGetApiUrl('', '');
    });
    When('I build the svg URL for the "adventurer" style', () => {
      url = urlFor(getApiUrl, 'adventurer', 'svg');
    });
    Then(
      'the URL starts with "https://dice-lab.camcap.co/10.x/adventurer/svg"',
      () => {
        expect(url).toMatch(
          /^https:\/\/dice-lab\.camcap\.co\/10\.x\/adventurer\/svg(\?|$)/,
        );
      },
    );
  });

  Scenario('Downloads use our server by default', ({ Given, When, Then }) => {
    let getApiUrl: GetApiUrl;
    let url = '';

    Given('no API URL or version is configured', async () => {
      getApiUrl = await loadGetApiUrl('', '');
    });
    When('I build the png URL for the "big-smile" style', () => {
      url = urlFor(getApiUrl, 'bigSmile', 'png');
    });
    Then(
      'the URL starts with "https://dice-lab.camcap.co/10.x/big-smile/png"',
      () => {
        expect(url).toMatch(
          /^https:\/\/dice-lab\.camcap\.co\/10\.x\/big-smile\/png(\?|$)/,
        );
      },
    );
  });

  Scenario('Every style uses our server', ({ Given, When, Then }) => {
    let getApiUrl: GetApiUrl;
    let urls: string[] = [];

    Given('no API URL or version is configured', async () => {
      getApiUrl = await loadGetApiUrl('', '');
    });
    When('I build a URL for every style with random options', () => {
      urls = Object.keys(availableStyles).flatMap((name) =>
        ['svg', 'png'].map((format) => urlFor(getApiUrl, name, format)),
      );
    });
    Then('every URL starts with "https://dice-lab.camcap.co/10.x/"', () => {
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) {
        expect(url.startsWith('https://dice-lab.camcap.co/10.x/')).toBe(true);
      }
    });
  });

  Scenario(
    'The API URL and version can be configured',
    ({ Given, When, Then }) => {
      let getApiUrl: GetApiUrl;
      let url = '';

      Given(
        'the API URL is "https://avatars.example.com/" and the version is "9.x"',
        async () => {
          getApiUrl = await loadGetApiUrl(
            'https://avatars.example.com/',
            '9.x',
          );
        },
      );
      When('I build the svg URL for the "adventurer" style', () => {
        url = urlFor(getApiUrl, 'adventurer', 'svg');
      });
      Then(
        'the URL starts with "https://avatars.example.com/9.x/adventurer/svg"',
        () => {
          expect(url).toMatch(
            /^https:\/\/avatars\.example\.com\/9\.x\/adventurer\/svg(\?|$)/,
          );
        },
      );
    },
  );
});
