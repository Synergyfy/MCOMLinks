# Mcom Links Monorepo

This is a Turborepo-powered monorepo for the Mcom Links project.

## Project Structure

- `apps/`
  - `backend`: NestJS API.
  - `mcom_link`: Vite/React frontend.
- `packages/`
  - `common`: Shared types, DTOs, and utility functions.
  - `typescript-config`: Shared TypeScript configurations.

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (v9 or later)
- [Node.js](https://nodejs.org/) (v20 or later)

### Installation

```bash
pnpm install
```

### Development

Run all apps in development mode:

```bash
pnpm dev
```

### Build

Build all apps and packages:

```bash
pnpm build
```

## Creating New Packages

Add new packages to the `packages/` directory and ensure they are included in the `pnpm-workspace.yaml`.
