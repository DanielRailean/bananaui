# BananaUI — Kong Gateway Admin UI

> **BananaUI** is a fast, open-source management UI for [Kong API Gateway](https://konghq.com/). It focuses on developer productivity and serves as a modern alternative to Kong Manager.

## Live Demo

[danielrailean.github.io/bananaui](https://danielrailean.github.io/bananaui/)

![BananaUI screenshot showing entity management interface](./docs/resources/ui.png)

## What is BananaUI?

BananaUI is a web-based dashboard for managing Kong Gateway entities (services, routes, plugins, consumers, upstreams, etc.). It connects to the Kong Admin API and provides full CRUD operations, advanced filtering, and a responsive UI built with SvelteKit.

BananaUI can run as a **static site** (client-side only) or as a **Docker container** with server-side configuration.

## Features

### Entity Management

- **Full CRUD** for all Kong entities (services, routes, plugins, consumers, upstreams, targets, certificates, etc.)
- **Plugin execution order** — visualize plugin priority and execution flow across your Kong configuration
- **Bulk create** — import an array of entities in one operation
- **Bulk update** — apply a JSON patch to all visible/filtered entities at once
- **Bulk delete** — remove all visible entities (safety-gated behind a preference toggle)
- **Inline enable/disable toggle** — flip entity state directly from the list view
- **Schema-aware create/edit** — loads entity schemas and plugin config schemas automatically
- **Syntax-highlighted JSON editor** with Prism.js
- **Sub-entity navigation** — automatically loads related entities (routes/plugins under services, targets under upstreams)
- **Data plane clustering info** — view sync status, versions, and config hashes across cluster nodes

### Search & Filtering

- **Unified search** across all entity fields from a single search bar
- **Advanced filtering** with boolean `AND` (e.g. `name == "foo" && id == "bar"`) and field-length filters (e.g. `paths.len == 2`)
- **Column sorting** with sort state persisted in URL params

### Export & Copy

- **Copy as JSON or YAML** — export individual entities or entire lists
- **Copy buttons** on all objects and fields (single-click JSON, double-click YAML)

### Performance

- **Request caching** — handles thousands of entities efficiently
- **Proper Admin API pagination** — fetches all entities automatically with configurable delay between requests
- **99/100 Lighthouse score** — built with `SvelteKit` for blazing-fast rendering

### Customization

- **Fully configurable preferences** per user:
  - API and UI pagination sizes
  - Visible fields per entity
  - Plugin order display
  - Entity enumeration (row numbers)
  - Custom entity definitions (names, fields, sort order, logos, sub-entities, default values)
  - Custom HTTP headers for API requests
- **Dark mode** (toggle via banana icon)
- **Local settings** stored in `LocalStorage`; Docker deployments accept default config via env var (see [`ui/README.md`](./ui/README.md))

### Authentication & User Info

- **SSO / OIDC login** with ID token support
- **Profile page** — view decoded JWT payload, username, email, and personal API token with expiration
- **Notification history** — persistent log of errors, info, and success messages

### Developer Experience

- **Static or dynamic deployment** — works client-side with a Kong Admin API link, or via Docker image
- **Linked entity navigation** — jump between related Kong objects via anchor tags (easy to open in new tabs)
- **Tree view** for nested objects with expandable fields and double-click-to-copy
- **SvelteKit-based** — easy to extend and contribute to
- **Customizable entity definitions** — add new Kong entities without changing source code

## Deployment

| Method | Description |
|--------|-------------|
| **Static (GitHub Pages)** | Client-side only. Point BananaUI at your Kong Admin API URL. Requires CORS whitelisting on the Admin API. [Live demo](https://danielrailean.github.io/bananaui/) |
| **Docker** | Server-rendered. Configure via environment variables. See [`ui/README.md`](./ui/README.md). |

## Roadmap

- Event middleware (trim/append route parts on copy)
- Additional OIDC flows (backend secret-based auth for dynamic deployments)

## Keywords

Kong UI, Kong Gateway dashboard, Kong Admin API GUI, Kong manager alternative, BananaUI, open-source Kong management interface, SvelteKit Kong admin panel
