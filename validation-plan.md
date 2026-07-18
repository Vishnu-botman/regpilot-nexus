# RegPilot Nexus — Comprehensive Platform Validation Plan

## Objective

Validate RegPilot Nexus as thoroughly as possible before NitroStudio interactive testing. The goal is not to achieve a high pass rate — the goal is to **find weaknesses** by behaving like real users across multiple personas, regulatory domains, and interaction patterns.

---

## Validation Philosophy

| Principle | Description |
|---|---|
| **Break, don't verify** | Actively attempt to break the platform, not just verify expected outputs |
| **Multi-persona** | Think like Compliance Officer, Auditor, Risk Manager, Legal Counsel, Startup Founder, Enterprise Team, Regulator, First-time User |
| **Cross-domain** | Validate across 15+ Indian regulatory families |
| **Conversational** | Test through natural language, not deterministic prompts |
| **Scale-aware** | Evaluate behavior with hundreds of regulations and thousands of obligations |
| **Provider-agnostic** | Ensure graceful degradation when providers are not configured |

---

## Phase 1: Cross-Regulation Seed Data

### 1.1 Regulatory Families to Validate

| # | Family | Regulations | Regulator |
|---|---|---|---|
| 1 | **Financial — Banking** | RBI Master Direction – Digital Lending | RBI |
| 2 | **Financial — Banking** | RBI Master Direction – KYC | RBI |
| 3 | **Financial — Fintech** | RBI Guidelines on Payment Aggregators | RBI |
| 4 | **Financial — Forex** | FEMA Regulations (Non-debt instruments) | RBI |
| 5 | **Financial — AML** | PMLA Rules – KYC Requirements | RBI/Fin Ministry |
| 6 | **Securities — Listing** | SEBI LODR Regulations, 2015 (amended 2026) | SEBI |
| 7 | **Securities — Insider Trading** | SEBI PIT Regulations, 2015 | SEBI |
| 8 | **Securities — IPO** | SEBI ICDR Regulations, 2018 | SEBI |
| 9 | **Securities — Mutual Funds** | SEBI Mutual Fund Regulations, 1996 | SEBI |
| 10 | **Corporate — Company Law** | Companies Act, 2013 (Sections 96-122) | MCA |
| 11 | **Corporate — CSR** | Companies Act, 2013 (Section 135) — CSR Policy | MCA |
| 12 | **Corporate — Accounts** | MCA Companies (Accounts) Amendment Rules, 2026 | MCA |
| 13 | **Data — Privacy** | Digital Personal Data Protection Act, 2023 | MeitY |
| 14 | **Cyber — Incident Response** | CERT-In Direction No. 20/2022 (Incident Reporting) | CERT-In |
| 15 | **Cyber — IT** | Information Technology Act, 2000 (Sections 43, 66, 72A) | MeitY |
| 16 | **Labour — Wages** | Code on Wages, 2019 | MoLE |
| 17 | **Labour — Social Security** | Code on Social Security, 2020 | MoLE |
| 18 | **Labour — Safety** | Occupational Safety, Health and Working Conditions Code, 2020 | MoLE |
| 19 | **Labour — Industrial Relations** | Industrial Relations Code, 2020 | MoLE |
| 20 | **Insurance** | IRDAI (Registration of Corporate Agents) Regulations, 2015 | IRDAI |
| 21 | **Insurance** | IRDAI (Insurance Advertisements) Regulations, 2022 | IRDAI |
| 22 | **Telecom** | TRAI QoS Regulations (Mobile Services) | TRAI |
| 23 | **Food** | FSSAI Food Safety and Standards Regulations | FSSAI |
| 24 | **Environment** | Environment Protection Act, 1986 (EIA Notification) | MoEFCC |
| 25 | **Environment** | E-Waste (Management) Rules, 2016 | MoEFCC |
| 26 | **Energy** | CERC (Indian Electricity Grid Code) Regulations | CERC |
| 27 | **Tax — GST** | GST Council Circulars (Compliance) | CBIC |
| 28 | **Healthcare** | Medical Device Rules, 2017 | CDSCO |

