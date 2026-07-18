# RegPilot Nexus - Demo Flow Guide

## Overview

This guide demonstrates the complete MCP interaction flow for RegPilot Nexus.

## Demo Scenario

A fintech company (Acme Fintech Solutions) needs to comply with RBI's Digital Lending Directions, 2025. The demo shows how RegPilot Nexus helps them:

1. Discover the regulation
2. Evaluate applicability
3. Identify obligations
4. Generate an action plan

## Prerequisites

1. PostgreSQL database connected (Supabase)
2. Prisma client generated
3. NitroStudio running

## Demo Steps

### Step 1: Seed Demo Data

```bash
npx tsx src/demo/seed-demo.ts
```

This creates:
- Company profile (Acme Fintech Solutions)
- Regulator (RBI)
- Regulation (Digital Lending Directions, 2025)
- 3 sections, 4 obligations, 3 deadlines, 2 penalties

### Step 2: Run Ingestion Pipeline

```bash
# Start the MCP server
npm run dev

# In NitroStudio, trigger monitoring
call_tool: trigger_monitoring_job
```

### Step 3: Generate Embeddings

```bash
# In NitroStudio, chunk and embed the regulation
call_tool: chunk_and_embed
  regulationId: "demo-regulation-001"
```

### Step 4: Explore Regulations

Open the Regulation Explorer widget:

```
call_tool: search_regulations
  query: "digital lending"
  regulator: "RBI"
```

**Widget displays:**
- List of matching regulations
- Status badges (Active)
- Regulator tags (RBI)
- Effective dates

Click on a regulation to see:
- Full metadata
- Version history
- Sections tree

### Step 5: View Compliance Dashboard

Open the Compliance Dashboard widget:

```
call_tool: find_obligations
  companyId: "demo-company-001"
```

**Widget displays:**
- Summary cards: 4 obligations, 4 mandatory, 2 high priority
- Regulator breakdown: 100% RBI
- Priority breakdown: 50% high, 50% medium
- Company profile: Acme Fintech

### Step 6: Evaluate Applicability

```
call_tool: evaluate_applicability
  regulationId: "demo-regulation-001"
  companyId: "demo-company-001"
```

**Result:**
- Applicable: Yes
- Confidence: High
- Reason: Matched via industry: fintech, entityType: nbfc

### Step 7: Generate Action Plan

```
call_tool: generate_action_plan
  regulationId: "demo-regulation-001"
  companyId: "demo-company-001"
```

**Action Plan:**
- Immediate (4 tasks):
  - Provide clear disclosure of loan terms
  - Establish grievance redressal mechanism
  - Submit quarterly compliance report
  - Conduct annual audit

## Complete Flow

```
User Question: "What compliance obligations do we have for digital lending?"
    ↓
NitroStudio Chat invokes RegPilot Nexus via MCP
    ↓
RegPilot Nexus:
  1. Searches regulations (search_regulations)
  2. Evaluates applicability (evaluate_applicability)
  3. Finds obligations (find_obligations)
  4. Generates action plan (generate_action_plan)
    ↓
Widget displays:
  - Regulation Explorer: Browse regulations
  - Compliance Dashboard: View obligations
  - Action Plan: Prioritized tasks
```

## Key Interactions

### MCP Tools → Widgets

| Tool | Widget | Purpose |
|------|--------|---------|
| search_regulations | Regulation Explorer | Browse regulations |
| get_regulation | Regulation Explorer | View regulation details |
| find_obligations | Compliance Dashboard | View obligations list |
| evaluate_applicability | Compliance Dashboard | Check applicability |
| generate_action_plan | (Future) Action Board | Prioritized tasks |

### Widget Interactions

**Regulation Explorer:**
- Search by keyword, regulator, status
- Click to view details
- Expand sections tree
- View version history

**Compliance Dashboard:**
- Toggle Overview/Obligations tabs
- Filter by priority, regulator
- Refresh data
- View company profile

## Narrative

> "Acme Fintech is an NBFC operating in India. They need to know what RBI's Digital Lending Directions require of them. RegPilot Nexus evaluates their profile against the regulation, finds 4 mandatory obligations, and generates an immediate action plan. The Compliance Dashboard shows their compliance posture at a glance."

This demonstrates the complete value proposition:
1. **Discovery** - Find relevant regulations
2. **Evaluation** - Determine applicability
3. **Analysis** - Identify obligations
4. **Action** - Generate compliance tasks

All powered by deterministic MCP tools, not frontend logic.
