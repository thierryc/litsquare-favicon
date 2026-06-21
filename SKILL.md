---
name: litsquare-favicon
description: Generate complete website favicon assets from a project Figma file based on the Litsquare Favicon community scaffold and install them into a web project.
---

# Litsquare Favicon Skill

Use this skill when a project needs a complete favicon set generated from a user-owned Figma file based on the [`litsquare favicon`](https://www.figma.com/community/file/1650255256777018269) community scaffold or from compatible exported SVG frames.

## What This Skill Does

1. Initializes the target project with `litsquare.favicon.json`.
2. Adds project-local instructions for Codex and Claude.
3. Converts exported Figma SVG frames into web favicon assets.
4. Writes stable HTML head tags or a React `FaviconLinks` component.
5. Validates the required public files.

## Required Source

The project must have `litsquare-favicon/source/favicon.svg`.

Optional source files:

- `litsquare-favicon/source/icon.svg`
- `litsquare-favicon/source/icon-maskable.svg`
- `litsquare-favicon/source/apple-touch-icon.svg`
- `litsquare-favicon/source/safari-pinned-tab.svg`

If optional files are missing, the CLI falls back to `favicon.svg`.

## Workflow

From the target project root:

```sh
npx litsquare-favicon init --framework react
```

Ask the user to duplicate or create their own Figma file from the community scaffold, replace the scaffold visuals with the project artwork, then export SVG frames from their own file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269

Before exporting from Figma, hide scaffold guide layers named `safe-area guide` and `maskable safe-area guide`. These guides are for design review only and must not appear in exported SVG sources. If guide lines are visible in any generated PNG, SVG, or ICO review output, treat the export as failed, re-export with those guide layers hidden, and regenerate. If you edited the working Figma file directly, restore guide visibility after exporting.

For the browser favicon source, make `favicon.svg` use a full 64x64 opaque square background with no rounded corners. Rounded corners belong only in app icon sources such as `apple-touch-icon.svg`, `icon.svg`, and `icon-maskable.svg`. If Safari or another browser shows a white halo/stroke around the tab icon, treat the browser favicon export as failed and re-export `favicon.svg` with a square opaque background.

Then run:

```sh
npx litsquare-favicon generate
npx litsquare-favicon validate
```

For non-React projects:

```sh
npx litsquare-favicon init --framework html
```

Then add the generated `litsquare-favicon/head.html` contents to the app head.

## Quality Bar

- Keep favicon URLs stable.
- Use an opaque background for Apple and PWA PNG icons.
- Use a square opaque background with no rounded corners for the browser `favicon.svg` source.
- Keep maskable icon artwork inside the central safe area.
- Keep `safe-area guide` and `maskable safe-area guide` hidden during source export.
- Do not export `favicon.ico` directly from Figma; generate it from 16, 32, and 48 pixel PNG sources.
- Run `npx litsquare-favicon validate` before finishing.