### 1.2 Seed Data Requirements

For each regulation, create:
- 1 Regulator record
- 1-2 Regulation records (with realistic metadata)
- 1-2 Version records (to test version comparison)
- 3-5 Section records (hierarchical structure)
- 2-4 Obligation records (varying types, priorities, frequencies)
- 1-2 Applicability rules (industry/entity/jurisdiction filters)
- 1-2 Deadline records (different deadline types)
- 1-2 Penalty records (different penalty types)
- 1-2 Reporting requirement records
- 1 Citation record

**Target:** 100+ obligations across all regulations for meaningful scale testing.

### 1.3 Company Profiles to Create

| # | Company | Industry | EntityType | Entity Type | Jurisdictions | Use Case |
|---|---|---|---|---|---|---|
| 1 | Acme Fintech Solutions | fintech | private_company | digital_lending | india | NBFC/Fintech |
| 2 | Bharat National Bank | banking | public_sector_bank | banking | india | Public Sector Bank |
| 3 | CyberShield Security | cybersecurity | private_company | it_services | india | CERT-In compliance |
| 4 | DataVault Technologies | saas | startup | saas | india,usa | DPDP Act |
| 5 | GreenEnergy Corp | energy | public_limited | power_generation | india | CERC regulations |
| 6 | HealthPlus Medical Devices | healthcare | private_company | medical_devices | india | CDSCO/FSSAI |
| 7 | India Manufacturing Ltd | manufacturing | public_limited | manufacturing | india | Labour codes |
| 8 | LifeCare Insurance | insurance | insurance_company | life_insurance | india | IRDAI |
| 9 | MediaCorp Telecom | telecom | public_limited | telecom | india | TRAI |
| 10 | SafeFood Industries | food | private_company | food_processing | india | FSSAI |
| 11 | TradeWinds Exports | trading | private_company | export_import | india | FEMA/PMLA |
| 12 | UrbanEco Real Estate | real_estate | private_company | construction | india | Environment/E-Waste |
| 13 | VirtuLearn EdTech | education | startup | edtech | india | DPDP Act |
| 14 | Zenith Insurance Brokers | insurance | insurance_broker | brokerage | india | IRDAI |
| 15 | Quantum Finance NBFC | nbfc | private_company | nbfc | india | RBI/FEMA |

### 1.4 Applicability Matrix

Validate that each company correctly matches against regulations:

| Company | Expected Applicable Regulations |
|---|---|
| Acme Fintech | RBI Digital Lending, RBI KYC, FEMA, PMLA, SEBI LODR (if listed), DPDP |
| Bharat National Bank | RBI KYC, FEMA, PMLA, SEBI LODR (listed), DPDP |
| CyberShield Security | CERT-In Directions, IT Act, DPDP |
| DataVault Technologies | DPDP, IT Act |
| GreenEnergy Corp | CERC, Environment Protection Act |
| HealthPlus Medical | CDSCO, FSSAI (if food-related), DPDP |
| India Manufacturing | Labour Codes (all 4), E-Waste, Environment |
| LifeCare Insurance | IRDAI (all), DPDP |
| MediaCorp Telecom | TRAI, DPDP, IT Act |
| SafeFood Industries | FSSAI, DPDP |
| TradeWinds Exports | FEMA, PMLA |
| UrbanEco Real Estate | Environment, E-Waste, Labour Codes |
| VirtuLearn EdTech | DPDP, IT Act |
| Zenith Insurance Brokers | IRDAI, DPDP |
| Quantum Finance NBFC | RBI Digital Lending, RBI KYC, FEMA, PMLA, DPDP |

---

## Phase 2: MCP Tool Validation

### 2.1 Tool Inventory (27 Tools)

