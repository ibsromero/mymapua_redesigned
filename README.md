# mymapua_redesigned

## Deploy on Vercel

This is a static site, so it does not require a build command or environment variables.

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