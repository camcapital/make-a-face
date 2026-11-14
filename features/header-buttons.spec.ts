// @vitest-environment happy-dom
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import Header from '@/components/Header.vue';
import { mountEditor } from './support/mountEditor';

const feature = await loadFeature('features/header-buttons.feature');

const selectors: Record<string, string> = {
  random: '.header-actions button:has(.pi-sparkles)',
  fullscreen: '.header-actions button:has(.pi-window-maximize)',
  download: '.header > button',
};

function button(wrapper: VueWrapper, name: string) {
  const found = wrapper.find(selectors[name]);
  expect(found.exists(), `the ${name} button is on the page`).toBe(true);

  return found;
}

describeFeature(feature, ({ Scenario, ScenarioOutline }) => {
  Scenario('The download button says what it does', ({ Given, Then }) => {
    let wrapper: VueWrapper;

    Given('the editor header', () => {
      ({ wrapper } = mountEditor(Header));
    });
    Then('the download button reads "Download"', () => {
      expect(button(wrapper, 'download').text()).toBe('Download');
      wrapper.unmount();
    });
  });

  ScenarioOutline(
    'Each button has an accessible name and title',
    ({ Given, Then, And }, variables) => {
      let wrapper: VueWrapper;

      Given('the editor header', () => {
        ({ wrapper } = mountEditor(Header));
      });
      Then('the <button> button is named "<name>"', () => {
        const el = button(wrapper, variables.button).element;
        const name = el.getAttribute('aria-label') ?? el.textContent?.trim();
        expect(name).toBe(variables.name);
      });
      And('the <button> button has the title "<name>"', () => {
        expect(button(wrapper, variables.button).attributes('title')).toBe(
          variables.name,
        );
        wrapper.unmount();
      });
    },
  );
});
