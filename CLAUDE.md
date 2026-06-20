# Claude Instructions: Litsquare Favicon

This project provides a reusable favicon workflow for web projects.

When a user asks Claude to add or update favicons with Litsquare Favicon:

1. Run `npx litsquare-favicon init --framework react` for React projects, or `--framework html` for static/non-React projects.
2. Confirm that exported Figma SVG files are present in `litsquare-favicon/source`.
3. Run `npx litsquare-favicon generate`.
4. Run `npx litsquare-favicon validate`.
5. Connect either `src/seo/FaviconLinks.tsx` or `litsquare-favicon/head.html` to the app's document head.

Required source:

- `litsquare-favicon/source/favicon.svg`

Optional source:

- `icon.svg`
- `icon-maskable.svg`
- `apple-touch-icon.svg`
- `safari-pinned-tab.svg`

Do not hand-edit generated PNG or ICO files. Change the Figma source export or SVG source, then regenerate.
