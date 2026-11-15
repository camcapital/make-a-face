// @vitest-environment happy-dom
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { access, readFile } from 'node:fs/promises';
import { expect } from 'vitest';

const feature = await loadFeature('features/branding.feature');

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const PRODUCTION_ORIGIN = 'https://makeaface.camcap.dev';

const ogProperty = (doc: Document, property: string) =>
  doc
    .querySelector(`meta[property="${property}"]`)
    ?.getAttribute('content');

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
      expect(ogProperty(doc, 'og:title')).toBe('Make A Face');
    });
    And('the "og:site_name" property is "Make A Face"', () => {
      expect(ogProperty(doc, 'og:site_name')).toBe('Make A Face');
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

  Scenario('Shared links preview the Make A Face icon', ({ Given, Then, And }) => {
    let doc: Document;

    Given("the editor's index.html", async () => {
      doc = await readIndexHtml();
    });
    Then(
      'the "og:image" property is "https://makeaface.camcap.dev/favicon.png"',
      () => {
        expect(ogProperty(doc, 'og:image')).toBe(
          `${PRODUCTION_ORIGIN}/favicon.png`,
        );
      },
    );
    And('the "og:image:type" property is "image/png"', () => {
      expect(ogProperty(doc, 'og:image:type')).toBe('image/png');
    });
    And(
      'the "og:image:width" and "og:image:height" match the icon\'s size',
      async () => {
        // A PNG's IHDR chunk holds its width and height at bytes 16 and 20.
        const png = await readFile('public/favicon.png');
        expect(ogProperty(doc, 'og:image:width')).toBe(
          String(png.readUInt32BE(16)),
        );
        expect(ogProperty(doc, 'og:image:height')).toBe(
          String(png.readUInt32BE(20)),
        );
      },
    );
  });
});
