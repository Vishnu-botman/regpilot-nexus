# RegPilot Nexus — Phase 2: Interactive Testing Plan

## Current Status

**Project**: RegPilot Nexus v0.1.0  
**Phase**: 2 — Interactive Testing in NitroStudio  
**Date**: July 18, 2026  
**Status**: Ready for Testing

## What's Complete (Phase 1.5)

### ✅ Core Infrastructure
- [x] 10 modules scaffolded (Regulations, Compliance, Company, Enterprise, Knowledge, Embeddings, Scheduler, Monitor, Parser, Extractor)
- [x] 27 MCP tools implemented
- [x] 4 widgets created (Regulation Explorer, Compliance Dashboard, Action Plan Board, Applicability Matrix)
- [x] Prisma schema with 13 models
- [x] PostgreSQL database connected (Supabase)
- [x] All modules registered in `src/app.module.ts`

### ✅ Data Model
- [x] 28 regulations seeded (RBI, SEBI, MCA, MeitY, CERT-In, MoLE, IRDAI, TRAI, FSSAI, MoEFCC, CERC, CBIC, CDSCO)
- [x] 30 versions with change tracking
- [x] 36 sections with hierarchical structure
- [x] 27 obligations with deadlines and penalties
- [x] 15 company profiles with policies
- [x] 13 applicability rules
- [x] 11 deadlines with multiple types
- [x] 7 penalties with severity levels
- [x] 6 reporting requirements

### ✅ Validation
- [x] 18 automated tests (all passed)
- [x] 80.3% comprehensive validation pass rate
- [x] Edge case testing (20 scenarios)
- [x] Scale testing (16 tests)
- [x] Provider configuration testing (12 tests)
- [x] Conversational simulation (7 personas)

### ✅ Documentation
- [x] Demo flow guide (`demo-flow.md`)
- [x] Validation plan (`validation-plan.md`)
- [x] Phase 1.5 validation report (`phase1.5-validation-report.md`)
- [x] Full validation report (`validation-report-full.md`)

## What's Next (Phase 2)

### 🎯 Immediate Tasks (This Session)

#### 1. Execute Clean Reseed
```bash
# Option A: Via npm script
npm run worker

# Option B: Direct execution
npx tsx src/validation/clean-reseed.ts
```

**Expected Output**:
- 13 regulators
- 28 regulations
- 30 versions
- 36 sections
- 13 applicability rules
- 27 obligations
- 11 deadlines
- 7 penalties
- 6 reporting requirements
- 15 company profiles
- 10 policies

#### 2. Test Core MCP Tools in NitroStudio Chat

**Regulations Module** (5 tools):
- [ ] `search_regulations` — Search by keyword, regulator, type, status
- [ ] `get_regulation` — Get full regulation with sections
- [ ] `compare_regulation_versions` — Show diff between versions
- [ ] `get_regulation_versions` — List all versions
- [ ] `explain_regulation` — Plain language explanation

**Compliance Module** (6 tools):
- [ ] `evaluate_applicability` — Check if regulation applies to company
- [ ] `find_obligations` — Find obligations with filters
- [ ] `generate_action_plan` — Create prioritized action plan
- [ ] `assess_company` — Alias for evaluate_applicability
- [ ] `find_compliance_obligations` — Alias for find_obligations
- [ ] `generate_gap_report` — Alias for generate_action_plan
- [ ] `simulate_compliance` — Test hypothetical company profile

**Company Module** (3 tools):
- [ ] `get_company_profile` — Get company details
- [ ] `update_company_profile` — Update profile fields
- [ ] `manage_policies` — List/create/update policies

**Knowledge Module** (2 tools):
- [ ] `semantic_search` — Search regulations by semantic similarity
- [ ] `get_regulation_chunks` — Get text chunks from regulation

**Enterprise Module** (2 tools):
- [ ] `create_github_issue` — Create GitHub issue (stub)
- [ ] `notify_slack` — Send Slack notification (stub)

**Scheduler Module** (4 tools):
- [ ] `get_scheduler_status` — Get job status
- [ ] `trigger_monitoring_job` — Run job manually
- [ ] `update_job_schedule` — Update cron schedule
- [ ] `start_scheduler` / `stop_scheduler` — Control scheduler

