# Baby Registry

A mobile-friendly baby registry built with Vite, React, Tailwind and shadcn/ui.
Guests reserve gifts; each reservation is posted to a Google Form and the shared counts
come back from a Google Sheet (see `apps-script/README.md` for instant updates).

## Edit your content
- `src/data/items.ts`: items, prices, vendors, how many times each can be reserved (`qty`), "Most wanted".
- `src/config.ts`: Google Form / Sheet links and currency.
- `public/images/`: item photos (`name.webp` 800px and `name-400.webp` 400px).
  Give a replaced photo a new filename so browsers don't show the cached old one.

## Run it
```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Deploy (Netlify)
`netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`).
