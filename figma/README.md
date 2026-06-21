# Figma Export Instructions

The community scaffold file is [`litsquare favicon`](https://www.figma.com/community/file/1650255256777018269).

Duplicate the community file into your own Figma account or create a new project file from it. Replace the scaffold visuals with your own mark and colors, keep the frame names, then export these frames from your own file:

| Frame name | Format | Size | Notes |
| --- | --- | --- | --- |
| `favicon.svg` | SVG | 64x64 | Required. Browser favicon and ICO source. |
| `icon.svg` | SVG | 512x512 | Optional. Standard app icon source. |
| `icon-maskable.svg` | SVG | 512x512 | Optional. Keep critical artwork inside the central safe area. |
| `apple-touch-icon.svg` | SVG | 180x180 | Optional. Use an opaque square background. |
| `safari-pinned-tab.svg` | SVG | 64x64 | Optional. Monochrome solid paths only. |

Export SVG frames to:

```text
litsquare-favicon/source/
```

Then run:

```sh
npx litsquare-favicon generate
```
