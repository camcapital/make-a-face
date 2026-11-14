import type { SelectedStyleOptions } from '@/types';
import { kebabCase } from 'change-case';
import getAvatarOptions from '@/utils/getAvatarOptions';

const apiUrl = (
  import.meta.env.VITE_API_URL || 'https://dice-lab.camcap.co'
).replace(/\/+$/, '');
const apiVersion = import.meta.env.VITE_API_VERSION || '10.x';

export default function getApiUrl(
  styleName: string,
  options: SelectedStyleOptions,
  format: string = 'svg',
) {
  const qs = Object.entries(getAvatarOptions(styleName, options))
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `${encodeURIComponent(k)}=${v
          .map((c) => encodeURIComponent(c))
          .join(',')}`;
      }

      if (
        typeof v == 'string' ||
        typeof v == 'number' ||
        typeof v == 'boolean'
      ) {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      }

      throw new Error(`Invalid value for "${k}"`);
    })
    .join('&');

  return `${apiUrl}/${apiVersion}/${kebabCase(styleName)}/${format}${
    qs ? `?${qs}` : ''
  }`;
}
