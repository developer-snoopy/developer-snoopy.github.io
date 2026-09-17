# Blog Post Design Specification

## 1. Purpose

This document defines the reusable detail-page design for posts on Dongjae Kwon's CV website. The information hierarchy and reading flow are based on OpenAI's [“Build more natural voice experiences with GPT-Live-1 in the API”](https://openai.com/index/introducing-gpt-live-1-in-the-api/) article, while the visual language remains consistent with the current CV site.

The target is not a pixel-for-pixel OpenAI clone. It is an adaptation with the same core layout:

1. Global navigation
2. Centered metadata, title, and summary
3. Wide cover media
4. Article utility row
5. Sticky table of contents beside a narrow reading column
6. Author/tags and related posts
7. Existing site footer

This specification was prepared from the reference page and the current site as rendered on 2026-09-17.

## 2. Design Principles

- **Editorial first:** the title, summary, and article body carry the page. Decorative UI must not compete with the writing.
- **OpenAI structure, CV identity:** borrow the reference page's hierarchy and proportions, but keep the CV site's dark palette, blue accent, typography, navigation, and footer.
- **Wide context, narrow reading:** cover media may use the full site container; long-form text stays in a comfortable reading column.
- **Useful orientation:** the table of contents shows the article structure and current section without becoming a second primary navigation.
- **Progressive enhancement:** the article remains complete and navigable if scroll-spy, sharing, or animation JavaScript does not load.
- **Content ownership:** use original post media. Do not copy OpenAI artwork, video, logos, or proprietary font files.

## 3. Reference Observations

At a 1280 px desktop viewport, the reference page uses a centered hero, a large title, a wide lead media block, and a narrower body column offset to make room for a sticky left table of contents. At a 390 px mobile viewport, the same content becomes a single column with 24 px side padding and the table of contents becomes a compact sticky disclosure below the global header.

Measured reference values are guidance, not required CV-site tokens:

| Element | Desktop reference | Mobile reference | Adaptation decision |
| --- | ---: | ---: | --- |
| H1 | about 59 px / 60 px | about 32 px / 37 px | Use a responsive `clamp()` with Raleway |
| Body | 17 px / 28 px | 17 px / 28 px | Keep roughly the same reading density |
| Body column | about 589 px | viewport minus 48 px | Use up to 720 px to suit Roboto and technical posts |
| Page gutter | about 30 px | 24 px | Use Bootstrap container on desktop and 24 px on mobile |
| Desktop TOC | Sticky left rail | Hidden as a rail | Convert to a sticky disclosure on small screens |

## 4. Existing CV Design Tokens

The post page must consume the variables already defined in `assets/css/main.css` instead of introducing a separate theme.

```css
--background-color: #101a20;
--surface-color: #141f26;
--default-color: #e7f2f7;
--heading-color: #ffffff;
--accent-color: #1387c1;
--contrast-color: #ffffff;

--default-font: "Roboto", system-ui, sans-serif;
--heading-font: "Raleway", sans-serif;
--nav-font: "Poppins", sans-serif;
```

Post-specific aliases may be added for legibility and consistent geometry:

```css
.post-page {
  --post-wide: 1140px;
  --post-content: 720px;
  --post-toc: 200px;
  --post-grid-gap: clamp(32px, 4vw, 56px);
  --post-header-offset: 104px;
  --post-rule: color-mix(in srgb, var(--default-color), transparent 88%);
  --post-muted: color-mix(in srgb, var(--default-color), transparent 34%);
}
```

## 5. Page Anatomy

```text
Existing sticky site header
└── Main
    └── Article
        ├── Post hero
        │   ├── Date · category · optional series
        │   ├── H1 title
        │   └── One-sentence summary/dek
        ├── Wide cover figure or video
        ├── Utility row
        │   ├── Author · read time
        │   └── Share action
        ├── Article grid
        │   ├── Table of contents
        │   └── Post body
        │       ├── Lead paragraph
        │       ├── H2 sections
        │       ├── Optional H3 subsections
        │       └── Figures, quotes, lists, and code
        ├── Post end matter
        │   ├── Tags
        │   └── Author note
        └── Related posts
Existing site footer
```

The existing `partials/menu.html` header and site footer are reused unchanged. The Blog item should mark itself active for any post detail page.

## 6. Layout Specification

### 6.1 Global frame

- Use the existing Bootstrap `.container` behavior, capped at approximately 1140 px on large screens.
- Preserve the existing sticky navigation and its bottom border.
- The page background stays `var(--background-color)` from header through footer.
- Main content begins below the sticky header; anchor targets use `scroll-margin-top` so headings are never hidden.

### 6.2 Hero

- Center all hero text.
- Desktop top/bottom padding: `96px 0 72px`.
- Mobile top/bottom padding: `56px 0 44px`.
- Metadata appears above the title in this order: `date`, `category`, then optional `series`.
- Metadata uses Poppins, 0.82–0.9 rem, medium weight, muted text. Links become accent colored on hover/focus.
- The H1 is limited to about 16–20 words and a maximum width near 920 px.
- The summary is limited to one or two sentences and a maximum width near 760 px.

Recommended type:

```css
.post-title {
  max-width: 920px;
  margin-inline: auto;
  font-family: var(--heading-font);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.post-dek {
  max-width: 760px;
  margin: 28px auto 0;
  color: color-mix(in srgb, var(--default-color), transparent 12%);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.65;
  text-wrap: balance;
}
```

### 6.3 Cover media

- Place the cover immediately after the hero, inside the wide container.
- Default aspect ratio: `16 / 9`; editorial images may use `3 / 2` when the crop is materially better.
- Use `object-fit: cover`, 18–20 px radius, and the restrained shadow already used on portfolio detail media.
- Provide explicit `width` and `height` attributes to prevent layout shift.
- A caption sits below the asset, aligned to the left, in 0.85 rem muted text.
- Video must show a native or accessible custom control and must never autoplay with sound.

### 6.4 Utility row

- Align the utility row with the body column on desktop, not the full cover width.
- Add a top and bottom hairline using `--post-rule`.
- Desktop: author/read-time information on the left, share on the right.
- Mobile: keep the same row in one line where possible; allow wrapping instead of reducing touch targets.
- Minimum control target: 44 × 44 px.
- Use “Share” with a link icon. Prefer Web Share API and fall back to copying the canonical URL.
- Do not show a nonfunctional “Listen” control. Add audio only when a real audio source exists.

### 6.5 Desktop article grid

At `min-width: 992px`, use a three-zone grid within the wide container:

```css
.post-layout {
  display: grid;
  grid-template-columns: var(--post-toc) minmax(0, var(--post-content)) 1fr;
  gap: var(--post-grid-gap);
  align-items: start;
}

.post-toc {
  position: sticky;
  top: var(--post-header-offset);
  grid-column: 1;
}

.post-body {
  grid-column: 2;
  min-width: 0;
}
```

- The unused right zone visually balances the left TOC and keeps the text near the page center.
- The TOC may scroll internally only if its content exceeds the viewport.
- Standard body media stays within the text column. `.post-media--wide` may span columns 2–3 but must not collide with the TOC.

### 6.6 Reading column

- Body font: Roboto, 1.0625 rem (17 px), line-height 1.75–1.8.
- Paragraph spacing: 1.35–1.5 em.
- Lead paragraph: 1.15–1.25 rem, line-height 1.7.
- H2: Raleway, `clamp(1.75rem, 3vw, 2.2rem)`, weight 500, line-height 1.2; 3.25 rem before and 1.25 rem after.
- H3: Raleway, `clamp(1.3rem, 2vw, 1.55rem)`, weight 600; 2.5 rem before and 1 rem after.
- H4 is reserved for labels inside subcomponents, not as a substitute for H2/H3 document hierarchy.
- Inline links are accent colored and underlined. The underline must remain visible without hover.
- Lists use normal semantic bullets/numbers, 0.75 em item gaps, and no decorative icon replacement.
- Blockquotes use a 3 px accent left border and a lightly tinted surface, not oversized quotation marks.
- Code blocks use a darker surface, 12–14 px radius, horizontal scrolling, and a visible copy button. Inline code uses a subtle surface chip without excessive padding.
- Tables scroll horizontally on narrow screens and keep row/header contrast AA compliant.

## 7. Table of Contents

### 7.1 Content rules

- Generate entries from visible H2 headings only.
- Use short, descriptive section headings; avoid repeating the post title.
- Each H2 receives a stable, human-readable `id`.
- The first content section appears first; do not list Author, Tags, or Related Posts.
- Recommended maximum: 7 items. If a post needs more, revise the structure or group subsections.

### 7.2 Desktop behavior

- The TOC is a sticky left rail and starts at the same vertical position as the first body paragraph.
- Default item: muted text, 0.84 rem, line-height 1.35.
- Active item: `var(--heading-color)`, semibold, plus a 2 px accent rule or accent dot.
- Hover/focus: heading color with a clearly visible focus ring.
- Clicking an item updates the URL hash and scrolls smoothly unless reduced motion is requested.
- Scroll-spy updates `aria-current="location"` on the active link.

### 7.3 Tablet and mobile behavior

Below 992 px, remove the left rail and use a sticky single-line disclosure directly beneath the global header:

- Closed label: current section title plus a chevron.
- The bar becomes visible when the reader reaches the article body.
- Background: `color-mix(in srgb, var(--surface-color), transparent 4%)` with a bottom border.
- Expanded state: vertically scrollable list, capped so it never covers the entire viewport.
- Set `aria-expanded` and connect the button to the list using `aria-controls`.
- Close after a destination is chosen and return focus predictably.
- Mobile page gutter: 24 px; the body and headings use the full available content width.

## 8. Responsive Behavior

| Breakpoint | Layout |
| --- | --- |
| `>= 1200px` | Full hero scale, wide cover, 200 px sticky TOC, 720 px body |
| `992–1199px` | Same three-zone concept with a narrower TOC and gap |
| `768–991px` | Single reading column; sticky disclosure TOC; cover remains wide within container |
| `< 768px` | 24 px gutters, compact hero, stacked/wrapping utility row, all media width 100% |
| `< 576px` | H1 near 2.15 rem, reduced vertical gaps, code/table horizontal overflow |

Do not reduce body text below 16 px. Long titles must wrap naturally without manual `<br>` tags.

## 9. Color and Surface Treatment

- Keep the entire post in the site's dark theme; do not introduce the OpenAI page's white background.
- Use pure white only for primary headings and high-emphasis controls.
- Body copy uses `--default-color`; secondary copy uses `--post-muted`.
- Blue is reserved for active state, links, focus, and small emphasis—not large text panels.
- Cards and code blocks use `--surface-color`; nested surfaces should use `color-mix()` rather than unrelated grays.
- Dividers should be low contrast and structural, never ornamental.
- Avoid gradients except where already present in the CV identity, such as a very restrained accent underline.

## 10. Motion and Interaction

- Reuse AOS only for the initial hero/cover entrance if desired. Do not animate every paragraph.
- Maximum entrance duration: 500 ms; movement: 12–20 px.
- TOC active-state changes should use color/opacity transitions of 150–250 ms.
- Respect `prefers-reduced-motion: reduce` by disabling smooth scroll and entrance movement.
- Hover elevation belongs to related-post cards, not article text, headings, or the TOC.

## 11. Semantic HTML Blueprint

```html
<body class="post-page">
  <div id="site-menu"></div>

  <main id="main" class="main">
    <article class="post" aria-labelledby="post-title">
      <header class="post-hero container">
        <div class="post-meta" aria-label="Post information">
          <time datetime="YYYY-MM-DD">Month D, YYYY</time>
          <a href="blog.html?category=research">Research</a>
        </div>
        <h1 id="post-title" class="post-title">Post title</h1>
        <p class="post-dek">A concise summary of the post.</p>
      </header>

      <figure class="post-cover container">
        <img src="..." width="1600" height="900" alt="...">
        <figcaption>Optional caption and source.</figcaption>
      </figure>

      <div class="post-utility container">
        <p>By Dongjae Kwon · 8 min read</p>
        <button type="button" class="post-share">Share</button>
      </div>

      <div class="post-layout container">
        <nav class="post-toc" aria-label="Table of contents">
          <ol>
            <li><a href="#section-one" aria-current="location">Section one</a></li>
            <li><a href="#section-two">Section two</a></li>
          </ol>
        </nav>

        <div class="post-body">
          <p class="post-lead">Opening paragraph...</p>
          <section aria-labelledby="section-one">
            <h2 id="section-one">Section one</h2>
            <p>...</p>
          </section>
          <section aria-labelledby="section-two">
            <h2 id="section-two">Section two</h2>
            <p>...</p>
          </section>
        </div>
      </div>

      <footer class="post-end container">
        <ul class="post-tags" aria-label="Topics">...</ul>
        <aside class="post-author" aria-label="About the author">...</aside>
      </footer>
    </article>

    <section class="related-posts" aria-labelledby="related-title">...</section>
  </main>

  <footer id="footer" class="footer">...</footer>
</body>
```

## 12. Content Model

Each post should provide the following fields, whether content remains hand-authored HTML or later moves to a generator:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | One H1 only |
| `slug` | Yes | Lowercase, hyphen-separated, stable |
| `description` | Yes | Used as hero dek and meta description |
| `date` | Yes | ISO value in markup, human-readable display |
| `updated` | No | Show only when materially revised |
| `category` | Yes | One primary category |
| `tags` | No | Up to five |
| `cover` | Yes | Path, width, height, alt, optional caption |
| `readTime` | Yes | Calculated or maintained consistently |
| `headings` | Yes | Derived from H2 elements for the TOC |
| `canonicalUrl` | Yes | Used by SEO and share behavior |

## 13. Accessibility and SEO Requirements

- Exactly one H1; body hierarchy proceeds H2 → H3 without skipped levels.
- Include a visible-on-focus “Skip to main content” link.
- All informative images require meaningful alt text; decorative images use empty alt text.
- Captions and source attribution remain text, not baked into images.
- Keyboard users can reach every TOC and utility action with a visible focus state.
- Sticky UI must not obscure focused elements or anchor destinations.
- Text contrast must meet WCAG AA; do not use muted text for essential information if contrast fails.
- Set `<title>`, meta description, canonical URL, Open Graph/Twitter metadata, and article JSON-LD.
- Include published/modified dates in machine-readable form.
- Provide `aria-live="polite"` feedback when a link is copied.

## 14. Integration with the Current Repository

When this design is implemented:

1. Create a reusable post detail page rather than repurposing `portfolio-details.html`.
2. Keep shared header injection through `partials/menu.html` and `assets/js/menu.js`.
3. Add post styles as a clearly labeled `Blog Post` section in `assets/css/main.css`, using the existing variables.
4. Add only TOC scroll-spy, mobile disclosure, and share fallback behavior to `assets/js/main.js` or a dedicated `assets/js/post.js` if separation is clearer.
5. Replace the placeholder Blog dropdown entries in `partials/menu.html` with real post or index links once posts exist.
6. Let `news.html` link to posts only when a news item has long-form content; News and Blog remain distinct information types.

## 15. Acceptance Criteria

- The page unmistakably belongs to the current CV site: same global header, footer, fonts, palette, and blue accent.
- The title/summary hierarchy, wide lead media, and TOC/body relationship match the OpenAI reference's reading flow.
- Desktop body width stays readable and the TOC remains visible without covering content.
- Tablet/mobile replaces the left rail with a functional sticky disclosure.
- Every TOC item navigates to an H2 and the active item updates while scrolling.
- Long titles, Korean/English text, code blocks, tables, quotes, and wide media do not overflow at 390, 768, 1024, or 1440 px.
- Page remains readable and navigable with JavaScript disabled.
- No reference-site assets, logo treatments, or proprietary fonts are copied.
- Lighthouse accessibility target is at least 95, with no heading-order, contrast, or unlabeled-control errors.

## 16. Non-goals

- Reproducing OpenAI's entire navigation, footer, account controls, search, or product branding
- Adding audio narration without an actual audio pipeline
- Copying the reference article's interactive demo, testimonials, charts, or media
- Introducing a separate light theme solely for blog posts
- Building a CMS as part of the first post-detail implementation
