# Troubleshooting: Backend Not Running or API Not Working

If you cannot add or retrieve articles from the backend (via frontend or curl), check the following common issues:

## 1. Backend Server Not Running (Port Conflict)
- **Symptom:**
  - `curl: (7) Failed to connect to localhost port 3001 after 1 ms: Connection refused`
  - `Error: listen EADDRINUSE: address already in use :::3001` (or 3002)
- **Root Cause:**
  - The backend server cannot start because the port is already in use by another process (often a stuck or zombie process).
- **Solution:**
  - Reboot your machine to free all ports and processes.
  - Or, kill all Node.js processes: `pkill -9 node`
  - Then start the backend: `export PORT=3002 && yarn workspace track-my-show-backend dev`

## 2. API Route Mounting (Now Fixed)
- **Symptom:**
  - All `/api/*` requests return a static message, not real data.
- **Root Cause:**
  - A placeholder `/api` route blocked real endpoints.
- **Solution:**
  - The code now mounts real article routes at `/api/articles` in `src/app.ts`.

## 3. Frontend Cannot Connect to Backend
- **Symptom:**
  - Frontend shows errors or blank data for articles.
- **Root Cause:**
  - Backend is not running, so all API calls fail.
- **Solution:**
  - Ensure backend is running and accessible at the correct port.

## 4. Additional Checks
- **CORS:** Ensure backend CORS allows your frontend origin.
- **API URL:** Ensure frontend is configured to use the correct backend URL/port.

---

## Current Backend Setup (as of latest code)
- Real article routes are mounted at `/api/articles`.
- Placeholder `/api` handler has been removed.
- Use `export PORT=3002` to run backend on port 3002 if 3001 is blocked.
- To start backend:
  ```bash
  export PORT=3002
  yarn workspace track-my-show-backend dev
  ```
- Health check: [http://localhost:3002/health](http://localhost:3002/health)

If you still have issues after following these steps, reboot your machine and try again.

---

# TrackMyShow Backend

## Express App Structure & Middleware (Current Work)

This backend is built with Express and TypeScript, following a modular structure for scalability and maintainability. The main application logic is in `src/app.ts`.

### Middleware & Security
- **Helmet**: Secures HTTP headers.
- **CORS**: Allows cross-origin requests from the frontend (default: `http://localhost:5174`).
- **Rate Limiting**: Limits API requests to prevent abuse (100 requests per 15 minutes per IP).
- **Morgan**: Logs HTTP requests using a custom logger.
- **Body Parsers**: Supports JSON and URL-encoded payloads (up to 10MB).

### Health Check
- `GET /health`: Returns server status, timestamp, and uptime.

### API Routes
All API endpoints are prefixed with `/api/`:
- `POST /api/auth/*` — Authentication endpoints
- `GET/POST /api/users/*` — User management (protected)
- `GET/POST /api/articles/*` — Article management
- `GET/POST /api/events/*` — Event management
- `GET/POST /api/organizers/*` — Organizer management (protected)
- `GET/POST /api/venues/*` — Venue management (protected)
- `GET/POST /api/bookings/*` — Booking management (protected)
- `POST /api/upload/*` — File upload (protected)

> **Note:** Protected routes require authentication middleware (`authMiddleware`).

### Error Handling
- **404 Handler**: Returns a JSON error for unknown routes.
- **Global Error Handler**: Catches and formats all errors as JSON responses.

### Extensibility
- All middleware and route handlers are modular and can be extended or replaced as needed.
- Placeholder implementations are provided for authentication and error handling; these should be replaced with production logic.

---

For more details, see the source code in `src/app.ts` and the `src/routes/`, `src/middleware/`, and `src/utils/` directories. 