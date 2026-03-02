# Manager — Frontend

React SPA for event management, ticket reservations, and SAT Lista 69 data import.

---

## Architecture

```
manager-frontend/
├── public/                        # Static assets (favicon, etc.)
│
└── src/
    ├── api/                       # HTTP layer (axios)
    │   ├── client.js              # Axios instance with base URL + 5-min timeout
    │   ├── events.js              # Event CRUD calls
    │   ├── reservations.js        # Reservation calls
    │   ├── sat.js                 # SAT import + query calls
    │   └── utils.js               # extractError() — normalizes DRF error responses
    │
    ├── hooks/                     # TanStack Query hooks (data + cache layer)
    │   ├── useEvents.js           # useEvents · useCreateEvent · useUpdateEvent · useDeleteEvent
    │   ├── useReservations.js     # useReservations · useCreateReservation
    │   └── useSAT.js              # useSATBatches · useTriggerImport · useCanceledTaxpayers
    │
    ├── components/                # Reusable UI pieces (no business logic)
    │   ├── shared/
    │   │   ├── Navbar.jsx         # Top navigation with active-link highlighting
    │   │   ├── Modal.jsx          # Bootstrap modal via React portal (no react-bootstrap dep)
    │   │   ├── LoadingSpinner.jsx # Centered spinner + label
    │   │   └── EmptyState.jsx     # Icon + title + description placeholder
    │   │
    │   ├── events/
    │   │   ├── EventForm.jsx      # Controlled form for create/edit with client validation
    │   │   ├── EventTable.jsx     # Admin table: code, name, date, capacity, price, actions
    │   │   └── EventCard.jsx      # User-facing card with Reserve button
    │   │
    │   ├── reservations/
    │   │   └── ReservationModal.jsx  # Email + ticket count form inside a modal
    │   │
    │   └── sat/
    │       ├── SATImportPanel.jsx    # Trigger button + last batch summary
    │       ├── SATBatchTable.jsx     # Import history with status badges
    │       └── SATRecordsTable.jsx   # Paginated + searchable taxpayer records table
    │
    ├── views/                     # Pages — compose components, own state + hooks calls
    │   ├── AdminView.jsx          # Event CRUD (table + create/edit modal)
    │   ├── UserView.jsx           # Event grid + reservation modal
    │   └── SATView.jsx            # Import panel + history + records
    │
    ├── App.jsx                    # Route declarations
    ├── main.jsx                   # React root, QueryClient, BrowserRouter
    └── index.css                  # Minimal global overrides (card hover, body bg)
```

### Layer responsibilities

| Layer | Responsibility |
|---|---|
| **api/** | Raw HTTP calls — returns raw API data, throws on error |
| **hooks/** | TanStack Query wrappers — caching, invalidation, mutation state |
| **components/** | Pure UI — receive props, emit events, no direct API calls |
| **views/** | Composition — call hooks, manage local UI state, pass props down |

---

## Stack

| Technology | Version | Role |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Dev server + build tool |
| React Router | v6 | Client-side routing |
| TanStack Query | v5 | Server-state caching & mutations |
| Axios | 1.x | HTTP client |
| Bootstrap | 5.3 | CSS framework |
| SweetAlert2 | 11 | Alert / confirm dialogs |

---

## Setup & Run

### Prerequisites

- Node 18+ (or 20 LTS)
- Backend running at `http://localhost:8000`
  See [manager-backend](../manager-backend/README.md) for setup instructions.

### Development

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit VITE_API_BASE_URL if your backend runs on a different port

# 3. Start the dev server
npm run dev
```

App opens at **http://localhost:3000**

> The Vite dev server proxies `/api/*` requests to the backend, so no CORS issues during development.

### Production build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

---

## Docker

### Frontend only

```bash
docker-compose up --build
```

Serves the production build via Nginx at **http://localhost:3000**.

### Full stack (frontend + backend + DB)

```bash
# From the project root (parent of both projects)
docker-compose \
  -f manager-backend/docker-compose.yml \
  -f manager-frontend/docker-compose.yml \
  up --build
```

The `nginx.conf` included in this project proxies `/api/*` to the `backend` service, so the frontend container can reach the backend by service name inside Docker.

---

## Features

### Eventos (User view — `/events`)

- Responsive card grid showing: name, date, price, and available spots.
- Sort by date, price, or availability.
- Full-text search by event name.
- Cards are color-coded: green (available), yellow (< 15% remaining), red (sold out).
- **Reserve** button opens a modal; disabled and labelled **Agotado** when spots reach 0.
- Available spots update immediately after a successful reservation (cache invalidation).

### Administrador (`/admin`)

- Table listing all events with status badges.
- **Nuevo Evento** button opens a modal form.
- **Editar** button pre-fills the same form with existing values.
- **Eliminar** triggers a SweetAlert2 confirmation before deleting.
- Client-side validations mirror backend rules:
  - `event_code` must match `^EVT-\d{4}-[A-Z]{2}$`
  - Name: 5–100 characters
  - Date: must be in the future
  - Capacity: integer > 0
  - Price: float ≥ 0.00

### SAT Lista 69 (`/sat`)

- One-click button to download and import the **Cancelados** list from the SAT website.
- A SweetAlert2 loading dialog keeps the user informed during the (potentially slow) import.
- Import history table with status badges (PENDING / RUNNING / SUCCESS / FAILED).
- Clicking **Ver** on a successful batch filters the records table to that batch.
- Records table: paginated (50/page), searchable by RFC, name, or state.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (empty, uses Vite proxy) | Backend URL. Leave empty for dev; set for production builds. |

