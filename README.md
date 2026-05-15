# Real-Time Portfolio Tracker

A full-stack real-time portfolio tracking application built for the Franklin Templeton AI-Native Development Test.

## Features

- **Real-time price updates** — stock prices update every ~1 second via WebSocket
- **Portfolio holdings grid** — sortable, filterable table with P&L and day change
- **Summary dashboard** — total portfolio value, P&L, and day change at a glance
- **Exposure charts** — sector and asset class allocation (pie charts)
- **Simulated market activity** — background service generates realistic price movements
- **Simulated user trading** — other "users" buy/sell positions in real-time
- **Price alerts** — toast notifications when any asset moves ≥5% or ≥10% intraday
- **Trade execution** — buy/sell dialog to execute trades from the UI

## Architecture

```
┌──────────────────────────┐       WebSocket (SignalR)       ┌─────────────────────────┐
│    React Frontend        │◄──────────────────────────────►│   ASP.NET Core Backend   │
│    (localhost:5173)       │       REST API (HTTP)          │    (localhost:5152)       │
│                          │◄──────────────────────────────►│                          │
└──────────────────────────┘                                └─────────────────────────┘
```

**Frontend:** React 19 · TypeScript · MUI · Recharts · Vite
**Backend:** ASP.NET Core 8 · SignalR · Background Services · In-Memory Store

## Prerequisites

**Docker (recommended):** Just [Docker Desktop](https://www.docker.com/products/docker-desktop/) — nothing else needed.

**Local development:** Node.js 18+ and .NET 8 SDK

### Installing .NET 8

**macOS (Homebrew):**
```bash
brew install dotnet@8
export DOTNET_ROOT="/opt/homebrew/opt/dotnet@8/libexec"
export PATH="$DOTNET_ROOT:$PATH"
```

**Windows:**
Download the .NET 8 SDK installer from https://dotnet.microsoft.com/download/dotnet/8.0 and run it. The `dotnet` command will be available automatically after installation.

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update && sudo apt-get install -y dotnet-sdk-8.0
```

**Linux (Fedora):**
```bash
sudo dnf install dotnet-sdk-8.0
```

## How to Run

### Option 1: Docker (Recommended)

Just need Docker installed — no other prerequisites required.

```bash
docker compose up --build
```

Open **http://localhost:3000** in your browser. That's it.

### Option 2: Run Locally

#### 1. Start the Backend

```bash
cd backend/PortfolioTracker.Api
dotnet run
```

Backend starts on **http://localhost:5152**

#### 2. Start the Frontend

In a new terminal:

```bash
cd frontend/portfolio-tracker
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

#### 3. Open the App

Open **http://localhost:5173** in your browser.

Swagger API docs: **http://localhost:5152/swagger**

## Project Structure

```
├── README.md
├── AI_USAGE.md
├── docker-compose.yml
├── backend/
│   └── PortfolioTracker.Api/
│       ├── Dockerfile
│       ├── Program.cs                  # App setup, CORS, SignalR
│       ├── Models/                     # Asset, Position, Trade, Alert
│       ├── Hubs/                       # SignalR real-time hub
│       ├── Services/                   # Business logic, P&L calculations
│       ├── BackgroundServices/         # Market + user activity simulators
│       └── Controllers/               # REST API
└── frontend/
    └── portfolio-tracker/
        ├── Dockerfile
        └── src/
            ├── components/             # Dashboard, Grid, Charts, Alerts, Trade Dialog
            ├── hooks/                  # Portfolio state + real-time hook
            ├── services/               # SignalR connection manager
            └── types/                  # TypeScript interfaces
```
