// @vitest-environment happy-dom
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import Footer from '@/components/Footer.vue';
import { mountEditor } from './support/mountEditor';

const feature = await loadFeature('features/credits.feature');

const mountFooter = () =>
  mountEditor(Footer, { props: { tab: 'style' } }).wrapper;

function creditsLink(wrapper: VueWrapper) {
  const link = wrapper
    .findAll('a, button')
    .find((el) => el.text().trim() === 'Credits');
  expect(link, 'a "Credits" link is on the page').toBeDefined();

  return link!;
}

function credits(wrapper: VueWrapper) {
  return wrapper.find('.footer-credits');
}

function expectHidden(wrapper: VueWrapper) {
  const panel = credits(wrapper);
  expect(panel.exists() && panel.isVisible()).toBe(false);
  expect(creditsLink(wrapper).attributes('aria-expanded')).toBe('false');
}

function expectShown(wrapper: VueWrapper) {
  expect(credits(wrapper).isVisible()).toBe(true);
  expect(creditsLink(wrapper).attributes('aria-expanded')).toBe('true');
}

describeFeature(feature, ({ Scenario }) => {
  Scenario('The credits start hidden', ({ Given, Then, And }) => {
    let wrapper: VueWrapper;

    Given('the options footer', () => {
      wrapper = mountFooter();
    });
    Then('I see a "Credits" link', () => {
      expect(creditsLink(wrapper).isVisible()).toBe(true);
    });
    And('the credits are hidden', () => {
      expectHidden(wrapper);
      wrapper.unmount();
    });
  });

  Scenario(
    'The Credits link shows and hides the credits',
    ({ Given, When, Then }) => {
      let wrapper: VueWrapper;

      Given('the options footer', () => {
        wrapper = mountFooter();
      });
      When('I click the "Credits" link', async () => {
        await creditsLink(wrapper).trigger('click');
      });
      Then('the credits are shown', () => {
        expectShown(wrapper);
      });
      When('I click the "Credits" link again', async () => {
        await creditsLink(wrapper).trigger('click');
      });
      Then('the credits are hidden again', () => {
        expectHidden(wrapper);
        wrapper.unmount();
      });
    },
  );

  Scenario(
    'The credits name Make A Face and the editor it is based on',
    ({ Given, When, Then, And }) => {
      let wrapper: VueWrapper;
      let lines: string[] = [];

      Given('the options footer', () => {
        wrapper = mountFooter();
      });
      When('I click the "Credits" link', async () => {
        await creditsLink(wrapper).trigger('click');
        lines = credits(wrapper)
          .findAll(':scope > *')
          .map((el) => el.text().trim());
      });
      Then('the first line of the credits reads "Make A Face"', () => {
        expect(lines[0]).toBe('Make A Face');
      });
      And(
        'the next line reads "based on DiceBear Editor - v." and the build version',
        () => {
          expect(lines[1]).toBe(
            `based on DiceBear Editor - v.${__dicebearEditorVersion}`,
          );
          expect(__dicebearEditorVersion).toMatch(
            /^\d{4}-\d{2}-\d{2}-[0-9a-f]{7}$/,
          );
          wrapper.unmount();
        },
      );
    },
  );

  Scenario(
    'The credits carry no sponsor advertisement',
    ({ Given, When, Then, And }) => {
      let wrapper: VueWrapper;

      Given('the options footer', () => {
        wrapper = mountFooter();
      });
      When('I click the "Credits" link', async () => {
        await creditsLink(wrapper).trigger('click');
      });
      Then('the credits do not mention "CDN Sponsored"', () => {
        expect(wrapper.text()).not.toContain('CDN Sponsored');
      });
      And('the credits do not link to "bunny.net"', () => {
        expect(wrapper.html()).not.toContain('bunny.net');
        wrapper.unmount();
      });
    },
  );
});
