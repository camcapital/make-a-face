import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';

const feature = await loadFeature('features/no-tracking.feature');

const readIndexHtml = () => readFile('index.html', 'utf8');

describeFeature(feature, ({ Scenario }) => {
  Scenario('The page loads no third-party scripts', ({ Given, Then }) => {
    let html = '';

    Given("the editor's index.html", async () => {
      html = await readIndexHtml();
    });
    Then('it loads no script from another origin', () => {
      const sources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]*)"/g)].map(
        ([, src]) => src,
      );
      expect(sources.filter((src) => /^(https?:)?\/\//.test(src))).toEqual([]);
    });
  });

  Scenario(
    'The page has no DiceBear analytics or consent config',
    ({ Given, Then, And }) => {
      let html = '';

      Given("the editor's index.html", async () => {
        html = await readIndexHtml();
      });
      Then('it does not mention "u.dicebear.com"', () => {
        expect(html).not.toContain('u.dicebear.com');
      });
      And('it does not configure iubenda', () => {
        expect(html).not.toContain('_iub');
      });
    },
  );
});
