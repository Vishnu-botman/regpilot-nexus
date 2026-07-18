# RegPilot Nexus — NitroStudio Interactive Testing Guide

## Overview

This guide provides step-by-step instructions for testing RegPilot Nexus in NitroStudio. The project includes 27 MCP tools, 4 widgets, 28 regulations, and 15 company profiles.

## Prerequisites

1. ✅ Dev server connected to NitroStudio
2. ⏳ Clean reseed executed (populates 28 regulations, 15 companies, 27 obligations)
3. ✅ All modules registered in `src/app.module.ts`

## Testing Phases

### Phase 1: Core MCP Tools (Regulations Module)

**Objective:** Verify regulation search, retrieval, and comparison tools work correctly.

#### Test 1.1: Search Regulations
```
Prompt: "Show me all RBI regulations"
Expected Tool: search_regulations
Expected Behavior: Returns list of RBI regulations with status badges
Expected Widget: Regulation Explorer (if available)
```

#### Test 1.2: Get Regulation Details
```
Prompt: "Tell me about the Digital Lending Directions"
Expected Tool: get_regulation
Expected Behavior: Returns full regulation with sections and versions
Expected Widget: Regulation Explorer detail view
```

#### Test 1.3: Compare Versions
```
Prompt: "What changed between version 1.0 and 1.1 of Digital Lending?"
Expected Tool: compare_regulation_versions
Expected Behavior: Shows added/removed/modified sections
```

#### Test 1.4: Explain Regulation
```
Prompt: "Explain the DPDP Act in simple terms"
Expected Tool: explain_regulation
Expected Behavior: Plain language explanation with key sections
```

### Phase 2: Compliance Tools (Compliance Module)

**Objective:** Verify applicability evaluation, obligation finding, and action plan generation.

#### Test 2.1: Evaluate Applicability
```
Prompt: "Does the Digital Lending Directions apply to Acme Fintech?"
Expected Tool: evaluate_applicability
Expected Behavior: Returns applicable=true, confidence=high, matching sections
Expected Widget: Applicability Matrix
```

#### Test 2.2: Find Obligations
```
Prompt: "What are the compliance obligations for Acme Fintech under Digital Lending?"
Expected Tool: find_obligations
Expected Behavior: Returns 4 obligations with deadlines and penalties
Expected Widget: Compliance Dashboard
```

#### Test 2.3: Generate Action Plan
```
Prompt: "Create an action plan for Digital Lending compliance"
Expected Tool: generate_action_plan
Expected Behavior: Groups obligations into Immediate/Scheduled/Monitored
Expected Widget: Action Plan Board
```

#### Test 2.4: Simulate Compliance
```
Prompt: "What regulations apply to a healthcare startup in India?"
Expected Tool: simulate_compliance
Expected Behavior: Returns all applicable regulations for healthcare industry
Expected Widget: Applicability Matrix
```

### Phase 3: Company Tools (Company Module)

**Objective:** Verify company profile retrieval and policy management.

#### Test 3.1: Get Company Profile
```
Prompt: "Show me Acme Fintech's profile"
Expected Tool: get_company_profile
Expected Behavior: Returns company details, industry, entity type, policies
```

#### Test 3.2: Update Company Profile
```
Prompt: "Update Acme Fintech's employee count to 300"
Expected Tool: update_company_profile
Expected Behavior: Updates profile and returns confirmation
```

#### Test 3.3: Manage Policies
```
Prompt: "List all policies for Acme Fintech"
Expected Tool: manage_policies
Expected Behavior: Returns list of policies with versions and status
```

### Phase 4: Knowledge Tools (Knowledge Module)

**Objective:** Verify semantic search and chunk retrieval.

#### Test 4.1: Semantic Search
```
Prompt: "Find regulations about data protection"
Expected Tool: semantic_search
Expected Behavior: Returns regulations matching query (or notice if no embeddings)
```

#### Test 4.2: Get Regulation Chunks
```
Prompt: "Get all text chunks from the DPDP Act"
Expected Tool: get_regulation_chunks
Expected Behavior: Returns text chunks with section references
```

### Phase 5: Enterprise Tools (Enterprise Module)

**Objective:** Verify GitHub and Slack integration stubs.

#### Test 5.1: Create GitHub Issue
```
Prompt: "Create a GitHub issue for Digital Lending compliance"
Expected Tool: create_github_issue
Expected Behavior: Returns success or "token not configured" message
```

