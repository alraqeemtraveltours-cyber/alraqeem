# Al Raqeem Travel & Tours - Website

Full Next.js 14 website with Tailwind CSS. Mobile-first, SEO-ready, no backend required.

## Run it

```bash
npm install
npm run dev      # development at http://localhost:3000
npm run build    # production build
npm start        # run production build
```

## Edit your content (no coding needed)

All content lives in 4 files inside `lib/`:

| File | What it controls |
|---|---|
| `lib/site.ts` | Phone, WhatsApp, email, address, domain. EDIT THIS FIRST. |
| `lib/packages.ts` | All 12 packages, prices, highlights. Set `price: null` for "Contact for price". |
| `lib/cities.ts` | The 7 city landing pages. Copy a block to add a new city. |
| `lib/posts.ts` | Blog articles. Copy a block to add a new post. |

## Placeholders to replace before launch

1. `lib/site.ts`: phone `+92 300 0000000`, WhatsApp `923000000000`, email, exact office address
2. `lib/site.ts`: `url` once you buy your domain
3. `lib/packages.ts`: confirm real prices

## Pages included

- Home, Packages, Visa Services, About, Blog (3 articles), Contact
- 7 city landing pages: /areas/islamabad, /areas/lahore, /areas/rawalpindi, /areas/peshawar, /areas/charsadda, /areas/tangi, /areas/shabqadar
- Auto-generated sitemap.xml and robots.txt
- TravelAgency schema markup for Google local results

## How inquiries work

No backend or hosting database needed. The contact form and every "Get Quote" button opens WhatsApp with a pre-filled message sent straight to your business number. Works on mobile and desktop.

## Deploy free on Vercel

1. Push this folder to a GitHub repository
2. Go to vercel.com, import the repository, click Deploy
3. Add your custom domain in Vercel settings after you buy it

## Adding a new city page

Open `lib/cities.ts`, copy any city object, change the slug, name and text. The page, footer link, and sitemap entry are all generated automatically.
