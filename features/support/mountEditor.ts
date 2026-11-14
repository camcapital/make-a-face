import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import PrimeVue from 'primevue/config';
import type { Component } from 'vue';
import en from '@/messages/en.json';
import useMainStore from '@/stores/main';

/**
 * Mounts one editor component the way main.ts sets up the app, in English and
 * with the given style selected.
 */
export function mountEditor(
  component: Component,
  { styleName = 'adventurer', props = {} } = {},
) {
  const pinia = createPinia();
  setActivePinia(pinia);
  useMainStore().selectedStyleName = styleName;

  const wrapper = mount(component, {
    props,
    attachTo: document.body,
    global: {
      plugins: [
        pinia,
        createI18n({
          legacy: false,
          locale: 'en',
          fallbackLocale: 'en',
          messages: { en },
        }),
        [PrimeVue, { unstyled: true }],
      ],
    },
  });

  return { wrapper, store: useMainStore() };
}
