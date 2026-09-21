# Repo Radar

A dashboard for searching GitHub repositories, tracking favourites, and monitoring their latest stats.

**Live demo:** <!-- TODO: add your Vercel URL -->
**Repository:** <!-- TODO: add your GitHub repository URL -->

## Features

- Debounced repository search with sorting (best match, stars, forks, recently updated, help-wanted issues)
- Pagination (first / previous / next / last) driven by GitHub's `Link` header
- Track and untrack repositories from search results
- Tracked Repos view showing stars, open issues and last push date
- Refresh a single repository or all tracked repositories
- Independent loading and error states for every tracked repository
- Tracked repositories persisted in `localStorage`
- Horizontal bar chart of stars per tracked repository
- Light and dark colour schemes that follow the operating system setting
- Loading skeletons, empty states, and readable error messages (offline, rate limit, not found)

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript, built with Vite |
| State management | Redux Toolkit + React Redux |
| UI | MUI (Material UI) |
| Charts | MUI X Charts |
| API client | Octokit, GitHub REST API (version `2026-03-10`) |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js (a current LTS version) and npm

### Install and run

```bash
git clone <repository-url>
cd repo-radar
npm install
npm run dev
```

The app runs at the URL Vite prints (usually `http://localhost:5173`).

### Optional: GitHub token for local development

Without a token, GitHub allows 60 requests per hour for general endpoints and 10 per minute for search. That's enough to try the app, but easy to exhaust while developing. To raise the limits, create a `.env.local` file in the project root:

```
VITE_GITHUB_TOKEN=your_personal_access_token
```

