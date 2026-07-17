# jozsadavid.com — Site Documentation
**For the web designer / maintainer**
Last updated: July 2026

---

## 1. What This Site Is

A personal portfolio site for Józsa Dávid — writer, photographer, and CGI creative director. It is composed of four pages, each with a distinct identity:

| Page | URL | Purpose |
|---|---|---|
| Portal | `index.html` | Entry screen — links to the three disciplines |
| Nolka | `nolka.html` | Photography portfolio |
| Kibo Visuals | `kibo.html` | CGI / architectural visualization portfolio |
| Writing | `writing.html` | Literary work / books |

The site is entirely static — no backend, no CMS, no database. Everything runs in the browser.

---

## 2. Hosting & Deployment

**Host:** GitHub Pages
**Domain:** jozsadavid.com (set via CNAME file in repo root)
**Repository:** Private GitHub repo

### Deployment workflow
1. Edit files locally
2. `git add .`
3. `git commit -m "description of change"`
4. `git push origin main`
5. GitHub Pages auto-deploys in ~30–60 seconds. Hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R) to bypass cache.

There is no build step, no npm, no compilation. What you push is what goes live.

---

## 3. File Structure

```
jozsadavid.com/
│
├── index.html              ← Portal / home page
├── nolka.html              ← Photography portfolio
├── kibo.html               ← CGI portfolio
├── writing.html            ← Literary page
├── style.css               ← Shared global stylesheet
├── CNAME                   ← Domain config (do not edit)
├── sitemap.xml             ← SEO sitemap
├── 404.html                ← Custom error page
├── favicon.ico / .png / .svg
│
├── data/
│   ├── nolka.js            ← Nolka image lists (edit to add/remove/reorder photos)
│   ├── kibo_exteriors.js   ← Kibo Exteriors image list
│   ├── kibo_interiors.js   ← Kibo Interiors image list
│   ├── kibo_cd.js          ← Kibo Creative Direction image list
│   └── kibo_art.js         ← Kibo Art image list
│
├── js/
│   └── ambient.js          ← Shared ambient/sound logic (portal page)
│
└── img/
    ├── thumbs/             ← AUTO-GENERATED grid thumbnails (mirrors nolka/ + kibo/ folders — see "Thumbnails" section)
    ├── nolka-logo.jpg / nolka-logo-transparent.png / nolka-logo-white.jpg
    ├── kibo-logo.jpg / kibo-logo-transparent.png / kibo-logo-light.jpg
    ├── adam.jpg             ← Book cover (Writing page)
    ├── diariedades01.jpg    ← Book cover (Writing page)
    ├── writer/
    │   └── jd.jpg          ← Author photo (Writing page)
    ├── nolka/
    │   ├── wild/           ← Wild Things photography
    │   ├── soft/           ← Soft Creatures photography
    │   ├── people/         ← People photography
    │   ├── places/         ← Places photography
    │   └── plus18/         ← Private +18 section images
    └── kibo/
        ├── Exteriors/      ← CGI exterior renders
        ├── Interiors/      ← CGI interior renders
        ├── Creative_Direction/ ← CGI creative direction work
        └── Art/            ← CGI art / personal work
```

---

## 4. Design System (style.css)

All pages share `style.css`. It defines CSS custom properties (variables) used throughout.

### Key variables

```css
--font-display:  'Syne'            /* headings, large type */
--font-body:     'Inter'           /* body text */
--font-label:    'DM Mono'         /* labels, small caps, counters */

--gutter:        clamp(1.5rem, 5vw, 4.5rem)   /* horizontal page padding */
--nav-h:         ~60px             /* nav bar height */
--max-w:         1400px            /* max content width */

/* Dark theme (default — used by Nolka and Kibo) */
--bg:            #0a0a08
--text:          #e8e3d8
--text-dim:      rgba(232,227,216,0.55)
--text-muted:    #484642
--border:        #1e1e1c
--accent:        #c4a96a           /* gold — used for labels/accents */
```

Kibo overrides `--font-display` to `Syne` and `--font-body` to `Plus Jakarta Sans` in an inline `<style>` block at the top of `kibo.html`.

---

## 5. index.html — Portal Page

The home page is a full-screen split panel. Three equal columns (Writing, Nolka, Kibo), each a clickable portal that expands on hover and navigates on click.

