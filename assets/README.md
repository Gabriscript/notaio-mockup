# assets

Generated from `_originali/` (task T1). The originals are not published; `_originali/` was not modified.

## Images

| File | Source (`_originali/`) | Source px | Output px | Processing |
|---|---|---|---|---|
| img/cortile-1600.webp | IMG_0417_2.JPG | 3477x2956 | 1600x1360 | resize (cover), WebP q80 |
| img/cortile-900.webp | IMG_0417_2.JPG | 3477x2956 | 900x765 | resize (cover), WebP q80 |
| img/sala-riunioni.webp | foto_home_napolitanoUP1.jpg | 1026x450 | 1026x450 | native size, WebP q80 |
| img/repertori.webp | 13.jpg | 580x300 | 580x300 | native size, WebP q80 |
| logo/logo-napolitano-caricato.png | logo_napolitano.png | 339x112 | 339x112 | byte-for-byte copy |

Tool: Node 24 + `sharp` 0.35.5 (libvips 8.18.7), installed in a temporary folder outside the project.
Per image: `sharp(src).rotate().resize(w, h, { fit: 'cover' }).webp({ quality: 80, effort: 6 })` (no `resize` for the native-size images; aspect ratio 1.176 unchanged for the cortile, so `cover` does not crop). Nothing is upscaled.

## Fonts

| File | Font | License | Source |
|---|---|---|---|
| fonts/literata-latin-wght.woff2 | Literata, variable, axis wght 200-900 (no opsz axis), latin subset | SIL Open Font License 1.1 | npm `@fontsource-variable/literata@5.3.0`, `files/literata-latin-wght-normal.woff2` (https://cdn.jsdelivr.net/npm/@fontsource-variable/literata@5.3.0/files/literata-latin-wght-normal.woff2) |
| fonts/hanken-grotesk-latin-wght.woff2 | Hanken Grotesk, variable, axis wght 100-900, latin subset | SIL Open Font License 1.1 | npm `@fontsource-variable/hanken-grotesk@5.3.0`, `files/hanken-grotesk-latin-wght-normal.woff2` (https://cdn.jsdelivr.net/npm/@fontsource-variable/hanken-grotesk@5.3.0/files/hanken-grotesk-latin-wght-normal.woff2) |

Files copied unchanged from the packages and renamed. Glyph coverage for à è é ì ò ù « » € ’ checked with `fontkit` 2.0.4 (`hasGlyphForCodePoint`): all present in both fonts.
