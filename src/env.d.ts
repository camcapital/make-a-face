/// <reference types="vite/client" />

type Language = {};

declare const __dicebearEditorVersion: string;

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_VERSION?: string;
  readonly VITE_PRIVACY_POLICY_URL?: string;
  readonly VITE_COOKIE_POLICY_URL?: string;
  readonly VITE_LEGAL_NOTICE_URL?: string;
}
