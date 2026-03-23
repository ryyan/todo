# TODO Application

A high-performance, full-stack TODO application built with a modern architecture.

- **Backend:** [Bun](https://bun.sh/) + [SQLite](https://bun.sh/docs/api/sqlite)
- **Frontend:** [Svelte 5](https://svelte.dev/) + [SvelteKit](https://kit.svelte.dev/)

## Production Deployment

The project is optimized for production use with a unified serving command.

### Prerequisites

You need [Bun](https://bun.sh/) installed on your system.

### Installation & Build

Install all dependencies and create a production build of the frontend:

```bash
bun run build
```

### Serve (Production)

To start both the API and the production-built Web UI:

```bash
bun run serve
```

The Web UI will be available at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:8080](http://localhost:8080).

## Development

To start the backend and the frontend in development mode (with Hot Module Replacement):

```bash
bun run dev
```

## Scripts

| Command | Action |
| --- | --- |
| `bun run serve` | Run production-built API and Web UI |
| `bun run build` | Build the entire monorepo for production |
| `bun run dev` | Run full stack in development mode |
| `bun run check` | Run Svelte-Check |
| `bun run lint` | Run ESLint and Prettier checks |
| `bun run format` | Auto-format the entire codebase |

---

## Technical Architecture

- **Backend (`api/`):** Pure Bun-native server using `URLPattern` for routing and pre-compiled SQLite statements for speed.
- **Frontend (`web/`):** Svelte 5 with the Node.js adapter for stable serving via Bun.
- **Security:** API includes standard security headers (`nosniff`, `X-Frame-Options`) and refined CORS handling.
