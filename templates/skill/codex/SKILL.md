---
name: litsquare-favicon-project
description: Add or update project favicons using source frames exported from a project Figma file based on the Litsquare Favicon community scaffold.
---

# Litsquare Favicon Project Skill

Use this skill when working inside this project and the task involves favicons, app icons, web manifests, or head link tags.

## Commands

```sh
npx litsquare-favicon generate
npx litsquare-favicon validate
```

## Source Files

Duplicate or create a project Figma file from the community scaffold, replace the scaffold visuals with the project artwork, hide layers named `safe-area guide` and `maskable safe-area guide`, and put exported SVG files from that project file in `litsquare-favicon/source`.

Figma community file: https://www.figma.com/community/file/1650255256777018269

Required:

- `favicon.svg`

Optional:

- `icon.svg`
- `icon-maskable.svg`
- `apple-touch-icon.svg`
- `safari-pinned-tab.svg`

If guide lines are visible in any generated PNG, SVG, or ICO review output, treat the export as failed, re-export with `safe-area guide` and `maskable safe-area guide` hidden, and regenerate. Restore guide visibility in the working Figma file after export if you edited it directly.

## Output Contract

The generated public files are:

- `public/favicon.ico`
- `public/favicon.svg`
- `public/favicon-96x96.png`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-maskable-192.png`
- `public/icon-maskable-512.png`
- `public/site.webmanifest`

Connect `litsquare-favicon/head.html` or the generated React `FaviconLinks` component to the app head.
