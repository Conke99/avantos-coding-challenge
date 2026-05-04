# Journey Builder

A React/TypeScript app for configuring prefill mappings between forms in a workflow DAG.

## Getting Started

### 1. Start the mock API server

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm start
```

Server runs on `http://localhost:3000`.

### 2. Start the app

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
  api/              # Axios client and fetchBlueprintGraph function
  components/       # React UI components (FormList, PrefillPanel, DataSourceModal)
  dataSources/      # Extensible data source registry and built-in sources
  hooks/            # useGraph hook — fetches graph and manages prefill state
  types/            # TypeScript interfaces matching the API response shape
  utils/            # DAG traversal logic (getAncestorNodes)
  test/             # Vitest setup
```

## Architecture: Data Source Registry

The modal that lets users pick a prefill value supports multiple data sources (form fields, global properties, etc.) through a simple plugin registry.

Every data source implements the `DataSource` interface:

```ts
interface DataSource {
  id: string
  getLabel(): string
  getItems(context: DataSourceContext): DataSourceItem[]
}
```

Sources are registered once in `src/dataSources/index.ts`. When the modal opens, the registry calls `getItems` on every registered source and flattens the results into a single list. Adding a new source requires no changes to existing code.

## How to Add a New Data Source

**Step 1:** Create `src/dataSources/userProfileSource.ts`:

```ts
import type { DataSource, DataSourceItem } from './types'

export const userProfileSource: DataSource = {
  id: 'user-profile',

  getLabel() {
    return 'User Profile Properties'
  },

  getItems(): DataSourceItem[] {
    return [
      { value: 'User Profile.user_id', label: 'user_id', groupLabel: 'User Profile Properties' },
      { value: 'User Profile.user_email', label: 'user_email', groupLabel: 'User Profile Properties' },
      { value: 'User Profile.user_name', label: 'user_name', groupLabel: 'User Profile Properties' },
    ]
  },
}
```

**Step 2:** Register it in `src/dataSources/index.ts`:

```ts
import { userProfileSource } from './userProfileSource'
dataSourceRegistry.register(userProfileSource)
```

No other files need to be changed.
