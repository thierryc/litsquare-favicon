# Claude Instructions: Litsquare Favicon

This project provides a reusable favicon workflow for web projects.

When a user asks Claude to add or update favicons with Litsquare Favicon:

1. Run `npx litsquare-favicon init --framework react` for React projects, or `--framework html` for static/non-React projects.
2. Export SVG frames from the `litsquare favicon` Figma community file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269
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
