# ModernWeb – Production-Ready SaaS Landing Template

A polished, responsive, and marketplace-ready landing page template built with HTML, TailwindCSS (CDN), and vanilla JavaScript. Ideal for SaaS, startups, agencies, and personal portfolios.

## Features

- Modern, responsive UI with smooth animations
- Dark mode toggle (sun/moon) and 3 color presets (Blue, Purple, Teal)
- JSON-driven content (brand, hero, features, pricing, testimonials)
- Sticky navbar with active-section highlight and smooth scroll
- CTA ripple effect, hover lift on pricing, and testimonial auto-slider (pause on hover)
- SEO meta tags, favicon, social preview (Open Graph)
- Lazy-loaded avatars and accessibility considerations
- One-click build: minifies assets and creates a ready-to-upload zip

## Tech Stack

- HTML5 + TailwindCSS (via CDN)
- Vanilla JavaScript (no frameworks)
- CSS variables + theme files (`themes/light.css`, `themes/dark.css`)

## Project Structure

```
modernweb/
 ├── index.html
 ├── styles.css
 ├── script.js
 ├── config.json
 ├── README.md
 ├── netlify.toml
 ├── vercel.json
 ├── assets/
 │   ├── logo.svg
 │   ├── favicon.ico (placeholder – replace)
 │   ├── screenshots/
 │   │   ├── hero.png (placeholder)
 │   │   ├── features.png (placeholder)
 │   │   ├── pricing.png (placeholder)
 │   │   ├── testimonials.png (placeholder)
 │   │   └── footer.png (placeholder)
 │   └── icons/ (add any extra SVG/PNG icons here)
 ├── themes/
 │   ├── light.css
 │   └── dark.css
 ├── docs/
 │   └── usage-guide.html
 ├── dist/               (generated – minified build)
 ├── build.js            (Node build script)
 └── package.json        (build dependencies)
```

## Quick Start

1. Open `index.html` directly in your browser, or serve locally:
   - VS Code Live Server, `python -m http.server`, or any static server
2. Edit `config.json` to customize brand, hero text, features, pricing, and testimonials
3. Toggle dark mode and switch color presets (Blue/Purple/Teal) from the navbar

Note: When opened via `file://`, some browsers block `fetch('config.json')`. The template gracefully falls back to inline JSON. Serving over `http://` is recommended for live editing of `config.json`.

## Customization

- Content: Edit `config.json` (brand, tagline, description, features, pricing, testimonials)
- Colors: Use the navbar color preset dropdown (Blue, Purple, Teal). Persisted via `localStorage`.
- Dark Mode: Toggle from the navbar; persisted via `localStorage`.
- Assets: Replace `assets/logo.svg`, `assets/favicon.ico`, and images under `assets/screenshots/`.

## Deployment

### Netlify
- `netlify.toml` is included. Publish directory: `dist`
- Build command: `npm run build`

### Vercel
- `vercel.json` is included for static export.
- Import the project and set output to `dist` after running the build.

### GitHub Pages / Any static host
- Run the build, then upload the `dist/` folder contents.

## Build & Packaging

Requirements: Node 18+

```
cd modernweb
npm install
npm run build
```

What it does:
- Minifies HTML/CSS/JS into `dist/`
- Copies assets, themes, and docs
- Optionally compiles Tailwind if the CLI is available (for full purge)
- Creates `modernweb-v1.0.zip` ready for marketplace upload

Purge Tailwind Notes:
- This template uses Tailwind via CDN for easy previewing. For maximum performance, consider compiling Tailwind locally and purging unused classes with the Tailwind CLI. The build script detects `tailwindcss` if available and will generate a minimized CSS automatically; otherwise it keeps the CDN.

## Accessibility & SEO

- Proper landmarks and headings
- Focus outlines and keyboard navigation
- Meta description, keywords, and Open Graph tags
- Preconnect for Google Fonts

## Credits

- TailwindCSS (CDN)
- Font Awesome Icons
- Google Fonts (Inter)

## License

This template is free for personal and commercial use. Attribution appreciated but not required. Replace placeholder images before redistribution.

