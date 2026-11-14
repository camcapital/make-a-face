# Make A Face

A self-hosted copy of the [DiceBear editor](https://editor.dicebear.com/),
served at <https://makeaface.camcap.dev>. Avatars are drawn in the browser with
`@dicebear/core`; the URLs it copies and the PNGs it downloads come from our
DiceBear API instance at `https://dice-lab.camcap.co` instead of
`api.dicebear.com`.

[![Preview](preview.png)](https://makeaface.camcap.dev)

## Upstream

The app is a copy of `apps/editor` from
[dicebear/dicebear](https://github.com/dicebear/dicebear) at tag
[`v10.7.0`](https://github.com/dicebear/dicebear/tree/v10.7.0/apps/editor),
turned into a standalone npm project that uses the published `@dicebear/*`
packages. It stays on 10.x because our server runs `dicebear/api:4`, which
serves `/10.x` only; the preview and the server's rendering must use the same
major version.

Changes from upstream:

- `src/utils/getApiUrl.ts` reads the API base URL and version from
  `VITE_API_URL` and `VITE_API_VERSION`.
- `features/` holds Gherkin specs and their vitest steps.
- `scripts/deploy.mjs` and `.github/workflows/` test, build and deploy the site.

DiceBear is MIT licensed by Florian Körner; see [LICENSE](LICENSE). Each avatar
style has its own license, which the editor shows when you download.

## Configuration

Set at build time (see `.env.example`):

| Variable | Default | |
| --- | --- | --- |
| `VITE_API_URL` | `https://dice-lab.camcap.co` | DiceBear API base URL |
| `VITE_API_VERSION` | `10.x` | API version path segment |
| `VITE_PRIVACY_POLICY_URL` | empty | Footer legal links; hidden when empty |
| `VITE_COOKIE_POLICY_URL` | empty | |
| `VITE_LEGAL_NOTICE_URL` | empty | |

## Development

Requires Node 20.19 or later.

```sh
npm install
npm run dev     # dev server with hot reload
npm run build   # validate messages, type-check and build to dist/
npm test        # Gherkin scenarios in features/, run with vitest
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which tests and builds `dist/`,
uploads it as a static AppWrite Site (`makeaface`), and points
`makeaface.camcap.dev` at it. It can also be run by hand from the Actions tab.

The workflow uses the `Production` environment:

- Secret `APPWRITE_API_KEY`: needs the `sites.read`, `sites.write`,
  `rules.read` and `rules.write` scopes.
- Variables `APPWRITE_ENDPOINT` and `APPWRITE_PROJECT_ID`.
- Optional variables `VITE_API_URL` and `VITE_API_VERSION` override the
  defaults above.