| Module | Tools | Test Priority |
|---|---|---|
| **regulations** | search_regulations, get_regulation, compare_regulation_versions, get_regulation_versions | HIGH |
| **compliance** | evaluate_applicability, find_obligations, generate_action_plan | HIGH |
| **company** | get_company_profile, update_company_profile, manage_policies | HIGH |
| **knowledge** | semantic_search, get_regulation_chunks | MEDIUM |
| **enterprise** | create_github_issue, notify_slack | MEDIUM |
| **scheduler** | get_scheduler_status, trigger_monitoring_job, update_job_schedule, start_scheduler, stop_scheduler | LOW |
| **monitor** | check_regulatory_source, list_regulatory_sources, get_recent_regulations | LOW |
| **parser** | parse_document, extract_metadata | LOW |
| **extractor** | extract_compliance_objects | LOW |
| **embeddings** | chunk_and_embed, get_regulation_embeddings, delete_regulation_embeddings | LOW |

### 2.2 Tool Test Matrix

For each HIGH priority tool, test:

| Test Type | Description | Count |
|---|---|---|
| **Valid Input** | Correct inputs, expected outputs | 10 per tool |
| **Invalid Input** | Missing required fields, wrong types | 5 per tool |
| **Empty Results** | No matching data | 3 per tool |
| **Edge Cases** | Null, undefined, special characters, XSS | 5 per tool |
| **Large Datasets** | Many regulations/obligations | 2 per tool |
| **Cross-Regulation** | Query across different regulators | 5 per tool |
| **Multi-Company** | Query with different company profiles | 3 per tool |

### 2.3 Detailed Test Scenarios

#### `search_regulations`
1. Search "digital lending" → expect RBI result
2. Search "LODR" → expect SEBI result
3. Search "CSR" → expect MCA result
4. Search "data protection" → expect DPDP result
5. Search by regulator "RBI" → expect all RBI regulations
6. Search by regulator "SEBI" → expect all SEBI regulations
7. Search by status "active" → expect only active regulations
8. Search by documentType "circular" → expect circulars
9. Empty search → expect all regulations
10. Search with special chars: `<script>alert(1)</script>` → expect safe handling
11. Search "xyz123nonexistent" → expect empty results
12. Search "RBI" with limit 2 → expect max 2 results
13. Search across 20+ regulations → verify performance
14. Search with regulator + status filter combined
15. Search "amendment" → expect amended regulations

#### `evaluate_applicability`
1. Acme Fintech vs RBI Digital Lending → expect applicable
2. Acme Fintech vs SEBI LODR → expect not applicable (not listed)
3. Bharat National Bank vs SEBI LODR → expect applicable (listed)
4. CyberShield Security vs CERT-In → expect applicable
5. DataVault Technologies vs DPDP → expect applicable
6. GreenEnergy Corp vs CERC → expect applicable
7. LifeCare Insurance vs IRDAI → expect applicable
8. SafeFood Industries vs FSSAI → expect applicable
9. Company with no matching industry → expect not applicable
10. Non-existent company → expect error
11. Non-existent regulation → expect error
12. Company with multiple applicable regulations → verify all returned
13. Evaluate with `versionResolution: 'latest'`
14. Evaluate with `versionResolution: 'all'`
15. Evaluate with `versionResolution: 'specific'`

#### `find_obligations`
1. Find obligations for RBI Digital Lending → expect 4+
2. Find obligations for SEBI LODR → expect 3+
3. Find obligations for DPDP Act → expect 3+
4. Filter by priority "high" → expect only high priority
5. Filter by mandatory true → expect only mandatory
6. Filter by regulation + priority combined
7. Find obligations for company with no applicable regulations → expect empty
8. Find obligations across ALL regulations → expect comprehensive list
9. Find obligations with deadlines expiring soon
10. Find obligations with reporting requirements

#### `generate_action_plan`
1. Generate plan for Acme Fintech → expect immediate/scheduled/monitored buckets
2. Generate plan for Bharat National Bank → expect different plan
3. Generate plan for company with no obligations → expect empty plan
4. Verify obligation structure in each bucket
5. Verify deadlines are included
6. Verify reporting requirements are included

#### `compare_regulation_versions`
1. Compare RBI Digital Lending v1.0 vs v1.1 → expect changes
2. Compare same version → expect no changes
3. Compare non-existent versions → expect error
4. Verify added sections highlighted
5. Verify removed sections highlighted
6. Verify modified sections highlighted