### What it does
- On desktop: hovering a portal expands it (`flex-grow`), the background image zooms slightly
- On mobile: the panels stack vertically and are each approximately half the viewport
- No editing is required here unless changing the hero images or copy for each portal

### To change a portal image
Each portal's background image is set inline in the HTML as a `background-image` style or via a `data-src` attribute loaded by a small inline script. Find the portal by its class:
- `.portal--writing`
- `.portal--nolka`
- `.portal--kibo`

---

## 6. nolka.html — Photography Portfolio

### How it works

The page loads images from `data/nolka.js`. On page load, JavaScript reads the `NOLKA_DATA` object and builds masonry grids for each section automatically. **You never touch `nolka.html` to add, remove or reorder photos.** You only edit `data/nolka.js`.

### Sections

| Section key | Label | Folder |
|---|---|---|
| `wild` | Wild Things | `img/nolka/wild/` |
| `soft` | Soft Creatures | `img/nolka/soft/` |
| `people` | People I know and some I don't | `img/nolka/people/` |
| `places` | Places & Structures | `img/nolka/places/` |
| `plus18` | +18 (private) | `img/nolka/plus18/` |

### data/nolka.js — the only file you need to edit

```js
var NOLKA_DATA = {
  wild: {
    label : "Wild Things",
    num   : "01",
    dark  : false,
    images: [
      "Pink_Pelican_Eye.jpg",
      "Pelican_Feathers.jpg",
      // ... one filename per line
    ]
  },
  // soft, people, places, plus18 follow the same pattern
};
```

**To add a photo:**
1. Drop the `.jpg` file into the correct folder under `img/nolka/<section>/`
2. Generate its thumbnail into `img/thumbs/nolka/<section>/` (see the "Thumbnails" section below). If you skip this, the site still works — the grid just loads the heavy original for that photo.
3. Add the filename to the `images` array in `data/nolka.js` at the position you want it to appear
4. Commit and push.

**To remove a photo:**
1. Delete the filename from the array in `data/nolka.js`
2. Optionally delete the file from `img/nolka/<section>/` (not strictly required but keeps the repo clean)

**To reorder photos:**
Move lines within the `images` array. The masonry grid renders them in the order listed.

### Notes on removed / dormant blocks

- **AM-310 documentary teaser**: commented out in `nolka.html` (July 2026). Search for "Documentary teaser" and uncomment the block to restore it; its CSS (`.nolka-doc-teaser…`) is still in place.
- **`data/nolka.json`**: legacy file, removed from the repo (moved to `_to_delete/`).

### The +18 Section and Password Gate

The `plus18` section sits between People and Places as a standalone collapsible element. It is protected by a password gate.

A wrong password shakes the modal (`.gate-modal.is-shake`, keyframes `gateShake` — pure CSS, retriggered from the submit handler).

**Password:** `nasty`
The password is stored as a base64 hash (`bmFzdHk=`) in `nolka.html`. It is verified client-side using `btoa()`. **This is not cryptographically secure — it is an access deterrent, not encryption.**

**Session-only:** The unlock state is stored in a JavaScript variable (`_unlocked`). It resets every time the page is loaded or refreshed. It does not persist across sessions, browser tabs, or devices. This is intentional.

**To change the password:**
1. In `nolka.html`, find the line: `var PASS_HASH = 'bmFzdHk=';`
2. Open your browser's developer console and run: `btoa('yournewpassword')`
3. Replace `'bmFzdHk='` with the output

**To add/remove +18 images:**
Same as any other section — edit the `plus18.images` array in `data/nolka.js` and manage files in `img/nolka/plus18/`.

### Image Standards for Nolka

**Minimum resolution:** 2800px on the longest side. Never go below this.
**Format:** JPEG
**Quality:** 88 (when resaving with PIL/Pillow or similar tool)
**Optimize:** Yes (`optimize=True` in PIL)

Processing command (Python / PIL):
```python
from PIL import Image
img = Image.open('original.jpg')
w, h = img.size
ratio = 2800 / max(w, h)
new_w, new_h = round(w * ratio), round(h * ratio)
img_resized = img.resize((new_w, new_h), Image.LANCZOS)
img_resized.save('output.jpg', 'JPEG', quality=88, optimize=True)
```

