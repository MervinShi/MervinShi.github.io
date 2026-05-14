# DESIGN.md — Mervin Shi Personal Site

> A premium-minimalist design system blending Apple refinement with modern developer aesthetics.
> Inspired by awesome-design-md format | Google Stitch DESIGN.md compatible

---

## 1. Visual Theme & Atmosphere

**Design Philosophy:** "Technical precision meets human warmth"
- Clean, spacious layouts that let content breathe
- Dark cinematic hero with interactive canvas for immediate visual impact
- Frosted glass navigation and cards for depth without heaviness
- Subtle animations that feel purposeful, never decorative
- East-meets-West typography blending (SF Pro + custom Chinese calligraphic font)

**Atmosphere keywords:** Premium, confident, warm, precise, cinematic, approachable

---

## 2. Color Palette & Roles

### Light Theme (Primary)
| Token | Hex | Role |
|-------|-----|------|
| `--color-bg-primary` | `#ffffff` | Page background |
| `--color-bg-secondary` | `#f5f5f7` | Alternate section background |
| `--color-bg-tertiary` | `#fafafa` | Card background on secondary |
| `--color-bg-elevated` | `#ffffff` | Elevated card surface |
| `--color-bg-glass` | `rgba(255,255,255,0.72)` | Frosted glass background |
| `--color-text-primary` | `#1d1d1f` | Primary text |
| `--color-text-secondary` | `#6e6e73` | Secondary/muted text |
| `--color-text-tertiary` | `#aeaeb2` | Placeholder/disabled text |
| `--color-accent` | `#0071e3` | Primary accent (Apple blue) |
| `--color-accent-hover` | `#0077ed` | Accent hover state |
| `--color-accent-subtle` | `rgba(0,113,227,0.08)` | Subtle accent background |
| `--color-gradient-accent` | `linear-gradient(135deg, #0071e3, #5e5ce6)` | Accent gradient |
| `--color-border` | `#d2d2d7` | Standard border |
| `--color-border-light` | `rgba(0,0,0,0.06)` | Subtle border |
| `--color-success` | `#30d158` | Success states |
| `--color-warning` | `#ff9f0a` | Warning states |

### Dark Accent (Hero, Stats, Footer)
| Token | Hex | Role |
|-------|-----|------|
| `--color-dark-bg` | `#0a0a0f` | Dark section background |
| `--color-dark-surface` | `#16161a` | Dark elevated surface |
| `--color-dark-text` | `#ffffff` | Text on dark |
| `--color-dark-text-secondary` | `rgba(255,255,255,0.65)` | Muted text on dark |
| `--color-dark-accent` | `#5e9eff` | Accent on dark backgrounds |

### Photography/Emotion Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-warm-amber` | `#ff9f43` | Warm accent for interest cards |
| `--color-cool-teal` | `#00b4d8` | Cool accent for tech cards |
| `--color-soft-rose` | `#ff6b6b` | Accent for creative cards |

---

## 3. Typography Rules

### Font Families
```css
--font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
--font-mono: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;
--font-calligraphic: 'MingMeiXiangChunTian', cursive; /* Chinese name display */
```

### Type Scale (Root: 16px)
| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Hero Name | clamp(48px, 8vw, 96px) | 400 (calligraphic) | 1.1 | 0.02em | Hero name display |
| Display | 56px | 600 | 1.07143 | -0.005em | Section titles |
| H2 | 40px | 600 | 1.1 | -0.003em | Card titles |
| H3 | 24px | 600 | 1.2 | -0.003em | Subsection headers |
| H4 | 21px | 600 | 1.3 | -0.01em | Subsection labels |
| Body L | 21px | 400 | 1.47059 | -0.022em | About text |
| Body | 17px | 400 | 1.47059 | -0.022em | Standard body |
| Body S | 15px | 400 | 1.5 | -0.01em | Secondary descriptions |
| Caption | 14px | 500 | 1.4 | -0.01em | Tags, labels |
| Small | 12px | 400 | 1.4 | -0.01em | Metadata, footer |

---

## 4. Component Stylings

### Navigation
- **Height:** 52px (desktop), 52px (mobile)
- **Background:** `rgba(255,255,255,0.8)` with `backdrop-filter: saturate(180%) blur(20px)`
- **Border-bottom:** `1px solid rgba(0,0,0,0.05)`
- **Logo:** 21px, weight 600, letter-spacing -0.03em
- **Links:** 12px, weight 400, opacity 0.8 (hover: opacity 1, accent color)
- **Active indicator:** 4px dot below link
- **Mobile:** Hamburger menu with slide-out drawer

### Buttons
- **Primary:** White bg on dark hero, accent bg on light. Border-radius: 980px (pill), padding: 12px 28px, font-size: 17px
- **Hover:** scale(1.02), enhanced shadow
- **Secondary:** Transparent with 2px border, border-color fades on hover
- **Active:** scale(0.98)