#### `get_company_profile`
1. Get Acme Fintech profile → expect full details
2. Get non-existent company → expect null
3. Verify all fields returned correctly
4. Verify policies included

#### `update_company_profile`
1. Update industry → verify change
2. Update employeeCount → verify change
3. Update with invalid data → expect error
4. Revert update → verify original

#### `manage_policies`
1. List policies → expect existing policies
2. Create new policy → verify creation
3. Update policy → verify change
4. List with invalid companyId → expect error

### 2.4 Knowledge Module Tests

| Test | Description |
|---|---|
| semantic_search with no embeddings | Expect clear message about missing embeddings |
| semantic_search with embeddings | Expect vector similarity results |
| get_regulation_chunks with valid regulation | Expect chunks |
| get_regulation_chunks with non-existent regulation | Expect empty |
| get_regulation_chunks with section filter | Expect filtered chunks |

### 2.5 Enterprise Module Tests

| Test | Description |
|---|---|
| create_github_issue without token | Expect graceful fallback with mock response |
| create_github_issue with invalid repo | Expect error |
| notify_slack without token | Expect graceful fallback with mock response |
| notify_slack with valid channel | Expect success (if token configured) |

### 2.6 Scheduler Module Tests

| Test | Description |
|---|---|
| get_scheduler_status | Expect job list |
| trigger_monitoring_job for RBI | Expect job triggered |
| trigger_monitoring_job for invalid source | Expect error |
| update_job_schedule | Expect schedule updated |
| start/stop_scheduler | Expect state toggled |

### 2.7 Monitor Module Tests

| Test | Description |
|---|---|
| list_regulatory_sources | Expect 4 sources |
| check_regulatory_source for RBI | Expect documents found (or graceful error) |
| check_regulatory_source for invalid | Expect error |
| get_recent_regulations | Expect recent documents |

### 2.8 Parser Module Tests

| Test | Description |
|---|---|
| parse_document with HTML | Expect sections extracted |
| parse_document with text | Expect sections extracted |
| parse_document with invalid format | Expect error |
| extract_metadata from HTML | Expect metadata extracted |

### 2.9 Extractor Module Tests

| Test | Description |
|---|---|
| extract_compliance_objects from valid sections | Expect obligations/deadlines/penalties |
| extract_compliance_objects from empty content | Expect empty results |
| extract_compliance_objects from regulatory text | Expect structured objects |

### 2.10 Embeddings Module Tests

| Test | Description |
|---|---|
| chunk_and_embed without API key | Expect mock embeddings |
| chunk_and_embed with API key | Expect real embeddings |
| get_regulation_embeddings | Expect stored embeddings |
| delete_regulation_embeddings | Expect deletion |

---

## Phase 3: Conversational Validation

### 3.1 Prompt Categories

Test the platform's ability to correctly invoke MCP tools from natural language.

#### Category A: Direct Questions (Expected: Direct tool invocation)
1. "What regulations does RBI have?"
2. "Show me SEBI LODR"
3. "What are the penalties for non-compliance?"
4. "List all obligations for Digital Lending"
5. "What is the Companies Act?"
6. "Show me recent CERT-In advisories"
7. "What changed in the latest amendment?"
8. "Compare version 1.0 and 1.1 of Digital Lending"
9. "Does DPDP apply to my company?"
10. "What are our mandatory obligations?"

#### Category B: Indirect Questions (Expected: Inferred tool invocation)
11. "Anything new from RBI?" → search_regulations (RBI)
12. "What should I do next?" → generate_action_plan
13. "Show only high priority items" → find_obligations (priority filter)
14. "Show deadlines only" → find_obligations (deadline focus)
15. "Am I compliant with SEBI?" → evaluate_applicability + find_obligations
16. "What's our compliance score?" → evaluate_applicability
17. "Show me reporting requirements" → find_obligations (reporting)
18. "Which regulations affect fintech?" → search_regulations + evaluate_applicability
19. "Which regulations affect NBFCs?" → search_regulations + evaluate_applicability
20. "What changed this month?" → search_regulations (date filter)