**Known files currently below 2800px** (no originals available to upgrade):
- `img/nolka/wild/Starling_on_the_Wind_Vane.jpg` — 2187px
- `img/nolka/soft/Picur.jpg` — 1920px
- `img/nolka/soft/Mamushka_Joy.jpg` — 1590px

Most other images in the portfolio sit at 2250px — the previous standard. These are acceptable as-is unless originals become available. Do not re-export at a lower resolution to "fix" them.

**CRITICAL — do not use PIL's `LOAD_TRUNCATED_IMAGES = True`** when overwriting originals. It causes partial reads that silently corrupt the file. Always open fresh originals, never re-save already-compressed exports back through PIL.

### Thumbnails (grid derivatives) — applies to BOTH Nolka and Kibo

Since July 2026 the grids and filmstrips load lightweight derivatives from
`img/thumbs/…` (max 1400px long side, JPEG quality 80). The folder structure
mirrors the originals exactly:

| Original | Thumbnail |
|---|---|
| `img/nolka/wild/Photo.jpg` | `img/thumbs/nolka/wild/Photo.jpg` |
| `img/kibo/Exteriors/Render.jpg` | `img/thumbs/kibo/Exteriors/Render.jpg` |

Lightboxes and the Kibo hero always load the **full-resolution original**.
If a thumbnail is missing, the page silently falls back to the original via an
`onerror` handler — nothing breaks, that one image just loads slower.

**When adding a new image, generate its thumbnail (Python/PIL):**
```python
import os, shutil
from PIL import Image, ImageOps
src = 'img/nolka/wild/New_Photo.jpg'              # the original you just added
dst = src.replace('img/', 'img/thumbs/', 1)       # derivative path
os.makedirs(os.path.dirname(dst), exist_ok=True)
img = ImageOps.exif_transpose(Image.open(src))
w, h = img.size
if max(w, h) > 1400:
    r = 1400 / max(w, h)
    img = img.convert('RGB').resize((round(w*r), round(h*r)), Image.LANCZOS)
    img.save(dst, 'JPEG', quality=80, optimize=True)
else:
    shutil.copy2(src, dst)                        # already small — copy as-is
```

Rules: thumbnails only ever live in `img/thumbs/`; never overwrite an original;
this derivative resize is the one legitimate re-save (the original stays untouched).

---

## 7. kibo.html — CGI Portfolio

### How it works

Kibo uses a horizontal filmstrip (marquee-style infinite scroll) for each gallery section. Images are loaded from four separate JS data files in `data/`. The filmstrips auto-populate on page load.

### Sections and their data files

| Section | Data file | Image folder |
|---|---|---|
| Exteriors | `data/kibo_exteriors.js` → `KIBO_EXTERIORS` array | `img/kibo/Exteriors/` |
| Interiors | `data/kibo_interiors.js` → `KIBO_INTERIORS` array | `img/kibo/Interiors/` |
| Creative Direction | `data/kibo_cd.js` → `KIBO_CD` array | `img/kibo/Creative_Direction/` |
| Art | `data/kibo_art.js` → `KIBO_ART` array | `img/kibo/Art/` |

### Data file format

Unlike Nolka (which uses just filenames), Kibo data files use full relative paths:

```js
var KIBO_EXTERIORS = [
  "img/kibo/Exteriors/MOZSES_Neom_Mansions_Arrival.jpg",
  "img/kibo/Exteriors/ZAHAHADID_Pattaya_Dredge.jpg",
  // ...
];
```

**To add an image:**
1. Drop the file into the correct `img/kibo/<Section>/` folder
2. Generate its thumbnail into `img/thumbs/kibo/<Section>/` (see the Thumbnails section in §6 — same command). Optional but recommended; missing thumbs fall back to the original.
3. Add the full relative path to the correct array in the correct data file
4. Commit and push

**To remove:** Delete the entry from the array (and optionally the file).
**To reorder:** Move lines within the array.

### Image naming convention for Kibo

Files follow a `STUDIO_ProjectName.jpg` pattern:
- `THINKLAB_BOMAX-FigTree01.jpg`
- `MOZSES_Neom_Mansions_Arrival.jpg`
- `ZAHAHADID_Pattaya_Dredge.jpg`

This is purely organisational. The site reads whatever filename is in the array.

### Creative Direction section

The Creative Direction strip has a "toggle" button (`Direction`) that collapses/expands the gallery. This is the only section with that behaviour. It is driven by a `<button class="toggle-btn">` that a scroll-linked JS function handles. No changes needed unless redesigning.

