# Institute Website (React)

Light-theme institute website with a glass navbar, a 3D hero scene, gooey blob buttons and
framer-motion animations. All 13 sections are React components.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Where to edit

| What | File |
| --- | --- |
| Institute name, tagline, deadline | `src/data.js` → `SITE` |
| Programs, courses, FAQs, reviews, fees | `src/data.js` |
| Colours, fonts, spacing tokens | `src/styles/sections.css` → `:root` |
| Navbar, blob buttons, hero 3D, ticker | `src/styles/core.css` |
| Hero 3D scene (panel, orbit chips, floating cards) | `src/sections/Hero.jsx` |
| Logo | `Logo` in `src/sections/Header.jsx` |

## Structure

```
src/
  main.jsx            entry (MotionConfig respects reduced-motion)
  App.jsx             page order, mobile bottom bar
  ctx.jsx             toast + selected-program state
  data.js             all content
  icons.js            inline SVG icon paths
  ui/                 BlobButton, Reveal/Stagger/Card/TiltCard, SectionHead, Icon
  sections/           Header, Hero, Programs, Courses, Students, HowItWorks,
                      Projects, Partners, Certificates, Blogs, Corner, Work,
                      Apply, Footer
  styles/             sections.css (layout + tokens), core.css (glass, blob, 3D)
```

## Notes

- Fees, dates, names, reviews and certificate IDs are **sample content**. Replace them before launch.
- Partner logo slots stay empty until a partner gives written permission.
- The application form and certificate check are front-end demos. Connect them to your API
  (for example your .NET 9 backend) in `Apply.jsx` and `Certificates.jsx`.
- Links marked as demo show a toast. Replace `onClick={demo}` with real routes when pages exist.
- Blob buttons use an SVG filter (`GooFilter` in `BlobButton.jsx`), rendered once in `App.jsx`.
