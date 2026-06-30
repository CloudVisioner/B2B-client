# SMEConnect — B2B Service Marketplace (Frontend)

Next.js frontend for SMEConnect, a B2B service marketplace platform connecting SMEs. Pairs with the [Service-Marketplace](https://github.com/CloudVisioner/Service-Marketplace) NestJS backend.

## Features

- Service listings and marketplace browsing
- Rich text content editor (Tiptap) for service/content authoring
- Real-time updates via GraphQL subscriptions and WebSocket chat
- Animated UI (Framer Motion, WebGL visuals)
- JWT-based authentication

## Tech stack

- **Framework:** Next.js 14, React 18, TypeScript
- **UI:** Material UI, Tailwind CSS, SCSS, Framer Motion
- **Data:** Apollo Client (GraphQL), graphql-ws (subscriptions)
- **Editor:** Tiptap rich text editor
- **Graphics:** ogl (WebGL)
- **Backend:** [Service-Marketplace](https://github.com/CloudVisioner/Service-Marketplace) (separate repo, NestJS monorepo)

## Requirements

This is a client app — it needs the backend running to function. Without it, pages that fetch data will fail or show errors.

- Node.js 18+
- The [Service-Marketplace backend](https://github.com/CloudVisioner/Service-Marketplace) running and reachable
- A `.env.local` with your backend's URLs (see below)

## Setup

```bash
yarn install
yarn run dev
```

Runs on `http://localhost:3001`.

### Environment variables

Create `.env.local` with:

NEXT_PUBLIC_API_URL=<your backend REST URL>
NEXT_PUBLIC_API_GRAPHQL_URL=<your backend GraphQL URL>
NEXT_PUBLIC_API_WS=<your backend WebSocket URL>

For local dev against the backend running on its default port, this is typically `http://localhost:3010` (REST/GraphQL) and `ws://localhost:3010` (WS) — adjust if your backend runs elsewhere.

## Related

- Backend repo: [Service-Marketplace](https://github.com/CloudVisioner/Service-Marketplace)