#### Test 5.2: Notify Slack
```
Prompt: "Send a Slack notification about compliance deadline"
Expected Tool: notify_slack
Expected Behavior: Returns success or "token not configured" message
```

### Phase 6: Scheduler & Monitor Tools

**Objective:** Verify scheduler and monitoring tools.

#### Test 6.1: Get Scheduler Status
```
Prompt: "What's the status of the monitoring scheduler?"
Expected Tool: get_scheduler_status
Expected Behavior: Returns job status, next run time, last run result
```

#### Test 6.2: Trigger Monitoring Job
```
Prompt: "Run the monitoring job now"
Expected Tool: trigger_monitoring_job
Expected Behavior: Executes job and returns results
```

#### Test 6.3: List Regulatory Sources
```
Prompt: "What regulatory sources are being monitored?"
Expected Tool: list_regulatory_sources
Expected Behavior: Returns RBI, SEBI, MCA, CERT-In sources
```

### Phase 7: Widget Testing

**Objective:** Verify all 4 widgets render correctly and respond to user interactions.

#### Widget 7.1: Regulation Explorer
```
Trigger: search_regulations or get_regulation
Expected: 
  - Search box with filters (regulator, status, type)
  - Regulation list with status badges
  - Detail view with sections tree
  - Version history
  - Dark/light theme support
```

#### Widget 7.2: Compliance Dashboard
```
Trigger: find_obligations or evaluate_applicability
Expected:
  - Summary cards (total, mandatory, high priority, score)
  - Regulator breakdown with progress bars
  - Priority breakdown with progress bars
  - Company profile display
  - Obligations list with filters
  - Refresh button
```

#### Widget 7.3: Action Plan Board
```
Trigger: generate_action_plan
Expected:
  - Kanban board with 3 columns (Immediate, Scheduled, Monitored)
  - Obligation cards with priority badges
  - Deadline indicators
  - Click to view details
  - Generate Plan button
```

#### Widget 7.4: Applicability Matrix
```
Trigger: evaluate_applicability or simulate_compliance
Expected:
  - Table with regulations as rows
  - Columns: Regulation, Status, Applicable, Confidence, Match
  - Company profile summary
  - Evaluate All button
  - Click to view detailed evaluation
  - Match icons (✅ ❌ ⚠️ ❓)
```

### Phase 8: Conversational Flow Testing

**Objective:** Verify natural language understanding and multi-turn conversations.

#### Scenario 8.1: Compliance Officer Workflow
```
Turn 1: "What compliance obligations do we have for digital lending?"
  → search_regulations + find_obligations
  → Compliance Dashboard widget

Turn 2: "Which of these are mandatory?"
  → Filter obligations by mandatory=true
  → Update dashboard

Turn 3: "What are the deadlines?"
  → Extract deadline information
  → Show timeline

Turn 4: "Create an action plan"
  → generate_action_plan
  → Action Plan Board widget
```

#### Scenario 8.2: Regulatory Analyst Workflow
```
Turn 1: "Compare RBI Digital Lending v1.0 and v1.1"
  → compare_regulation_versions
  → Show diff

Turn 2: "What's new in v1.1?"
  → Extract added sections
  → Highlight changes

Turn 3: "Does this apply to our company?"
  → evaluate_applicability
  → Applicability Matrix widget
```

#### Scenario 8.3: Multi-Company Assessment
```
Turn 1: "Which regulations apply to a healthcare startup?"
  → simulate_compliance
  → Applicability Matrix

Turn 2: "What about a fintech NBFC?"
  → simulate_compliance with different profile
  → Compare results

Turn 3: "Show me the obligations for both"
  → find_obligations for each regulation
  → Compliance Dashboard
```

## Test Data Reference

### Key Regulations (28 total)
- **RBI**: Digital Lending, KYC, Payment Aggregators, FEMA, PMLA
- **SEBI**: LODR, PIT, ICDR, Mutual Funds
- **MCA**: Companies Act, CSR, Accounts Amendment
- **MeitY**: DPDP Act, IT Act
- **CERT-In**: Incident Reporting
- **MoLE**: Code on Wages, Social Security, OSH, Industrial Relations
- **IRDAI**: Corporate Agents, Advertisements
- **TRAI**: QoS Regulations
- **FSSAI**: Food Safety
- **MoEFCC**: EIA, E-Waste
- **CERC**: Electricity Grid Code
- **CBIC**: GST Compliance
- **CDSCO**: Medical Devices

