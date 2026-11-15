// @vitest-environment happy-dom
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { access, readFile } from 'node:fs/promises';
import { expect } from 'vitest';

const feature = await loadFeature('features/branding.feature');

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const readIndexHtml = async () =>
  new DOMParser().parseFromString(
    await readFile('index.html', 'utf8'),
    'text/html',
  );

describeFeature(feature, ({ Scenario }) => {
  Scenario('The page is titled Make A Face', ({ Given, Then, And }) => {
    let doc: Document;

    Given("the editor's index.html", async () => {
      doc = await readIndexHtml();
    });
    Then('the page title is "Make A Face"', () => {
      expect(doc.title).toBe('Make A Face');
    });
    And('the "og:title" property is "Make A Face"', () => {
      expect(
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ).toBe('Make A Face');
    });
    And('the "og:site_name" property is "Make A Face"', () => {
      expect(
        doc
          .querySelector('meta[property="og:site_name"]')
          ?.getAttribute('content'),
      ).toBe('Make A Face');
    });
  });

  Scenario('The favicon is the Make A Face icon', ({ Given, Then, And }) => {
    let doc: Document;

    Given("the editor's index.html", async () => {
      doc = await readIndexHtml();
    });
    Then('the favicon is the PNG "/favicon.png"', async () => {
      const icon = doc.querySelector('link[rel="icon"]');
      expect(icon?.getAttribute('href')).toBe('/favicon.png');
      expect(icon?.getAttribute('type')).toBe('image/png');

      const png = await readFile('public/favicon.png');
      expect([...png.subarray(0, 8)]).toEqual(PNG_SIGNATURE);
    });
    And('the DiceBear "favicon.ico" is gone', async () => {
      await expect(access('public/favicon.ico')).rejects.toThrow();
    });
  });
});
