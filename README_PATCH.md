# Horse Selling Project — Patch (CJS/ESM Fix)

This patch fixes the CommonJS vs ESModule conflicts and provides a working backend + PostCSS config.

## What’s included
- `package.json` → backend script now runs `src/backend.cjs`
- `src/backend.cjs` → CommonJS backend (Express + sqlite3 + CORS)
- `postcss.config.cjs` → PostCSS config as CommonJS (so it works with `"type": "module"`)
- `vite.config.ts` → (optional) proxy `/characters` to `http://localhost:3001`

## How to apply
1. Backup your project.
2. Copy the files into your project root, keeping the same paths:
   - `package.json` (replace your existing one **or** merge the `scripts` if you have extras)
   - `src/backend.cjs`
   - `postcss.config.cjs`
   - `vite.config.ts` (optional)
3. Remove/rename old conflicting files if they exist:
   - `src/backend.js` → remove/rename (we now use `src/backend.cjs`)
   - `postcss.config.js` → remove/rename to `.cjs` (already provided)
   - If you have `tailwind.config.js` using `module.exports`, rename it to `tailwind.config.cjs`
4. Install deps (if not installed): `npm i`
5. Start dev:
   ```bash
   npm run dev
   ```

## Notes
- With `"type": "module"` in `package.json`, `.js` files are ESM by default. CommonJS must use the `.cjs` extension.
- The backend runs on port `3001`. Frontend (Vite) runs on port `5173` and proxies `/characters` to the backend.
- If you are using Tailwind, uncomment the PostCSS plugins and ensure you have the packages installed:
  ```bash
  npm i -D tailwindcss autoprefixer
  ```

Good luck!