### Key Companies (15 total)
- **Acme Fintech Solutions** (fintech, NBFC) — Primary test company
- **Bharat National Bank** (banking, public sector)
- **CyberShield Security** (cybersecurity, IT services)
- **DataVault Technologies** (SaaS, cloud services)
- **GreenEnergy Corp** (energy, power generation)
- **HealthPlus Medical Devices** (healthcare, medical devices)
- **India Manufacturing Ltd** (manufacturing)
- **LifeCare Insurance** (insurance, life insurance)
- **MediaCorp Telecom** (telecom, mobile services)
- **SafeFood Industries** (food, food processing)
- **TradeWinds Export** (trading, export-import)
- **UrbanEco Real Estate** (real estate, construction)
- **VirtuLearn EdTech** (education, edtech)
- **Zenith Insurance Brokers** (insurance, brokerage)
- **Quantum Finance NBFC** (NBFC, lending)

### Key Obligations (27 total)
- Key Fact Statement Disclosure (Digital Lending)
- Cooling-Off Period (Digital Lending)
- Grievance Redressal Mechanism (Digital Lending)
- Customer Due Diligence (KYC)
- Board Composition (LODR)
- Quarterly Disclosures (LODR)
- Data Processing Notice (DPDP)
- Obtain Consent (DPDP)
- Implement Security Safeguards (DPDP)
- Report Cyber Incidents (CERT-In)
- Log Retention (CERT-In)
- Hold Annual General Meeting (Companies Act)
- CSR Committee Formation (CSR)
- Timely Payment of Wages (Code on Wages)
- Maintain Insurance Registration (IRDAI)
- Food Labelling Compliance (FSSAI)
- Environmental Impact Assessment (EIA)
- E-Waste Management (E-Waste Rules)
- GST Return Filing (GST)
- Medical Device Registration (Medical Devices)
- Social Security Contributions (Social Security Code)
- Workplace Safety Standards (OSH Code)
- Insider Trading Compliance (PIT)
- Trading Plan for Insiders (PIT)
- Constitute Grievance Redressal Committee (Industrial Relations)
- Insurance Advertisement Compliance (IRDAI Ads)

## Success Criteria

### Tool Testing
- ✅ All 27 tools callable from NitroStudio chat
- ✅ Tools return expected data structure
- ✅ Error handling works (non-existent IDs, invalid inputs)
- ✅ Pagination works (limit/offset parameters)
- ✅ Filters work (regulator, status, priority, etc.)

### Widget Testing
- ✅ All 4 widgets render without errors
- ✅ Widgets display tool output correctly
- ✅ Interactive features work (search, filter, click, refresh)
- ✅ Dark/light theme support works
- ✅ Responsive design on different screen sizes

### Conversational Testing
- ✅ Natural language prompts understood
- ✅ Multi-turn conversations maintain context
- ✅ Tool selection is appropriate for user intent
- ✅ Widget selection is appropriate for tool output
- ✅ Error messages are helpful

### Data Integrity
- ✅ No orphaned records
- ✅ Foreign key relationships intact
- ✅ Unique constraints satisfied
- ✅ Timestamps are correct
- ✅ Enums have valid values

## Troubleshooting

### Widget Shows "Loading…" Forever
- Check: `export const dynamic = 'force-dynamic'` in widget page
- Check: Tool is returning data in expected format
- Check: Browser console for errors

### Tool Returns Empty Results
- Check: Clean reseed was executed
- Check: Database connection is active
- Check: Prisma client is generated (`npm run prisma:generate`)

### Tool Returns Error
- Check: Input parameters match schema
- Check: Referenced IDs exist in database
- Check: Environment variables are set (for API integrations)

### Widget Styling Broken
- Check: CSS is vanilla CSS or CSS Modules (not Tailwind)
- Check: `src/widgets/package.json` has required dependencies
- Check: No console errors in browser

## Next Steps After Testing

1. **Document Issues** — Create GitHub issues for any failures
2. **Fix Bugs** — Patch tools/widgets as needed
3. **Optimize Performance** — Profile slow queries
4. **Add Missing Features** — Implement P2 widgets (Diff Viewer, Timeline)
5. **Production Deployment** — Deploy to production environment

## Contact & Support

- **Documentation**: https://docs.nitrostack.ai
- **Discord**: https://discord.gg/uVWey6UhuD
- **GitHub**: https://github.com/nitrocloudofficial/nitrostack
