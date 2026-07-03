# VAI Workbench Frontend

Next.js + TypeScript frontend for a polished two-in-one app: a date-driven Kanban board and an image polygon annotation tool.

## Runtime versions

Implemented for:

- Node.js: 20.x recommended
- npm: 10.x recommended
- Next.js: 14.x
- React: 18.x
- TypeScript: 5.x

Check your local versions:

```bash
node --version
npm --version
```

## Setup and run

Start the Django backend first on port `8000`, then from `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Optional API base override:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api npm run dev
```

## Pages

- `/` — login page
- `/tasks` — Kanban task manager with shared date state
- `/annotate` — upload, scroll, draw, save, and remove image polygons

## Architecture notes

- `components/shared/DateSelector.tsx` is reusable and owns no task UI logic.
- `store/dateStore.ts` uses Zustand so the selected date can be shared across independent components.
- `components/tasks/Board.tsx`, `Column.tsx`, and `TaskCard.tsx` keep the Kanban structure modular.
- Drag and drop is implemented with `@dnd-kit/core`.
- Annotation uses an SVG overlay with normalized polygon points for responsive rendering.
- API calls are isolated in `lib/api.ts`; shared DTOs are in `lib/types.ts`.

## Implementation notes and villains faced

The biggest UI villain was making annotation precise without pulling in a heavy canvas framework. SVG won because it keeps polygons easy to render, select, save, and delete while staying TypeScript-friendly. The second villain was drag-and-drop plus task actions: edit/delete buttons need to avoid starting a drag gesture, so the card action handlers stop pointer propagation.

For performance and modularity, the app avoids global task state and fetches only the selected date's tasks. Annotation image data is local to the annotation page because it does not need to affect the rest of the app.
