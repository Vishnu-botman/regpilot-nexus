# RegPilot Nexus — Regulatory Compliance MCP Server

RegPilot Nexus is a specialized Model Context Protocol (MCP) server built with **NitroStack** for regulatory compliance tracking, applicability evaluation, obligation monitoring, and version comparison.

---

## 🚀 Setup & Installation

### 1. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase connection (use port 6543 with pgbouncer parameters for application runtime)
DATABASE_URL="postgresql://<username>:<password>@<host>:6543/postgres?pgbouncer=true&connection_limit=1"

# App Settings
NITRO_LOG_LEVEL=info
NITROSTACK_APP_MODE=openai
```
> [!NOTE]
> For executing schema migrations or schema push, switch to port `5432` to bypass PgBouncer transaction-mode limitations.

### 2. Database Schema & Extensions
Enable the `pgvector` extension and push the database schema:
```bash
# Push schema to the database (use port 5432 in .env)
npx prisma db push --accept-data-loss
```

### 3. Seed Database
Seed the database with the comprehensive regulatory compliance test data (13 regulators, 28 regulations, 27 obligations, and 15 company profiles):
```bash
npx tsx -r dotenv/config src/validation/clean-reseed.ts
```

---

## 💻 Running the Application

### Start Development Server
Starts the watch-mode compilation, the MCP server (STDIO), and Next.js widget development server (on port `3001`):
```bash
npm run dev
```

### Build & Start Production Server
```bash
# Build TypeScript and Next.js widget bundles
npm run build

# Start production server
npm run start:prod
```

---

## 📊 Visual Compliance Widgets
Next.js widget pages run at the following routes on port `3001`:

* **Compliance Posture Dashboard:** `http://localhost:3001/compliance-dashboard`
* **Regulation Explorer:** `http://localhost:3001/regulation-explorer`
* **Kanban Action Plan Board:** `http://localhost:3001/action-plan-board`
* **Applicability Matrix:** `http://localhost:3001/applicability-matrix`

---

## 🛠️ Testing in NitroStudio
1. Download and open **NitroStudio** (<https://nitrostack.ai/studio>).
2. Connect to the project directory: `C:\Users\vishn\Documents\Regpilot\regpilot-nexus`.
3. NitroStudio will auto-spawn the MCP server and dynamically render the compliance widgets in its panels as you run tools.
