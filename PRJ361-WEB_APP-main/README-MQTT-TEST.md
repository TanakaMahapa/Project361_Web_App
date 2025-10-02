# MQTT + MongoDB Integration

- Start MongoDB (local or remote) and set `MONGODB_URI` for the backend.
- Backend: `cd server && cp .env.example .env && npm i && node src/index.js`
- Frontend: `cd PRJ361-WEB_APP-main && cp .env.example .env && npm i && npm run dev`
- The frontend fetches `/api/record/latest` via Vite proxy.
- MQTT broker URL for the browser is configurable with `VITE_MQTT_URL`.
