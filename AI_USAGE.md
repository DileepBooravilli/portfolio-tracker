# AI Tools & Usage

## Tool Used

**GitHub Copilot** (Claude Opus 4) via VS Code Agent mode — used as the primary AI-assisted development tool throughout the entire project.

## How AI Was Used

### 1. Architecture & Planning

**Prompt:** *"Build a Real-Time Portfolio Tracker — a UI that shows portfolio holdings, P&L and Exposure across multiple assets/positions. Should simulate market price changes and positions being updated, with live UI update. Alerts/Notification if prices move more than 5/10% during a day."*

**AI Output:**
- Evaluated project scope and recommended technology stack
- Designed component architecture: backend models, SignalR hub, background services, REST API, React state management
- Created a phased implementation plan before writing any code

### Technology Decision-Making Process

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| **Backend Framework** | Node.js (Express/Fastify), Python (FastAPI), ASP.NET Core | **ASP.NET Core 8** | Franklin Templeton is a .NET shop — demonstrates relevant skills. Built-in SignalR for WebSockets, strong typing with C#, BackgroundService for simulators |
| **Real-Time Transport** | Polling, Server-Sent Events, Raw WebSockets, SignalR | **SignalR** | Native ASP.NET Core integration, automatic fallback (WebSocket → SSE → Long Polling), strongly-typed hub contracts, built-in reconnection |
| **Frontend Framework** | Angular, Vue, React | **React 19 + TypeScript** | Industry standard, large ecosystem (MUI, Recharts), fast prototyping with hooks, TypeScript for type safety matching backend DTOs |
| **UI Library** | Tailwind, Bootstrap, MUI | **MUI v7 + DataGrid v8** | Professional data-heavy UI out of the box, DataGrid handles large tabular data with sorting/filtering, consistent design system |
| **Charts** | Chart.js, D3, Recharts, Victory | **Recharts** | React-native API (declarative JSX), lightweight, good pie chart support for exposure visualization |
| **Data Storage** | PostgreSQL, SQLite, In-Memory | **ConcurrentDictionary (in-memory)** | Demo scope — no persistence needed, thread-safe for concurrent simulator access, zero infrastructure setup |
| **Containerization** | None, Docker, Kubernetes | **Docker Compose** | Single command startup (`docker compose up --build`), reproducible across machines, nginx reverse proxy for production-like setup |
| **Build Strategy** | Single-stage, Multi-stage | **Multi-stage Docker builds** | Smaller images (SDK not in runtime), security (no build tools in production), separate build and runtime concerns |

### 2. Code Generation

All code was generated through iterative prompts in VS Code Agent mode. Key artifacts:

| Artifact | Prompt Summary | AI Contribution |
|----------|---------------|-----------------|
| Domain Models | *"Create models for assets, positions, trades, alerts"* | Generated C# record/class definitions with proper typing |
| InMemoryStore | *"Seed with 15 realistic stocks"* | Created thread-safe ConcurrentDictionary store with realistic prices and quantities |
| MarketSimulator | *"Simulate price changes every 0.5-1.5s"* | Built BackgroundService with per-asset drift (bulls/bears), alert threshold checking |
| UserActivitySimulator | *"Simulate other users making trades"* | Generated random buy/sell activity from simulated users (User-2 through User-5) |
| SignalR Hub | *"Real-time push of prices, positions, alerts"* | Implemented strongly-typed hub with snapshot on connect |
| REST Controller | *"GET endpoints for portfolio, summary, exposure; POST for trades"* | Created validated controller with proper HTTP semantics |
| React Components | *"Dashboard with holdings grid, P&L cards, exposure charts, alerts, trade dialog"* | Generated 8 components with MUI, Recharts, SignalR integration |
| usePortfolio Hook | *"Manage all real-time state"* | Built custom hook with SignalR event handlers, REST polling fallback, memoization |

### 3. Debugging & Iteration

AI identified and resolved issues during development:

| Issue | Root Cause | AI Fix |
|-------|-----------|--------|
| MUI v9 + DataGrid conflict | `@mui/x-data-grid` requires MUI ≤ v7 | Pinned MUI to v7, DataGrid to v8 |
| Recharts label type error | `PieLabelRenderProps` doesn't expose custom data fields | Used proper type import with `renderLabel` function |
| Template code leftovers | `dotnet new` scaffold remnants in Program.cs | Cleaned up orphaned WeatherForecast code |
| Notification blocking Trade button | Snackbar positioned over button | Moved to bottom-right, reduced duration to 3s |
| All assets trending profitable | Uniform upward bias in price simulator | Added per-asset drift (some bull, some bear) |
| Exposure charts re-rendering slowly | Component re-rendering on every price tick (~1s) | Applied `React.memo` + `useMemo` for 10s refresh cycle |

### 4. Infrastructure

- **Docker:** AI generated multi-stage Dockerfiles (build → runtime), nginx reverse proxy config, and docker-compose orchestration
- **Documentation:** AI drafted README.md and this AI_USAGE.md, refined through review

## AI Artifacts

All source code in this repository was generated through AI-assisted development. The developer provided:
- Requirements and constraints
- Architecture decisions and technology choices
- Review and validation of generated code
- Testing and debugging direction

The AI generated:
- All C# backend code (models, hub, services, controllers, background services)
- All TypeScript/React frontend code (components, hooks, services, types)
- Docker configuration files
- Documentation

## Confidence in Correctness

### Compilation Verification
- **Backend:** `dotnet build` passes with 0 errors, 0 warnings
- **Frontend:** `tsc -b && vite build` passes with 0 errors (TypeScript strict mode)

### API Testing
All REST endpoints manually tested via `curl` and verified to return correct data structures:
- `GET /api/portfolio` — returns 15 positions with calculated P&L
- `GET /api/portfolio/summary` — returns aggregate portfolio metrics
- `GET /api/portfolio/exposure` — returns sector and asset class allocations summing to 100%
- `GET /api/portfolio/alerts` — returns triggered price alerts
- `POST /api/portfolio/trade` — executes trades with validation

### Real-Time Verification
- SignalR WebSocket connection confirmed active via browser DevTools
- Market simulator logs verified showing price updates every 0.5-1.5s
- User activity simulator confirmed generating trades from simulated users
- Alert notifications confirmed triggering at 5% and 10% thresholds

### Edge Cases Handled

| Edge Case | Implementation |
|-----------|---------------|
| Division by zero in P&L | Guarded: `OpeningPrice != 0` check before percentage calculation |
| Selling more than available | Capped: sell quantity limited to current holdings in `ExecuteTrade` |
| Concurrent data access | Thread-safe: `ConcurrentDictionary` for all shared state |
| Duplicate alerts | Deduplicated: `AlertedThresholds` HashSet tracks fired thresholds per symbol |
| WebSocket disconnection | Auto-reconnect: SignalR client configured with reconnection + UI status indicator |
| Price going negative | Floored: `Math.Max(newPrice, 0.01m)` prevents negative prices |
| Empty portfolio render | Null-safe: components handle null/empty states gracefully |
| Race condition on trade execution | Atomic: position updates use ConcurrentDictionary with proper locking semantics |

### Known Limitations
- **In-memory storage** — data resets on restart (production would use a database)
- **No authentication** — out of scope for demo
- **Simulated prices** — not connected to real market data feeds
- **Single-user portfolio** — multi-user would require per-user data isolation
