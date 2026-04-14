# Design System Document: Technical Monochrome Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Monolith"**

This design system rejects the cluttered, "noisy" aesthetic of traditional e-commerce. Instead, it adopts the persona of a high-end digital curator. The goal is to treat technology products as pieces of art. We move beyond the "template" look by utilizing **intentional asymmetry**, massive **typographic scales**, and **tonal layering**. 

By stripping away the crutch of color, we rely on the purity of form, the rhythm of whitespace, and the precision of "sharp-edge" geometry. The experience should feel like walking through a high-end gallery: quiet, expensive, and authoritative.

---

## 2. Colors & Surface Philosophy
The palette is a disciplined study in monochrome. We utilize the Material Design naming convention to map depth through tonal shifts rather than chroma.

### The "No-Line" Rule
**Borders are forbidden for sectioning.** To separate a product grid from a hero section, do not use a 1px line. Instead, shift the background from `surface` (`#f9f9f9`) to `surface-container-low` (`#f3f3f3`). Definition is achieved through "blocks of tone," creating a seamless, architectural flow.

### Surface Hierarchy
*   **Base Layer:** `surface` (#f9f9f9) – Used for the primary canvas.
*   **The Inset:** `surface-container` (#eeeeee) – Used for secondary content areas.
*   **The Elevation:** `surface-container-lowest` (#ffffff) – Used for interactive cards to create a "lifted" appearance against the greyish base.

### The "Glass & Gradient" Rule
While the system is flat in principle, "soul" is added through technical textures. 
*   **Glassmorphism:** Use `surface_container_lowest` at 70% opacity with a `24px` backdrop blur for floating navigation bars.
*   **Technical Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#000000) to `primary_container` (#3b3b3b) at a 135-degree angle. This prevents "black holes" in the UI and adds a metallic, machined sheen.

---

### 3. Typography
We use **Inter** as the sole typeface. Its geometric neutrality aligns with the "tech-import" identity. 

*   **Display (The Statement):** `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) and heavy weights. Use this for product names to create an editorial, magazine-like header.
*   **Headlines (The Anchor):** `headline-md` (1.75rem) serves as the primary section anchor. Always ensure ample padding-top (at least 80px) to let the headline breathe.
*   **Body (The Information):** `body-md` (0.875rem) is our workhorse. Use `on_surface_variant` (#474747) for descriptions to reduce visual vibration against the white background.
*   **Labels (The Metadata):** `label-sm` (0.6875rem) should always be Uppercase with +0.05em letter spacing. This conveys a "technical spec" or "serial number" aesthetic.

---

## 4. Elevation & Depth
Depth is not a shadow; depth is a layer.

*   **The Layering Principle:** To highlight a "Featured Import," place a `surface-container-lowest` (#ffffff) card inside a `surface-container-high` (#e8e8e8) section. The contrast creates natural focus.
*   **Ambient Shadows:** If a product must "float" (e.g., a Quick-Buy modal), use a shadow: `0px 24px 48px rgba(26, 28, 28, 0.06)`. It should be nearly invisible, felt rather than seen.
*   **The "Ghost Border" Fallback:** If a UI element (like an input field) risks disappearing, use a "Ghost Border": `outline_variant` (#c6c6c6) at 20% opacity. 

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#000000) background, `on_primary` (#e2e2e2) text. Corner radius: `sm` (0.125rem). The sharp corners communicate precision.
*   **Secondary:** Ghost style. No fill. `outline` (#777777) at 30% opacity. 
*   **Tertiary:** Text only, `label-md` bold, with a 2px underline that only appears on hover.

### Input Fields
*   **Styling:** No background fill. A bottom-only border using `outline_variant`. 
*   **State:** When focused, the bottom border transitions to `primary` (#000000) and the label (using `label-sm`) shifts upwards.

### Cards & Lists
*   **The "No-Divider" Mandate:** Never use horizontal rules (`<hr>`) between list items. Use 24px of vertical whitespace or a alternating subtle background shift (`surface` to `surface_container_low`).
*   **Product Cards:** Use `surface_container_lowest` with a `none` (0px) or `sm` (0.125rem) corner radius. Images should be desaturated by 5% to maintain the monochrome harmony until hover.

### Signature Component: The "Spec-Sheet" Chip
For tech specs (e.g., "5NM CHIP", "8K RES"), use a chip with `surface_container_highest` background and `label-sm` typography. This reinforces the "Import/Wholesale" technical nature of the brand.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left while keeping product images slightly offset to the right. It feels intentional and "designed."
*   **Use Massive Margins:** If you think there is enough whitespace, double it. High-end e-commerce is about the luxury of space.
*   **Use Tonal Shifts:** Always use `surface-container-low` for page backgrounds to make white content cards "pop."

### Don't:
*   **No Rounded Corners:** Avoid `xl` or `full` rounding. It feels too "friendly" and consumer-grade. Stay within `none` to `md`.
*   **No High-Contrast Borders:** Never use a 100% black border around a box. It breaks the "monolith" feel and creates visual clutter.
*   **No Pure Grey Text on White:** Avoid `#777777` for long-form body text; it fails accessibility. Use `on_surface` (#1a1c1c) and rely on size for hierarchy.