### Built-in performance behaviours (July 2026)

- Filmstrips and the Art film-rail **pause all auto-scroll work while off-screen** (IntersectionObserver; purely background — on-screen behaviour is unchanged).
- Both lightboxes (Nolka + Kibo) **preload the previous/next full-res image** so arrow navigation feels instant.
- On touch devices (`hover: none`) filmstrip **captions are always visible** with a lighter gradient, since there is no hover.

### Kibo image standards

Images should be high resolution. The filmstrip displays them at a fixed height (`--strip-h: clamp(52vh, 66vh, 740px)`) so width varies. There is no hard minimum enforced by code, but for 4K screens, source images should ideally be no less than 3000px on the short side for full-bleed quality.

---

## 8. writing.html — Literary Page

### Structure

The Writing page is fully hand-coded HTML — there is no data file driving it. To add, edit or remove books or series, you edit `writing.html` directly.

### Page sections (in order)

1. Hero (animated typewriter heading)
2. Diariedades series (Crônicas)
3. Relatos Obscuros da Perversividade Humana series
4. As far as I remember, I always wanted to be a couch (standalone novel)
5. Author bio + photo
6. Contact form (Literary inquiries)

### Book entry patterns

There are two HTML patterns used for books:

**Pattern A — Featured book (has a cover image, published):**
Used for: Diariedades 01, standalone novel
```html
<div class="book-entry" data-reveal>
  <div class="book-cover">
    <img src="img/bookcover.jpg" alt="Book title cover">
  </div>
  <div class="book-body">
    <div class="book-vol">Vol. 01 · Publicado</div>
    <h3 class="book-title">Book Title</h3>
    <div class="book-quote"><p>"Quote from the book."</p></div>
    <a href="AMAZON_URL" class="btn btn--primary">Comprar na Amazon →</a>
  </div>
</div>
```

**Pattern B — Volume entry (used inside series lists):**
Used for: Adam, A Pequena Raquel, Dmitro, O Policial, etc.
```html
<article class="vol-entry vol-entry--published">  <!-- or --wip / --announced -->
  <div class="vol-num"><span class="vol-num__text">01</span></div>
  <div class="vol-cover">
    <img src="img/coverfile.jpg" alt="Title cover">  <!-- or placeholder span -->
  </div>
  <div class="vol-body">
    <div class="vol-top">
      <h3 class="vol-title">Volume Title</h3>
      <span class="vol-status vol-status--pub">Publicado</span>  <!-- or --wip / --tba -->
    </div>
    <div class="vol-quote"><p>"Quote."</p></div>
    <div class="vol-actions">
      <a href="AMAZON_URL" class="btn btn--primary">Comprar na Amazon →</a>
    </div>
  </div>
</article>
```

**Status modifier classes:**

| Class | Meaning |
|---|---|
| `vol-entry--published` | Published — full styling |
| `vol-entry--wip` | Work in progress — slightly muted |
| `vol-entry--announced` | Announced/coming — most muted |
| `vol-status--pub` | "Publicado" badge (green-ish) |
| `vol-status--wip` | "Em progresso" badge |
| `vol-status--tba` | "Em breve" / "Anunciado" badge |

### Adding a new book

1. Add the cover image to `img/` (e.g. `img/raquel.jpg`)
2. Add the HTML entry in the right series section using Pattern A or B above
3. Set the correct status class
4. If published, add the Amazon link

### Removing a placeholder / in-progress entry

Find the `<article class="vol-entry ...">` block by its volume number or title and delete the entire `<article>...</article>` block.

### Language note

The writing page mixes Portuguese and English intentionally. Book content (titles, quotes) is in Portuguese (pt-BR); the bio is in English.

**The language toggle IS active:** the `EN`/`PT` button in the nav (`#lang-toggle`) swaps every element carrying a `data-i18n` attribute using the `DICT` object defined in an inline script near the bottom of `writing.html`. The choice persists via `localStorage` key `w-lang` (default: `pt`). To add a new translatable label: give the element a `data-i18n="your-key"` attribute and add `your-key` entries to **both** the `en` and `pt` dictionaries.

### Series progress strip

