# am-i-real.art

A website project built with [Astro](https://astro.build/), featuring:

- Server-Side Rendering (SSR)
- Astro DB (local and remote via Turso)
- Deployment via Vercel
- Internationalization (i18n)

---

## 🚀 Project Structure

```text
/
├── public/
│   └── _redirects        (Redirect rules)
├── src/
│   ├── layouts/          (Page layouts)
│   ├── pages/            (Localized pages, e.g., [locale]/test.astro)
│   ├── lib/              (Database connection)
├── db/
│   ├── config.ts         (Astro DB schema)
│   └── seed.ts           (Development seed data)
├── package.json
├── astro.config.mjs
├── .env                  (Environment variables)
```

---

## 🧑‍💻 Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

- A local SQLite database (`.astro/content.db`) is automatically created.
- Seed data is inserted for development.

---

## 🌍 Deployment

Deployment is handled via [Vercel](https://vercel.com/).

- **Production Branch:** `main`
- **Staging Branch:** `stage`
- **Remote Database:** Turso (libSQL-compatible)

### Environment Variables on Vercel:

- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

The build script uses `astro build --remote` to connect to the remote database during production builds.

---

## 📦 Common Commands

| Command              | Description                      |
|:---------------------|:---------------------------------|
| `npm install`         | Install dependencies             |
| `npm run dev`         | Start local development server   |
| `npm run build`       | Build for production             |
| `npm run preview`     | Preview the production build     |

---
