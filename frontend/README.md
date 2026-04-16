# frontend/

React + Vite + Tailwind CSS frontend for AutoAgent Studio. Styled with a
custom **Neon Noir** dark theme.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| HTTP | Axios |
| Real-time | Native WebSocket API (wrapped in `useWebSocket`) |
| PDF export | `html2pdf.js` |

## Running locally

```bash
npm install
cp .env.example .env   # set VITE_API_URL if not using localhost:8000
npm run dev
```

Frontend runs at http://localhost:5173 and expects the backend at
http://localhost:8000.

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Environment variables

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Vite only exposes variables prefixed with `VITE_` to client code.

## Source layout

See `src/` for the code. Every subfolder there has its own `README.md`
explaining what lives inside.
