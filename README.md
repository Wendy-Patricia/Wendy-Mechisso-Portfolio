# Wendy Patrícia - Portfolio

A static, responsive developer portfolio based on the provided portfolio brief.

## Structure

- `index.html` - homepage
- `about.html` - independent French biography, linked from every page’s navigation
- `about.css` / `about.js` - biography layouts and optional motion; shared visual identity and mobile menu remain in `style.css` / `script.js`
- `projects.html` - project archive with filters
- `projects/` - individual project case-study pages
- `style.css` - visual system and responsive layout
- `script.js` - mobile navigation, filters and small draggable workspace
- `translations.js` - French/English translations shared by all pages

## Languages

French is the default language in every HTML page, including without JavaScript. The header's EN/FR button switches the page language and remembers the selection in local storage when available. To edit translated copy, update the French HTML text and its matching French/English pair in `translations.js`. Keep technical names and code examples unchanged.

The biography is intentionally written entirely in French and has no language toggle. It retains French regardless of the language selected on the other pages. Its chapter links and content also work without JavaScript; motion respects the visitor’s reduced-motion preference.

## Before publishing

Replace the placeholder contact links:

- `your-email@example.com`
- GitHub URL
- LinkedIn URL

Replace each project placeholder visual with a real screenshot, diagram, image or code excerpt when available.

Complete the case-study text with the actual context, contribution, architecture, challenges, result and lessons for each project. The template intentionally avoids inventing results.

## Run locally

Open `index.html` directly in a browser, or serve the folder with a local HTTP server.

For example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.


### Project links

Each project case-study has two editable links: **Live Site** and **GitHub**. Replace the `href="#"` value with the real URL for that project. If one does not exist, remove that link rather than using a fake URL.