#### Category C: Complex/Multi-Step (Expected: Multi-tool orchestration)
21. "We're expanding to healthcare — what new regulations apply?" → search_regulations (healthcare) + evaluate_applicability
22. "We're planning an IPO — what do we need?" → search_regulations (SEBI ICDR) + find_obligations
23. "We acquired a listed company — what changes?" → evaluate_applicability (listed) + find_obligations
24. "We're launching a data product — what applies?" → search_regulations (DPDP, IT Act) + evaluate_applicability
25. "We have 500 employees now — what labour codes apply?" → search_regulations (labour) + evaluate_applicability

#### Category D: Ambiguous/Short (Expected: Clarification or best-guess)
26. "RBI?" → search_regulations (RBI)
27. "Penalties?" → find_obligations (penalties) or search regulations with penalties
28. "Deadline?" → find_obligations (deadlines)
29. "DPDP" → search_regulations (DPDP)
30. "Am I safe?" → evaluate_applicability

#### Category E: Conversational/Chatty (Expected: Natural interaction)
31. "Hey, can you help me understand what regulations apply to our fintech startup?"
32. "We just got a new RBI circular — should we be worried?"
33. "Our auditor is asking about CSR compliance — what do we need?"
34. "We're hiring 100 new employees — any labour law implications?"
35. "We're processing personal data — are we covered under DPDP?"

#### Category F: Follow-up/Context-Dependent (Expected: Context awareness)
36. "What about SEBI?" (after asking about RBI)
37. "And the penalties?" (after listing obligations)
38. "Does this apply to our NBFC subsidiary?" (after discussing RBI regulations)
39. "What about the 2026 amendment?" (after discussing a regulation)
40. "Show me the details" (after listing regulations)

#### Category G: Correction/Clarification (Expected: Adapt to corrections)
41. "No, I meant SEBI, not RBI"
42. "Actually, we're a listed company now"
43. "Sorry, I meant the DPDP Act, not IT Act"
44. "Wait, we also have operations in USA"
45. "Correction — we're an NBFC, not a bank"

### 3.2 Expected Tool Mapping

| Prompt Category | Expected Tools |
|---|---|
| Direct Questions | 1 tool (search, get, find) |
| Indirect Questions | 1-2 tools (search + evaluate, or generate) |
| Complex/Multi-Step | 2-3 tools (search + evaluate + find) |
| Ambiguous/Short | 1 tool (best guess) |
| Conversational | 1-2 tools (search + evaluate) |
| Follow-up | 1-2 tools (context-dependent) |
| Correction | 1-2 tools (adapted) |

---

## Phase 4: Widget Validation

### 4.1 Widget Test Matrix

| Widget | Test Type | Scenarios |
|---|---|---|
| **Regulation Explorer** | Loading | Search with results, search with no results |
| | Error | Invalid query, API error |
| | Navigation | Click regulation, view versions, view sections |
| | State | Filter state persistence, search state |
| | Theme | Dark mode, light mode |
| **Compliance Dashboard** | Loading | Data load, empty data |
| | Error | Company not found, API error |
| | Filters | Priority filter, regulator filter |
| | Refresh | Manual refresh button |
| | Theme | Dark mode, light mode |
| **Action Plan Board** | Loading | Plan with obligations, empty plan |
| | Error | Company not found |
| | Columns | Immediate, Scheduled, Monitored |
| | Detail | Click obligation, view details |
| | Theme | Dark mode, light mode |
| **Applicability Matrix** | Loading | Matrix with data, empty matrix |
| | Error | Company not found |
| | Evaluate | Click evaluate, view results |
| | Detail | Click row, view details |
| | Theme | Dark mode, light mode |

### 4.2 Widget-Tool Integration Tests

| Widget | Tool | Test |
|---|---|---|
| Regulation Explorer | search_regulations | Search returns results |
| Regulation Explorer | get_regulation | Detail view loads |
| Regulation Explorer | get_regulation_versions | Versions displayed |
| Compliance Dashboard | find_obligations | Obligations loaded |
| Compliance Dashboard | evaluate_applicability | Applicability evaluated |
| Compliance Dashboard | get_company_profile | Profile displayed |
| Action Plan Board | generate_action_plan | Plan generated |
| Applicability Matrix | evaluate_applicability | Matrix evaluated |