**Monitor Module** (3 tools):
- [ ] `check_regulatory_source` — Check single source
- [ ] `list_regulatory_sources` — List all sources
- [ ] `get_recent_regulations` — Get recently discovered regulations

**Parser Module** (2 tools):
- [ ] `parse_document` — Parse HTML/PDF/text
- [ ] `extract_metadata` — Extract document metadata

**Extractor Module** (1 tool):
- [ ] `extract_compliance_objects` — Extract obligations/deadlines/penalties

**Embeddings Module** (2 tools):
- [ ] `chunk_and_embed` — Generate embeddings for regulation
- [ ] `get_regulation_embeddings` — Retrieve embeddings

#### 3. Test All 4 Widgets

**Regulation Explorer**:
- [ ] Search regulations by keyword
- [ ] Filter by regulator (RBI, SEBI, MCA, etc.)
- [ ] Filter by status (active, superseded, etc.)
- [ ] Click to view regulation details
- [ ] View sections tree
- [ ] View version history
- [ ] Dark/light theme toggle

**Compliance Dashboard**:
- [ ] View summary cards (total, mandatory, high priority, score)
- [ ] View regulator breakdown
- [ ] View priority breakdown
- [ ] View company profile
- [ ] View obligations list
- [ ] Filter by priority
- [ ] Filter by regulator
- [ ] Refresh data

**Action Plan Board**:
- [ ] View Kanban board (Immediate, Scheduled, Monitored)
- [ ] View obligation cards with priority badges
- [ ] View deadline indicators
- [ ] Click to view obligation details
- [ ] Generate plan button
- [ ] Dark/light theme toggle

**Applicability Matrix**:
- [ ] View table with regulations as rows
- [ ] View columns (Regulation, Status, Applicable, Confidence, Match)
- [ ] View company profile summary
- [ ] Evaluate All button
- [ ] Click to view detailed evaluation
- [ ] Match icons (✅ ❌ ⚠️ ❓)
- [ ] Dark/light theme toggle

#### 4. Verify Conversational Flow (50+ Prompts)

**Direct Questions** (10 prompts):
- [ ] "What compliance obligations do we have for digital lending?"
- [ ] "Show me all RBI regulations"
- [ ] "Tell me about the DPDP Act"
- [ ] "Does the Digital Lending Directions apply to Acme Fintech?"
- [ ] "What are the deadlines for LODR compliance?"
- [ ] "List all mandatory obligations"
- [ ] "Show me regulations for healthcare companies"
- [ ] "What penalties apply to data protection violations?"
- [ ] "Get the latest version of the Companies Act"
- [ ] "Compare RBI Digital Lending v1.0 and v1.1"

**Indirect Questions** (10 prompts):
- [ ] "We're a fintech NBFC in India. What do we need to comply with?"
- [ ] "I need to understand our compliance posture"
- [ ] "What's the difference between SEBI LODR and DPDP Act?"
- [ ] "Which regulations have the most obligations?"
- [ ] "Show me regulations that apply to multiple industries"
- [ ] "What are the most critical compliance deadlines?"
- [ ] "Which company profiles have the most policies?"
- [ ] "What's the relationship between RBI and SEBI regulations?"
- [ ] "Show me regulations that were updated recently"
- [ ] "What are the common compliance themes across regulators?"

**Complex/Multi-Step** (5 prompts):
- [ ] "Create a compliance action plan for Acme Fintech covering all applicable regulations"
- [ ] "Compare compliance obligations for fintech vs healthcare companies"
- [ ] "Generate a gap report for our current compliance status"
- [ ] "Show me all regulations that apply to our company and their obligations"
- [ ] "Create a timeline of all compliance deadlines for the next 12 months"

**Ambiguous/Short** (5 prompts):
- [ ] "Compliance?"
- [ ] "Regulations"
- [ ] "Obligations"
- [ ] "Deadlines"
- [ ] "Action plan"

**Conversational/Chatty** (5 prompts):
- [ ] "Hey, can you help me understand our compliance obligations?"
- [ ] "I'm new to this company. What do I need to know about compliance?"
- [ ] "We just got audited. What should we focus on?"
- [ ] "What's the most important regulation for our business?"
- [ ] "Can you explain this in simple terms?"

