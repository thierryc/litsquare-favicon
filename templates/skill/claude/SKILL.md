# Litsquare Favicon Project Instructions

Use these instructions when updating favicons in this project.

1. Duplicate or create a project Figma file from the `litsquare favicon` community scaffold, replace the scaffold visuals with the project artwork, hide layers named `safe-area guide` and `maskable safe-area guide`, then export SVG source files from that project file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269
2. Run `npx litsquare-favicon generate`.
3. Run `npx litsquare-favicon validate`.
4. Ensure the generated head links are connected to the project.

Generated files live in `public/`.

For the browser favicon source, `favicon.svg` must use a full opaque square background with no rounded corners. Keep rounded corners only for app icon sources such as `apple-touch-icon.svg`, `icon.svg`, and `icon-maskable.svg`. If Safari or another browser shows a white halo/stroke around the tab icon, treat the browser favicon export as failed and re-export `favicon.svg` with a square opaque background.

Do not manually edit generated PNG or ICO files. Update the SVG source and regenerate. If guide lines are visible in any generated PNG, SVG, or ICO review output, treat the export as failed, re-export with `safe-area guide` and `maskable safe-area guide` hidden, and regenerate. Restore guide visibility in the working Figma file after export if you edited it directly.