---

## Phase 5: Edge Case Validation

### 5.1 Invalid State Tests

| Scenario | Expected Behavior |
|---|---|
| Non-existent regulation ID | Graceful error or null |
| Non-existent company ID | Graceful error or null |
| Non-existent regulator | Graceful error or empty results |
| Repealed regulation | Excluded from default queries |
| Superseded version | Handled in version resolution |
| Empty database | Graceful empty states |
| Duplicate records | Unique constraints enforced |
| Invalid identifiers | Input validation |
| Conflicting applicability | Resolve with priority logic |
| Missing obligations | Empty state displayed |
| Missing sections | Graceful degradation |
| NULL values in required fields | Validation error |
| Extremely long strings | Truncation or validation |
| SQL injection attempts | Safe (Prisma parameterized) |
| XSS in search | Safe (escaped output) |

### 5.2 Boundary Tests

| Scenario | Expected Behavior |
|---|---|
| 0 regulations | Empty state |
| 1 regulation | Works correctly |
| 100 regulations | Performance acceptable |
| 1000 obligations | Search still works |
| 10000 sections | Pagination or streaming |
| Empty search string | Returns all or提示 |
| Search with only spaces | Returns all or提示 |
| Unicode in search | Works correctly |
| Very long regulation content | Chunking works |
| Special characters in IDs | Validation |

---

## Phase 6: Scale Validation

### 6.1 Dataset Targets

| Metric | Target |
|---|---|
| Regulations | 100+ |
| Versions | 150+ |
| Sections | 500+ |
| Obligations | 200+ |
| Applicability Rules | 100+ |
| Deadlines | 150+ |
| Penalties | 100+ |
| Reporting Requirements | 80+ |
| Citations | 100+ |
| Company Profiles | 15+ |
| Vector Chunks | 1000+ |

### 6.2 Performance Metrics

| Operation | Target Latency |
|---|---|
| search_regulations | < 500ms |
| evaluate_applicability | < 1s |
| find_obligations | < 500ms |
| generate_action_plan | < 1s |
| get_regulation | < 300ms |
| compare_regulation_versions | < 1s |
| semantic_search | < 2s |
| Widget load | < 3s |
| Widget interaction | < 500ms |

---

## Phase 7: Provider Configuration Validation

### 7.1 Provider States

| Provider | Configured State | Expected Behavior |
|---|---|---|
| OpenAI | No API key | Mock embeddings, clear message |
| OpenAI | Valid API key | Real embeddings |
| OpenAI | Invalid API key | Graceful fallback to mock |
| Anthropic | No API key | Mock embeddings, clear message |
| Anthropic | Valid API key | Real embeddings |
| GitHub | No token | Mock response, clear message |
| GitHub | Valid token | Real API call |
| GitHub | Invalid token | Graceful error |
| Slack | No token | Mock response, clear message |
| Slack | Valid token | Real notification |
| Slack | Invalid token | Graceful error |

### 7.2 Configuration Tests

| Test | Description |
|---|---|
| All providers unconfigured | Platform works with mock data |
| Only OpenAI configured | Embeddings work, enterprise mocked |
| Only GitHub configured | GitHub works, Slack mocked |
| All providers configured | Full functionality |
| Invalid config values | Graceful handling |

---

## Phase 8: Data Integrity Validation

### 8.1 Referential Integrity

| Check | Expected |
|---|---|
| All obligations have valid sectionId | No orphans |
| All deadlines have valid obligationId | No orphans |
| All penalties have valid obligationId | No orphans |
| All sections have valid versionId | No orphans |
| All versions have valid regulationId | No orphans |
| All regulations have valid regulatorId | No orphans |
| All applicabilities have valid sectionId | No orphans |
| All citations have valid obligationId | No orphans |
| All policies have valid companyId | No orphans |

### 8.2 Constraint Validation

