# Figma Export Instructions

The community file will be published as `litsquare favicon`.

Until the community link is available, build any compatible Figma file with these frames:

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