Above the Relatos vol-list sits a compact 9-dot progress strip (`.vol-progress`). When a volume's status changes, update the modifier class on its item: `vol-progress__item--pub` (published, filled gold), `vol-progress__item--wip` (in progress, half dot), or no modifier (announced/coming, empty dot). Keep it in sync with the `vol-entry` status classes below it.

---

## 9. What to Never Do

### Never re-save already-compressed JPEGs without originals
Every JPEG re-save adds compression artifacts. Always work from the original RAW or highest-quality source file.

### Never use PIL's LOAD_TRUNCATED_IMAGES flag when overwriting files
```python
# DO NOT DO THIS when saving over originals:
ImageFile.LOAD_TRUNCATED_IMAGES = True
```
This causes PIL to read only partial image data, silently saving a corrupted file that looks grey or broken in the browser.

### Never delete the CNAME file
`CNAME` contains the single line `jozsadavid.com`. Without it, the custom domain stops working and the site serves from a github.io URL.

### Never commit large uncompressed originals
Raw camera files (`.RAF`, `.CR2`, `.ARW`, `.NEF`) should never be added to the repository. Process down to JPEG at the standards above, then commit only the JPEG.

### Never put +18 images in any folder other than `img/nolka/plus18/`
The password gate only protects the `plus18` section. Images placed elsewhere are publicly accessible.

### Do not change the `data-section` attribute on masonry divs in nolka.html
The JavaScript uses `data-section` to look up the right key in `NOLKA_DATA`. If this changes, the entire section stops loading.

---

## 10. Passwords and Access

| What | Value | Notes |
|---|---|---|
| Nolka +18 gate | `nasty` | Session-only. Resets on page reload. Stored as `btoa()` hash. |
| GitHub account | (owner holds) | Required to push changes live |
| Domain registrar | (owner holds) | jozsadavid.com DNS |

---

## 11. SEO and Meta

Each page has:
- `<title>`, `<meta name="description">`, canonical `<link>`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Structured data (`<script type="application/ld+json">`) with Schema.org markup for Person, Book, Organization, WebPage types

The `sitemap.xml` in the root lists all four pages. Update it if new pages are ever added.

---

## 12. Fonts

Loaded from Google Fonts via `<link>` tags in each page's `<head>` (NOT via `@import` in style.css — that was removed in July 2026 because it created a render-blocking chain). Each page loads only the families it uses:

| Page | Families loaded |
|---|---|
| `index.html` | Cormorant Garamond, DM Mono, Inter |
| `writing.html` | Cormorant Garamond, DM Mono, Inter |
| `404.html` | Cormorant Garamond, DM Mono, Inter |
| `nolka.html` | Fraunces, Space Mono, Inter |
| `kibo.html` | Syne, Plus Jakarta Sans, Cormorant Garamond (italic 300, for section headers), DM Mono |

If you add a page, copy the two `preconnect` lines + the fonts `<link>` from an existing page. If you use a new font/weight anywhere, add it to that page's fonts URL.

---

## 13. Quick Reference — Most Common Tasks

### Add a photo to Nolka
1. Resize to 2800px max side, JPEG quality 88
2. Drop into `img/nolka/<section>/`
3. Generate thumbnail into `img/thumbs/nolka/<section>/` (§6 Thumbnails)
4. Add filename to `data/nolka.js` in the right `images` array
5. `git add . && git commit -m "add photo" && git push`

### Remove a photo from Nolka
1. Delete filename from `data/nolka.js`
2. `git add . && git commit && git push`

### Add a render to Kibo
1. Drop file into `img/kibo/<Section>/`
2. Generate thumbnail into `img/thumbs/kibo/<Section>/` (§6 Thumbnails)
3. Add full path `"img/kibo/<Section>/filename.jpg"` to the correct data file
4. `git add . && git commit && git push`

### Change the +18 password
1. In a browser console: `btoa('newpassword')` → copy the output
2. In `nolka.html`, replace `'bmFzdHk='` with the new hash
3. Commit and push

### Add a new book to the Writing page
Edit `writing.html` directly, insert HTML using Pattern A or B from Section 8 above.

### Update a book's status (in progress → published)
1. Change `vol-entry--wip` to `vol-entry--published` on the `<article>`
2. Change `vol-status--wip` to `vol-status--pub` on the badge `<span>`
3. Add the Amazon `<a>` link inside `<div class="vol-actions">`
4. Replace the "cover coming" placeholder with `<img src="img/cover.jpg">`
