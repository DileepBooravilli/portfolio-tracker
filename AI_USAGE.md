# AI Tools & Usage

## Tool Used

**GitHub Copilot** (Claude Opus 4) via VS Code Agent mode — used as the primary development tool throughout the entire project.

## How AI Was Used

### Planning
- Evaluated project options, recommended Portfolio Tracker as most relevant to Franklin Templeton
- Designed the system architecture (React + ASP.NET Core + SignalR)
- Created a phased implementation plan before writing any code

### Code Generation
- Generated all backend and frontend code from the approved plan
- Implemented domain models, real-time hub, market simulator, REST API, and React components
- Created seed data with 15 realistic stock positions

### Debugging
- Resolved MUI v9 / DataGrid compatibility issue (pinned to MUI v7)
- Fixed Recharts label typing errors
- Cleaned up scaffolding template leftovers

### Verification
- Compiled both projects with zero errors
- Tested all API endpoints
- Confirmed real-time data flow end-to-end

## Confidence in Correctness

### Verified By
- **Compilation:** Both `dotnet build` and `npm run build` pass with 0 errors
- **API testing:** All endpoints return correct data structures
- **Real-time:** Market simulator and user activity simulator confirmed running via backend logs
- **Type safety:** TypeScript strict mode + C# nullable reference types enabled

### Edge Cases Handled
- Division by zero guarded in P&L calculations
- Sell quantity capped at available holdings
- Concurrent data access via thread-safe collections
- Alert deduplication (one alert per symbol per threshold)
- SignalR auto-reconnect on connection drop
- Price floor at $0.01

### Known Limitations
- In-memory storage (resets on restart) — production would use a database
- No authentication (out of scope for demo)
- Simulated prices, not real market data