### Cards (Project, Education, Interest)
- **Border-radius:** 18px (medium), 24px (large)
- **Background:** white
- **Shadow (rest):** `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)`
- **Shadow (hover):** `0 20px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.12)`
- **Hover transform:** translateY(-6px)
- **Transition:** all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)
- **Border:** 1px solid var(--color-border-light) at rest, transparent on hover

### Tags
- **Padding:** 4px 12px (small), 8px 18px (large/skill tag)
- **Border-radius:** 20px (small), 24px (large)
- **Background:** var(--color-bg-secondary)
- **Color:** var(--color-accent)
- **Hover:** background becomes accent, text becomes white

### Glass Surface
- **Background:** `rgba(255,255,255,0.72)`
- **Backdrop-filter:** `saturate(180%) blur(20px)`
- **Border:** `1px solid rgba(0,0,0,0.06)`

---

## 5. Layout Principles

### Spacing Scale
```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
2xl: 72px
3xl: 96px
4xl: 140px
```

### Container
- **Max-width:** 980px (content), 1200px (gallery)
- **Padding:** 22px (desktop), 16px (mobile)

### Section
- **Padding:** 140px top/bottom (desktop), 80px (mobile)
- **Alternate sections:** use --color-bg-secondary for visual rhythm

### Grid
- **Projects/Interests:** auto-fit, minmax(300px, 1fr), gap: 28px
- **Stats:** 4 columns (desktop), 2 columns (mobile)

### Hero
- **Min-height:** 100vh
- **Content:** vertically centered, text-align: center
- **Canvas overlay:** absolute positioned behind content, z-index: 0
- **Scroll indicator:** bottom 40px, centered

---

## 6. Depth & Elevation

### Shadow System
| Level | Value | Usage |
|-------|-------|-------|
| 0 | none | Flat surfaces, section backgrounds |
| 1 | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` | Cards at rest |
| 2 | `0 4px 6px rgba(0,0,0,0.04), 0 12px 16px rgba(0,0,0,0.08)` | Cards, sticky nav |
| 3 | `0 10px 15px rgba(0,0,0,0.05), 0 24px 38px rgba(0,0,0,0.12)` | Dropdowns, tooltips |
| 4 | `0 20px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.12)` | Cards on hover, modals |

### Surface Layers (z-index)
```
0: Content
10: Gallery navigation buttons
100: Sticky navigation
200: Dropdown menus, lightbox overlay
300: Modal dialogs, lightbox content
```

---

## 7. Do's and Don'ts

### Do
- Use generous whitespace — "less is more"
- Let background images be dark/moody with overlay gradient for text readability
- Keep transitions smooth (0.3s–0.5s) with cubic-bezier easing
- Use frosted glass sparingly — navigation and hero only
- Maintain 1.47 line-height for body text readability
- Use semantic color tokens, never raw hex values in components
- Animate on scroll entrance with subtle translateY

### Don't
- Don't use box-shadow on glass surfaces (it breaks the effect)
- Don't exceed 980px content width except for gallery (1200px)
- Don't use pure black (`#000`) — use `#1d1d1f`
- Don't animate elements that user has `prefers-reduced-motion` set
- Don't use more than 2 typeface families per section
- Don't make buttons rectangular — always use 980px border-radius (pill)
- Don't use text-shadow except on hero dark overlay

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Adjustments |
|------|-------|-------------|
| Mobile S | < 480px | Single column, smaller type, stacked nav |
| Mobile | < 768px | Collapsed nav (icon-only), reduced section padding |
| Tablet | 768–1024px | Full nav, 2-column grids, adjusted type scale |
| Desktop | > 1024px | Full layout, max-width containers |

### Mobile-Specific Rules
- Navigation: hide text links, show hamburger menu
- Hero title: minimum 32px (calligraphic font scales down)
- Section titles: 28px (from 56px)
- Gallery items: reduce size by ~30%
- Stats: 2×2 grid instead of 4 columns
- Touch targets: minimum 44×44px
- Reduce shadow complexity for performance

### Touch & Interaction
- All interactive elements: min 44px tap target
- Use passive event listeners for scroll/touch
- Gallery: support swipe gestures
- Lightbox: tap outside to close

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Background: #ffffff → #f5f5f7 → #fafafa
Text: #1d1d1f → #6e6e73 → #aeaeb2
Accent: #0071e3 → #0077ed (hover) → rgba(0,113,227,0.08) (subtle)
Dark: #0a0a0f → #16161a → #ffffff (text)
```

### Build Instructions
1. Read DESIGN.md first for complete visual specification
2. Use CSS custom properties defined in :root for all colors, spacing, typography
3. Implement frosted glass with backdrop-filter (provide fallback for unsupported browsers)
4. Follow the type scale precisely — never ad-hoc font sizes
5. All cards follow the same shadow/hover pattern defined in section 4
6. Dark hero section receives special treatment: canvas animation + gradient overlay
7. Test against reduced-motion preference before shipping
8. Validate mobile breakpoints and touch targets before completion
