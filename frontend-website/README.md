# frontend-website

Angular app for StoreForge. Runs fully on **mock data** out of the box.

## Mock ↔ API switch
Edit `src/environments/environment.ts`:
- `useMocks: true`  → all data comes from `src/app/mock.ts` (no backend needed)
- `useMocks: false` → all data comes from the Laravel API (`/api/v1`, dev-proxied to http://localhost:8000)

## Run
```bash
npm install
npm start
```
