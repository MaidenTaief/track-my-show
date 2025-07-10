# Track My Show

Welcome to the Track My Show monorepo! This is an industry-ready, scalable platform for ticketing, event management, and live show discovery. The project is structured for real-world production use, with a modern tech stack and best practices in mind.

---

## 📦 Project Structure (Current State)

- **frontend/** – Production-grade React app (Vite + TailwindCSS)
  - `src/App.tsx` – Main app, feature-rich UI
  - `index.html`, `main.tsx`, `index.css`, etc.
- **backend/** – Node.js/TypeScript API (Express, TypeORM planned)
  - `src/models/` – Core models: `User.ts`, `Show.ts`, `Venue.ts`, `Booking.ts`
  - `src/services/` – Payment, Email, SMS services scaffolded
  - `src/app.ts`, `src/server.ts` – (empty, to be implemented)
  - `jest.config.js`, `tests/setup.ts` – Jest test config and setup
- **admin/** – Placeholder for admin dashboard (scaffolded)
- **mobile/** – Placeholder for mobile app (scaffolded)
- **track-my-show/** – Monorepo root (Yarn workspaces, Lerna, docs, devops, etc.)
  - `README.md` (this file)
  - `devops/` (Docker, Kubernetes, Terraform, scripts)
  - `docs/`, `database/`, etc.

---

## ✅ What’s Done
- Monorepo structure with workspaces for frontend, backend, admin, and mobile
- Frontend: Modern React app with a beautiful landing page and placeholder data
- Backend: Models and core services (Payment, Email, SMS) scaffolded
- DevOps: Docker, Kubernetes, Terraform, and deployment scripts included
- Testing: Jest config and test setup for backend

---

## 🚧 What’s Missing / To Do
- Backend:
  - Implement controllers, routes, and middleware (folders exist, files not yet created)
  - Implement repositories and utility files (e.g., Logger, ApiResponse, validators)
  - Complete `app.ts` and `server.ts` with Express app logic
  - Add more models (e.g., Review, ShowSchedule, Organizer, Category, BookingSeat, Payment)
  - Add actual test files (unit, integration, E2E, performance)
  - Install and configure all dependencies (TypeORM, Express, Stripe, etc.)
- Frontend:
  - Connect to backend API
  - Add authentication, booking, and user flows
- Admin & Mobile:
  - Implement dashboards and mobile features
- Documentation:
  - Add API docs (Swagger/OpenAPI)
  - Add usage, setup, and contribution guides

---

## ⚠️ Localhost Error (Current)
- **Issue:** When running the frontend dev server, the browser shows a blank page or Chrome error page, not the React app.
- **Diagnosis:** The Vite dev server is running, but the app is not being served at `http://localhost:5173/` as expected. No errors in the browser console, but the page is blank.
- **Possible Causes:**
  - Dev server not serving content (port conflict, misconfiguration, or missing build files)
  - Incomplete dependency installation (especially after npm/yarn issues)
  - Backend not running, so API calls may fail (but UI should still render)
- **Next Steps:**
  - Double-check Vite dev server output and port
  - Try a minimal React component (already done)
  - Ensure all dependencies are installed and up to date
  - Check for .env or config issues

---

## 💡 Suggestions
- **Backend:**
  - Continue scaffolding controllers, routes, and middleware
  - Add missing models and repositories
  - Implement Logger, ApiResponse, and validation utilities
  - Install all required dependencies and run tests
- **Frontend:**
  - Once backend is up, connect API and build out flows
- **DevOps:**
  - Test Docker/K8s setup in a staging environment
- **Docs:**
  - Expand this README with setup, usage, and contribution instructions

---

## 🚀 How to Contribute / Next Steps
1. Clone the repo and install dependencies with `yarn install` at the root
2. Work in the appropriate workspace (`frontend`, `backend`, etc.)
3. Follow the hierarchy above to scaffold missing files
4. Run dev servers and tests as you go
5. Update this README as the project evolves

---

**Let’s build something amazing!**
