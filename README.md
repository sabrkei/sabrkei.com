# GBG-Web Portfolio

A modern, responsive portfolio website for Scott, a front-end developer and designer based in Gothenburg, Sweden.

## Overview

This is a single-page portfolio application built with Vue 3, featuring an app-like interface with a dock navigation system, smooth transitions, and a clean dark mode aesthetic.

## Tech Stack

- **Vue 3** - Reactive UI framework (via CDN, production build)
- **Formspree** - Contact form handling
- **CSS3** - Custom styling with CSS variables for theming
- **Font Awesome 6** - Icon library
- **Google Fonts** - Lora & Montserrat typefaces

## Features

- **App Dock Navigation** - Intuitive icon-based navigation menu
- **SPA Architecture** - Seamless section transitions without page reloads
- Fully responsive design (mobile-first)
- Functional contact form via Formspree
- Native PDF CV viewer (no third-party dependencies)

## Performance Optimizations

- **LCP Optimized**: Hero poster preloaded with `fetchpriority="high"`
- **Lazy Loading**: Below-fold images use `loading="lazy"` and `decoding="async"`
- **Font Loading**: Google Fonts loaded asynchronously with print media swap
- **PDF Compatibility**: Google Docs Viewer for consistent mobile rendering
- **Minimal Dependencies**: Only essential external resources
- **WebP Images**: All images in modern WebP format
- **Deferred Scripts**: Vue and app scripts use `defer` attribute
- **Preconnect**: Critical external domains preconnected

## Project Structure

```
├── index.html          # Main HTML file with Vue app
├── style.css           # All styles with CSS variables
├── script.js           # Vue 3 application logic
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── robots.txt          # SEO crawler directives
├── sitemap.xml         # SEO sitemap
├── CNAME               # GitHub Pages custom domain
│
├── images/             # All image assets (WebP format)
│   ├── gbg-web.webp
│   ├── profilephoto.webp
│   ├── hero-poster.webp
│   ├── thedailygrindlogo.webp
│   ├── unitedbysound.webp
│   ├── footballstatshublogo.webp
│   ├── nyds.webp
│   └── locksafe_cinema-1.webp
│
├── videos/
│   ├── hero.mp4        # Hero section background video
│   └── family.mp4      # About section video
│
├── audio/
│   └── switch.mp3      # Theme toggle sound effect
│
└── assets/
    └── SAKCV.pdf       # Resume/CV document
```

## Sections

1. **Home** - Hero screen with app dock
2. **Portfolio** - List view of personal and client projects
3. **About Me** - Personal story with split-screen video layout
4. **Stack & CV** - Technical skills grid and embedded PDF CV
5. **Contact** - Integrated contact form

## Getting Started

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build step required - all dependencies loaded via CDN

### Contact Form Setup

The contact form uses [Formspree](https://formspree.io) for handling submissions:
1. Create a free account at formspree.io
2. Create a new form and copy the endpoint
3. Update the `FORMSPREE_ENDPOINT` in `script.js`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

### Adding Projects

Edit the `projects` or `customerProjects` arrays in `script.js`:

```javascript
{
  title: "Project Name",
  description: "Brief project description.",
  image: "images/project-image.webp",
  link: "https://github.com/..."
}
```

## SEO Features

- Meta description and keywords
- Open Graph tags for social sharing
- Twitter Card meta tags
- JSON-LD structured data (Person schema)
- Semantic HTML with ARIA labels
- robots.txt & sitemap.xml
- Canonical URL

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators for keyboard users
- Reduced motion support via `prefers-reduced-motion`
- Minimum tap target sizes (48px)
- Screen reader optimized with `.sr-only` class

## Contact

- Email: contact@gbg-web.com
- Website: [gbg-web.com](https://gbg-web.com)
- LinkedIn: [scottabrahamkeinstrom](https://www.linkedin.com/in/scottabrahamkeinstrom/)
- GitHub: [sabrkei](https://github.com/sabrkei)

## License

All rights reserved.
