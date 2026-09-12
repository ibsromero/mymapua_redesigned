# mymapua_redesigned

## Deploy on Vercel or Render

This is a static site, so it does not require a build command or environment variables.

### Render dashboard

Create a **Static Site** connected to `ibsromero/mymapua_redesigned`:

- Branch: `main`
- Build command: leave empty
- Publish directory: `.`

If the Render service was created as a **Web Service** instead, use `npm start` as the start command and leave the build command empty. The included start script listens on Render's `$PORT`.

## Project structure

- `index.html`, `styles.css`, and `script.js` are the Vercel entrypoint and frontend.
- `assets/` contains deployable visual assets.
- `data/mds/` contains the legacy source records used for the prototype content.
- `reference/` contains design reference material and is excluded from deployment.
- `scripts/` contains development-only tooling such as the Playwright visual checker.

## Local development

Start the static preview server:

```sh
npm run preview
```

Generate desktop and mobile screenshots for every route in both themes:

```sh
npm run visual-check
```

### Vercel dashboard

1. Open [vercel.com/new](https://vercel.com/new).
2. Import the `ibsromero/mymapua_redesigned` repository.
3. Leave Framework Preset as `Other`.
4. Leave Build Command and Output Directory empty.
5. Select **Deploy**.

The project entrypoint is `index.html`. Navigation uses URL hash routes, so no server-side route configuration is needed.

### Vercel CLI

From the project directory:

```sh
npx vercel
```

For a production deployment:

```sh
npx vercel --prod
```