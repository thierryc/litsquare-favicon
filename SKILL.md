---
name: litsquare-favicon
description: Generate complete website favicon assets from the Litsquare Favicon community Figma file and install them into a web project.
---

# Litsquare Favicon Skill

Use this skill when a project needs a complete favicon set generated from the [`litsquare favicon`](https://www.figma.com/community/file/1650255256777018269) community Figma file or from compatible exported SVG frames.

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

Ask the user to export SVG frames from the Figma community file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269

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
- Keep maskable icon artwork inside the central safe area.
- Do not export `favicon.ico` directly from Figma; generate it from 16, 32, and 48 pixel PNG sources.
- Run `npx litsquare-favicon validate` before finishing.
