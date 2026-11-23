# The AppSec Dispatch: portfolio website

Static site: plain HTML, CSS and JavaScript, no build step and no frameworks.

```
docs/                           the published site (only this folder is served)
  index.html                      all page content
  css/styles.css                  all styling
  js/config.js                    settings you edit (chat agent IDs, experience dates, starter questions)
  js/script.js                    page behaviour
  assets/portrait-westminster.jpg front-page photo
README.md                       repo docs, deliberately outside docs/ so it is not served
```

## Run locally
Any static server works, for example `python3 -m http.server 8080 --directory docs`, then open http://localhost:8080.
Opening `docs/index.html` directly from disk also works.

## Deploy (GitHub Pages)
1. Push the repo to `vizkov/portfolio`. The site lives in `docs/`, so `README.md` and anything else at the root is not published.
2. Repo **Settings → Pages**: deploy from branch `main`, folder `/docs`. Do not choose `/ (root)`, or `README.md` gets served.
3. Optional custom domain: add it under Pages, and add the same domain to the Dialogflow Messenger allowlist.

Netlify, Cloudflare Pages and Vercel work the same way: set the publish directory to `docs`, with no build command.

## What the JavaScript does
| Feature | Where |
|---|---|
| "Vol. VI · No. 6": years · months of experience, updates monthly | `config.js` → `experience` |
| Expand/collapse: record entries, case studies, features, skill groups | `script.js` |
| `#F-01` … links (stat tiles, chat) open the case study, then scroll to it | `script.js` → `goTo` |
| Floating "In this edition" index: highlights the current section and splits across page breaks | `script.js` → `mark` |
| Headline lines sized to the full column width | `script.js` → `fit` |
| Fade-in on scroll (off when the visitor prefers reduced motion) | `script.js` → `reveal` |
| Chat assistant | see below |

## Chat assistant ("Ask the Dispatch")
- **Placeholder IDs (`YOUR_…`) in `config.js`:** a built-in panel shows the starter questions from `config.starters`. Each answer links to one or more sections.
- **Real Dialogflow CX `projectId` and `agentId`:** the page loads Google's Messenger widget and the built-in panel is removed once it registers. If Google's script fails to load, the built-in panel stays.

The live widget only works on the domains allowed in the agent's Messenger settings. See the GitHub issues for the rest of the integration work.

## Editing content
- **Text:** edit `docs/index.html` directly.
- **Styling:** classes named `x1`, `x2`, … were generated from the design and live in `docs/css/styles.css`. Hand-written rules (chat, reveal, print) are at the end of that file.
- **Expandable sections:** these are marked with `data-js="…"` attributes. Keep those attributes when editing, or the toggles stop working.

## Security headers (recommended)
The site uses no inline scripts or inline `style` attributes, so a strict policy works:

```
Content-Security-Policy: default-src 'self';
  script-src 'self' https://www.gstatic.com;
  style-src 'self' https://fonts.googleapis.com https://www.gstatic.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://dialogflow.googleapis.com https://*.googleapis.com;
  frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Notes on this policy:
- **Without the chat widget:** remove the gstatic and googleapis entries.
- **Before relying on it:** check the browser console once the live widget is connected. Google's widget may need extra hosts.
- **On GitHub Pages:** you can't set response headers there. Use a `<meta http-equiv="Content-Security-Policy">` tag (`frame-ancestors` is ignored in a meta tag), or host on Netlify or Cloudflare Pages.
