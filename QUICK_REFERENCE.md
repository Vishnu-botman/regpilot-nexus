# RegPilot Nexus — Quick Reference Card

## 🚀 Quick Start

### 1. Execute Clean Reseed
```bash
npx tsx src/validation/clean-reseed.ts
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Open NitroStudio
- Dev server is already connected globally
- No need to start a separate dev process

## 📋 27 MCP Tools

### Regulations (5 tools)
- `search_regulations` — Search by keyword, regulator, type, status
- `get_regulation` — Get full regulation with sections
- `compare_regulation_versions` — Show diff between versions
- `get_regulation_versions` — List all versions
- `explain_regulation` — Plain language explanation

### Compliance (7 tools)
- `evaluate_applicability` — Check if regulation applies to company
- `find_obligations` — Find obligations with filters
- `generate_action_plan` — Create prioritized action plan
- `assess_company` — Alias for evaluate_applicability
- `find_compliance_obligations` — Alias for find_obligations
- `generate_gap_report` — Alias for generate_action_plan
- `simulate_compliance` — Test hypothetical company profile

### Company (3 tools)
- `get_company_profile` — Get company details
- `update_company_profile` — Update profile fields
- `manage_policies` — List/create/update policies

### Enterprise (2 tools)
- `create_github_issue` — Create GitHub issue
- `notify_slack` — Send Slack notification

### Knowledge (2 tools)
- `semantic_search` — Search regulations by similarity
- `get_regulation_chunks` — Get text chunks

### Embeddings (3 tools)
- `chunk_and_embed` — Generate embeddings
- `get_regulation_embeddings` — Retrieve embeddings
- `delete_regulation_embeddings` — Delete embeddings

### Scheduler (4 tools)
- `get_scheduler_status` — Get job status
- `trigger_monitoring_job` — Run job manually
- `update_job_schedule` — Update cron schedule
- `start_scheduler` / `stop_scheduler` — Control scheduler

### Monitor (3 tools)
- `check_regulatory_source` — Check single source
- `list_regulatory_sources` — List all sources
- `get_recent_regulations` — Get recent regulations

### Parser (2 tools)
- `parse_document` — Parse HTML/PDF/text
- `extract_metadata` — Extract metadata

### Extractor (1 tool)
- `extract_compliance_objects` — Extract obligations/deadlines/penalties

## 🎨 4 Widgets

| Widget | Route | Trigger Tools |
|--------|-------|---------------|
| Regulation Explorer | `regulation-explorer` | search_regulations, get_regulation, get_regulation_versions |
| Compliance Dashboard | `compliance-dashboard` | find_obligations, evaluate_applicability, get_company_profile |
| Action Plan Board | `action-plan-board` | generate_action_plan |
| Applicability Matrix | `applicability-matrix` | evaluate_applicability, simulate_compliance |

## 📊 Test Data

### 13 Regulators
RBI, SEBI, MCA, MeitY, CERT-In, MoLE, IRDAI, TRAI, FSSAI, MoEFCC, CERC, CBIC, CDSCO

### 28 Regulations
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

### 15 Companies
Acme Fintech, Bharat Bank, CyberShield, DataVault, GreenEnergy, HealthPlus, India Mfg, LifeCare, MediaCorp, SafeFood, TradeWinds, UrbanEco, VirtuLearn, Zenith, Quantum Finance

### 27 Obligations
Key Fact Statement, Cooling-Off Period, Grievance Redressal, Customer Due Diligence, Board Composition, Quarterly Disclosures, Data Processing Notice, Obtain Consent, Security Safeguards, Report Cyber Incidents, Log Retention, AGM, CSR Committee, Wage Payment, Insurance Registration, Food Labelling, EIA, E-Waste Management, GST Filing, Medical Device Registration, Social Security, Workplace Safety, Insider Trading, Trading Plan, Grievance Committee, Insurance Ads

## 🧪 Test Prompts

### Simple Tests
```
"Show me all RBI regulations"
"Tell me about the Digital Lending Directions"
"Does DPDP Act apply to Acme Fintech?"
"What are the obligations for Digital Lending?"
"Create an action plan for compliance"
```

### Complex Tests
```
"What compliance obligations do we have for digital lending?"
"Compare RBI Digital Lending v1.0 and v1.1"
"Which regulations apply to a healthcare startup?"
"Create a compliance action plan for Acme Fintech"
"Show me all regulations that apply to multiple industries"
```

### Edge Cases
```
"Show me regulations for a non-existent company"
"Get details on a regulation that doesn't exist"
"Search for regulations with special characters: @#$%"
"What regulations apply to a company in Mars?"
```

## ✅ Success Criteria

- [ ] All 27 tools callable from NitroStudio chat
- [ ] All 4 widgets render without errors
- [ ] Tool response time < 2 seconds
- [ ] Widget render time < 1 second
- [ ] Natural language prompts understood
- [ ] Multi-turn conversations work
- [ ] Error handling works
- [ ] Data integrity verified

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget shows "Loading…" forever | Check `export const dynamic = 'force-dynamic'` in widget page |
| Tool returns empty results | Check clean reseed was executed |
| Tool returns error | Check input parameters match schema |
| Widget styling broken | Check CSS is vanilla CSS (not Tailwind) |
| Dev server not connected | Run `npm run dev` or check NitroStudio connection |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app.module.ts` | Root module with all imports |
| `src/modules/*/` | 10 modules with tools |
| `src/widgets/app/*/page.tsx` | 4 widgets |
| `src/validation/clean-reseed.ts` | Clean reseed script |
| `prisma/schema.prisma` | Database schema |
| `.env.example` | Environment template |

## 📚 Documentation

- `NITROSTUDIO_TESTING_GUIDE.md` — Testing procedures
- `PHASE_2_INTERACTIVE_TESTING_PLAN.md` — Testing checklist
- `PROJECT_ARCHITECTURE.md` — Architecture reference
- `SESSION_SUMMARY.md` — Session overview
- `demo-flow.md` — Demo scenario
- `validation-plan.md` — Validation strategy

## 🎯 Next Steps

1. Execute clean reseed
2. Test tools in NitroStudio chat
3. Test widgets
4. Verify conversational flow
5. Fix any issues
6. Generate final report

---

**Last Updated**: July 18, 2026  
**Version**: 0.1.0  
**Status**: Ready for Phase 2 Testing
