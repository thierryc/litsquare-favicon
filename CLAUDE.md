# Claude Instructions: Litsquare Favicon

This project provides a reusable favicon workflow for web projects.

When a user asks Claude to add or update favicons with Litsquare Favicon:

1. Run `npx litsquare-favicon init --framework react` for React projects, or `--framework html` for static/non-React projects.
2. Duplicate or create a project Figma file from the `litsquare favicon` community scaffold, replace the scaffold visuals with the project artwork, hide layers named `safe-area guide` and `maskable safe-area guide`, then export SVG frames from that project file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269
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

Do not hand-edit generated PNG or ICO files. Change the Figma source export or SVG source, then regenerate. If guide lines are visible in any generated PNG, SVG, or ICO review output, treat the export as failed, re-export with `safe-area guide` and `maskable safe-area guide` hidden, and regenerate. Restore guide visibility in the working Figma file after export if you edited it directly.

For the browser favicon source, `favicon.svg` must use a full opaque square background with no rounded corners. Keep rounded corners only for app icon sources such as `apple-touch-icon.svg`, `icon.svg`, and `icon-maskable.svg`. If Safari or another browser shows a white halo/stroke around the tab icon, treat the browser favicon export as failed and re-export `favicon.svg` with a square opaque background.