**Follow-up/Context-Dependent** (5 prompts):
- [ ] [After searching regulations] "Tell me more about the first one"
- [ ] [After viewing obligations] "What are the deadlines for these?"
- [ ] [After action plan] "Which ones are mandatory?"
- [ ] [After company profile] "What policies do we have?"
- [ ] [After applicability check] "What are the obligations?"

**Correction/Clarification** (5 prompts):
- [ ] "No, I meant the other regulation"
- [ ] "Can you show me just the mandatory ones?"
- [ ] "I need more details on that"
- [ ] "What about the previous version?"
- [ ] "Show me a different company"

**Edge Cases** (5 prompts):
- [ ] "Show me regulations for a non-existent company"
- [ ] "Get details on a regulation that doesn't exist"
- [ ] "Search for regulations with special characters: @#$%"
- [ ] "Show me 1000 regulations"
- [ ] "What regulations apply to a company in Mars?"

#### 5. Fix Any Issues Discovered

**Common Issues to Watch For**:
- [ ] Widget shows "Loading…" forever
- [ ] Tool returns empty results
- [ ] Tool returns error with unhelpful message
- [ ] Widget styling is broken
- [ ] Conversational routing is incorrect
- [ ] Data is stale or inconsistent
- [ ] Performance is slow (>2 seconds)

**Fix Process**:
1. Identify root cause
2. Create GitHub issue
3. Patch code
4. Re-test
5. Document fix

#### 6. Generate Final Validation Report

**Report Should Include**:
- [ ] Test execution summary (pass/fail counts)
- [ ] Tool coverage (27/27 tested)
- [ ] Widget coverage (4/4 tested)
- [ ] Conversational flow results (50+ prompts)
- [ ] Performance metrics
- [ ] Data integrity checks
- [ ] Issues discovered and fixed
- [ ] Recommendations for next phase

## Success Criteria

### ✅ All Tools Callable
- Every tool in NitroStudio chat returns expected data
- Error handling works for invalid inputs
- Pagination works for large result sets

### ✅ All Widgets Render
- Every widget displays without errors
- Interactive features work (search, filter, click)
- Theme support works (dark/light)

### ✅ Conversational Flow Works
- Natural language prompts understood
- Multi-turn conversations maintain context
- Tool selection is appropriate
- Widget selection is appropriate

### ✅ Data Integrity
- No orphaned records
- Foreign key relationships intact
- Unique constraints satisfied
- Timestamps are correct

### ✅ Performance
- Tool response time < 2 seconds
- Widget render time < 1 second
- Database queries optimized

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | 1 day | ✅ Complete |
| Phase 1.5: Validation | 1 day | ✅ Complete |
| **Phase 2: Interactive Testing** | **1-2 days** | 🔄 In Progress |
| Phase 3: Production Deployment | 1 day | ⏳ Pending |

## Deliverables

### By End of Phase 2
- [ ] Clean reseed executed
- [ ] All 27 tools tested in NitroStudio
- [ ] All 4 widgets tested in NitroStudio
- [ ] 50+ conversational prompts tested
- [ ] All issues documented and fixed
- [ ] Final validation report generated
- [ ] Project ready for production deployment

## Notes

- **Database**: Supabase PostgreSQL (ap-southeast-1)
- **Dev Server**: Connected to NitroStudio globally
- **Modules**: 10 total (all registered in app.module.ts)
- **Tools**: 27 total (all implemented)
- **Widgets**: 4 total (all implemented)
- **Regulations**: 28 total (all seeded)
- **Companies**: 15 total (all seeded)

## Next Phase (Phase 3)

After Phase 2 is complete:
1. Deploy to production environment
2. Set up monitoring and alerting
3. Configure API integrations (OpenAI, GitHub, Slack)
4. Implement P2 widgets (Diff Viewer, Timeline)
5. Add real web scraping for Monitor module
6. Implement real HTML parsing with Cheerio
7. Add OpenAI/Anthropic API integration for embeddings
8. Launch public beta

---

**Last Updated**: July 18, 2026  
**Next Review**: After Phase 2 completion
