# Litsquare Favicon Project Instructions

Use these instructions when updating favicons in this project.

1. Export SVG source files from the `litsquare favicon` Figma community file into `litsquare-favicon/source`: https://www.figma.com/community/file/1650255256777018269
2. Run `npx litsquare-favicon generate`.
3. Run `npx litsquare-favicon validate`.
4. Ensure the generated head links are connected to the project.

Generated files live in `public/`.

Do not manually edit generated PNG or ICO files. Update the SVG source and regenerate.