| Check | Expected |
|---|---|
| Unique regulator abbreviations | Enforced |
| Unique company names | Enforced |
| Valid status values | Only allowed values |
| Valid document types | Only allowed values |
| Valid priority values | Only allowed values |
| Valid deadline types | Only allowed values |
| Valid penalty types | Only allowed values |

---

## Implementation Strategy

### Step 1: Create Comprehensive Seed Script
Create `src/validation/comprehensive-seed.ts` that seeds:
- 28 regulations across all regulatory families
- 15+ company profiles
- 200+ obligations
- All related entities

### Step 2: Create Tool Test Suite
Create `src/validation/tool-validation.ts` that tests:
- All 27 MCP tools
- 10+ test cases per HIGH priority tool
- Invalid input handling
- Edge cases

### Step 3: Create Conversational Test Suite
Create `src/validation/conversational-validation.ts` that:
- Defines 50+ natural language prompts
- Maps expected tool invocations
- Validates tool selection logic

### Step 4: Create Widget Test Suite
Create `src/validation/widget-validation.ts` that:
- Tests all 4 widgets
- Validates tool integration
- Tests loading/error/empty states

### Step 5: Create Edge Case Test Suite
Create `src/validation/edge-case-validation.ts` that:
- Tests invalid states
- Tests boundary conditions
- Tests security (XSS, SQL injection)

### Step 6: Create Scale Test Suite
Create `src/validation/scale-validation.ts` that:
- Seeds large datasets
- Measures performance
- Validates search quality

### Step 7: Create Provider Configuration Test Suite
Create `src/validation/provider-validation.ts` that:
- Tests all provider states
- Validates graceful degradation
- Tests fallback behavior

### Step 8: Generate Validation Report
Create `validation-report-full.md` with:
- All test results
- Weaknesses discovered
- Recommendations
- Pass/fail summary

---

## Success Criteria

| Criterion | Target |
|---|---|
| Cross-regulation coverage | 28+ regulations across 14 families |
| Company profile coverage | 15+ companies across 10+ industries |
| Tool test coverage | 100+ test cases across 27 tools |
| Conversational test coverage | 50+ natural language prompts |
| Widget test coverage | 4 widgets × 5 test types |
| Edge case coverage | 20+ boundary conditions |
| Scale targets | 100+ regulations, 200+ obligations |
| Provider coverage | 4 providers × 3 states |
| Data integrity | 100% referential integrity |

---

## Weakness Categories to Track

| Category | Examples |
|---|---|
| **Applicability Gaps** | Regulation not matched when it should be |
| **Retrieval Failures** | Search misses relevant regulations |
| **Reasoning Gaps** | Tool selection doesn't match user intent |
| **UX Issues** | Poor error messages, confusing flows |
| **Data Quality** | Incomplete or incorrect regulation data |
| **Performance** | Slow queries, high latency |
| **Scalability** | Degraded performance at scale |
| **Security** | XSS, injection, data exposure |
| **Integration** | API failures, webhook issues |
| **Configuration** | Poor provider fallback messages |

---

## File Structure

```
src/validation/
├── comprehensive-seed.ts          # Large dataset seeding
├── tool-validation.ts             # MCP tool tests
├── conversational-validation.ts   # Natural language tests
├── widget-validation.ts           # Widget tests
├── edge-case-validation.ts        # Edge case tests
├── scale-validation.ts            # Scale tests
├── provider-validation.ts         # Provider config tests
├── run-all-validation.ts          # Orchestrator
└── validation-report-full.md      # Full report
```

---

## Execution Order

1. **Seed comprehensive data** (Step 1)
2. **Run tool validation** (Step 2)
3. **Run conversational validation** (Step 3)
4. **Run widget validation** (Step 4)
5. **Run edge case validation** (Step 5)
6. **Run scale validation** (Step 6)
7. **Run provider validation** (Step 7)
8. **Generate report** (Step 8)

---

## Notes

- All validation should be deterministic where possible
- Non-deterministic tests (conversational) should validate tool selection, not exact output
- Performance benchmarks should be run multiple times for accuracy
- Provider tests should work with and without configured providers
- Scale tests should use realistic data distributions
- Widget tests should validate both happy path and error states
