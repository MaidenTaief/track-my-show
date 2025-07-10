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