Use a fine-grained token with read-only access to public repositories. `.env.local` is git-ignored. See [Limitations](#assumptions-and-limitations) for why the token is not used in production.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the reducer tests (Vitest) |

### Deployment

The app is deployed on Vercel as a static single-page application. Vercel detects Vite automatically; no extra configuration is needed because the app has no client-side routes.

## Project structure

The project uses a hybrid, feature-based structure: code that belongs to one feature lives in that feature's folder, while app-wide wiring and genuinely shared code live at the top level.

```
src/
├── api/                    # Data layer: everything that talks to GitHub
│   ├── githubClient.ts     # The single Octokit instance
│   ├── repos.ts            # searchRepos(), getRepo()
│   ├── mappers.ts          # GithubRepo -> TrackedRepo
│   └── errors.ts           # Converts API errors into user-facing messages
├── app/                    # App-wide wiring
│   ├── App.tsx             # Layout and tabs
│   ├── store.ts            # Store configuration, RootState, AppDispatch
│   ├── hooks.ts            # Typed useAppDispatch / useAppSelector
│   └── persistenceMiddleware.ts
├── components/             # Shared presentational components (no Redux)
│   ├── RepoCard.tsx
│   ├── RepoCardSkeleton.tsx
│   ├── RepoGrid.tsx
│   └── StarsBarChart.tsx
├── features/
│   ├── search/             # Search bar, sort, results, pagination, slice
│   └── trackedRepos/       # Track button, tracked list and cards, refresh, chart, slice, storage
├── hooks/
│   └── useDebounce.ts      # Generic, not tied to a feature
├── theme/
│   └── theme.ts
├── types/
│   ├── github.ts           # Raw GitHub API types
│   └── repo.ts             # App's internal TrackedRepo type
├── utils/
│   ├── format.ts           # Number and date formatting (Intl)
│   └── parseLinkHeader.ts
└── main.tsx                # Providers: Redux, theme, CssBaseline
```

A flat structure (`components/`, `hooks/`, …) would be simpler but turns into a mix of unrelated files as features grow. A fully nested feature-sliced structure would be overkill for two features. The hybrid keeps each feature self-contained without extra nesting.

## Architecture and technical decisions

### Data flow

```
Component ──dispatch──▶ Thunk ──▶ api/repos.ts ──▶ Octokit ──▶ GitHub
    ▲                     │
    │                     ▼
useAppSelector ◀── Slice reducer ◀── fulfilled / rejected action
                          │
                          ▼
              persistenceMiddleware ──▶ localStorage
```

Components never call the API directly. They dispatch thunks and read state through selectors, so the data source could change without touching the UI.

### Data layer

- **One Octokit instance** in `githubClient.ts`; no other file knows Octokit exists.
- **Two endpoints, each for its own purpose.** `GET /search/repositories` powers the search bar only. `GET /repos/{owner}/{repo}` is used for refreshing already-tracked repositories. Besides being the correct endpoint for a known repository, it counts against the general rate limit rather than the much stricter search limit.
- **The API version is pinned** with the `X-GitHub-Api-Version: 2026-03-10` header, so a future GitHub release can't change response shapes unexpectedly.
- **Response envelopes are unwrapped at the boundary.** `searchRepos` returns `{ items, totalCount, pagination }`; nothing outside the data layer sees GitHub's raw response wrapper.

### Types: raw API data vs. app data

- `GithubRepo` describes only the fields the app uses, with GitHub's exact names and nesting. It's a subset of the real response, not an invented shape.
- `TrackedRepo` is the app's own camelCase model. `toTrackedRepo()` converts between them in one place.
- Tracked repositories are stored and persisted as `TrackedRepo`, so `localStorage` holds a small, clean object per repository instead of GitHub's full response.
- Search results stay as `GithubRepo` because they are temporary and never persisted. They are mapped for display so both views share one `RepoCard` component.
- The `sort` parameter is typed as a union of GitHub's accepted values, so an invalid sort is a compile-time error rather than a runtime 422.

### State design

Two slices with different lifecycles:

**`search`**: temporary state for the current search.
- Stores results, total count, pagination, and the `params` (query, page, page size, sort) that produced them. Pagination and the retry button re-run the same search from `params`.
- **Stale responses are ignored.** Each request's `requestId` is stored on `pending`; `fulfilled` and `rejected` only apply if they belong to the latest request. Without this, a slow earlier request could overwrite newer results.

**`trackedRepos`**: normalized, persistent state.

```ts
{
  entities:   Record<number, TrackedRepo>,  // data by id
  ids:        number[],                     // tracking order
  statusById: Record<number, { loading: boolean; error: string | null }>
}
```

- **Normalized by id**, so updating one repository is a direct keyed update.
- **`statusById` gives every repository its own loading and error state**, instead of a single global loading flag.
- **Derived data is computed, not stored.** Lists and chart data come from memoized selectors (`createSelector`).
- **Global vs. local state:** only data shared between components is in Redux. The raw search input text and the active tab are local component state.

### Asynchronous operations

- **Thunks with `createAsyncThunk`.** I chose explicit thunks over RTK Query so the per-repository status model, persistence and guards are visible and fully under my control. RTK Query would be a reasonable alternative (see [Future improvements](#future-improvements)).
- **Refresh one:** `refreshTrackedRepo({ id, fullName })` updates only that repository's `statusById` entry.
- **Refresh all:** `refreshAllTrackedRepos` dispatches one `refreshTrackedRepo` per repository concurrently. A dispatched thunk resolves to either a fulfilled or a rejected action and never throws, so one failure doesn't block the others: successful repositories update, failed ones show an error while keeping their last known data.
- **No duplicate requests.** The thunk's `condition` option skips a refresh if that repository is already loading (double clicks, or "Refresh all" during a single refresh).
- **Untracking during a refresh** is handled: if a repository is untracked while its request is in flight, the response is ignored rather than re-adding it.
- **Readable errors.** Thunks catch errors and pass a user-facing message through `rejectWithValue`, since Redux Toolkit drops the HTTP status when it serializes a thrown error. Offline, rate-limit (403/429), not-found (404) and invalid-query (422) cases each get their own message.

### Search, debouncing and pagination

- **`useDebounce` debounces a value, not a function.** Debouncing a function in React needs `useCallback` or `useRef` to keep it stable across renders; debouncing a value relies on normal effect cleanup to cancel pending timers.
- The trimmed query is debounced, so trailing spaces don't trigger duplicate requests. An empty query clears the results instead of sending a request GitHub would reject.
- Changing the sort triggers a search immediately and resets to page 1; only typing is debounced.
- **Pagination uses the `Link` response header**, which already reflects GitHub's 1,000-result cap. Computing pages from `total_count` would offer pages GitHub refuses to serve. When there is no `last` link, the current page is the last page.
- **Custom `Link` header parser.** The `parse-link-header` package references Node's `process` global and crashed in the browser. Rather than polyfilling Node globals, I wrote a small parser that returns page numbers directly.
- Navigation always goes through the same typed `searchRepos` function with a page number, rather than following the raw URLs from the header.
- Pagination buttons are disabled while a page is loading, so the displayed page and the pagination state stay in sync.

### Persistence

- A **Redux middleware** writes tracked repositories to `localStorage` after actions that change them: track, untrack, and a successful refresh. It saves an ordered array built from `ids`, so tracking order survives a reload.
- **Hydration is synchronous**: the slice's initial state is built from `localStorage` when the store is created. The first render already has the data, so there's no flash of an empty list and no hydration action.
- Reading and writing are wrapped in `try/catch`; corrupt data or blocked storage falls back to an empty list instead of crashing the app.
- The middleware reads only the slice state it needs rather than `RootState`, which avoids a circular type reference between the store and its middleware.

### Rendering performance

- Tracked cards receive only an `id` and subscribe to their own entity and status. Refreshing one repository re-renders only that card.
- The "Refresh all" button is its own component, because it subscribes to a value that changes on every refresh. When that subscription lived in the list component, every card re-rendered on every refresh.
- The chart uses a memoized selector, so it re-renders when star counts change but not when a refresh merely starts.

### UI

- **One `RepoCard` for both views.** It's presentational: it receives data, an optional loading flag, an optional error, and an `actions` slot. Views decide which buttons to show.
- **Both tab panels stay mounted** and the inactive one is hidden. Unmounting the search panel would reset the search input, which would clear the results.
- **Loading states:** skeleton cards on the first load; on later loads (sort or page change) the current results stay visible, dimmed, under a progress bar.
- **Chart:** horizontal bars so long `owner/name` labels stay readable; sorted by stars; compact numbers on the axis and exact values in tooltips. MUI X Charts inherits the MUI theme, including dark mode.
- **Theme:** light and dark colour schemes defined with CSS variables; the app follows the OS preference.
- **Accessibility:** labelled icon buttons, `aria-busy` on loading regions, `aria-pressed` on the track toggle, and linked tab and panel attributes.

### Testing

Reducer tests (Vitest) cover the cases that are hard to reproduce by hand: ignoring stale search responses, recording a refresh error while keeping existing data, and not re-adding a repository that was untracked mid-refresh. Reducers are pure functions, so these tests build actions directly and need no network mocking.

### Monorepo: considered, not used

The task mentions an optional monorepo with separate UI and chart packages. I decided against it: a monorepo solves problems of scale (several apps sharing code, independently versioned packages, multiple teams), and this project has a single consumer. The workspace tooling would add complexity without improving the required features. The code is structured so a split would be straightforward: `components/StarsBarChart.tsx` and the shared components have no Redux dependency and could move into packages unchanged.

## Assumptions and limitations

- **"Last commit date" is shown as the last push date.** The app uses the repository's `pushed_at` field, labelled "Last pushed". It's the closest value available on the repository object. Getting the true last commit on the default branch would need an extra request per repository (`GET /repos/{owner}/{repo}/commits?per_page=1`), doubling API usage against a tight rate limit.
- **No GitHub token in production.** Vite embeds `VITE_*` variables into the client bundle, so any token would be visible to every visitor. The deployed app therefore makes unauthenticated requests and is subject to GitHub's limits (60 requests/hour, 10 searches/minute per visitor IP). When a limit is hit, the app shows a clear rate-limit message. A token is only used locally during development.
- **Search results are capped at 1,000** by GitHub. The app says so when a search has more matches.
- **Tracked data is a snapshot.** Stats reflect the moment a repository was tracked or last refreshed; they are not updated automatically in the background.
- **Refresh all** makes one request per tracked repository, so a large tracked list uses the unauthenticated limit quickly.
- **Stored data is lightly validated.** Data from `localStorage` is checked to be an array, not validated field by field.
- **Theme** follows the operating system preference; there is no in-app toggle.

## Future improvements

- A Vercel serverless function to proxy GitHub requests, keeping a token server-side for higher rate limits.
- Migrating the data layer to RTK Query for built-in caching and request deduplication.
- An in-app light/dark toggle (the theme is already set up for it).
- Showing the true last commit date, fetched per repository.
- Schema validation (for example with Zod) for data loaded from `localStorage`.
- Component tests, and saving the search query and page in the URL so searches can be shared.
