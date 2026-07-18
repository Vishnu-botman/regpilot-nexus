# RegPilot Nexus — Project Architecture

## Overview

RegPilot Nexus is a comprehensive regulatory compliance MCP (Model Context Protocol) server built with NitroStack. It helps organizations discover, evaluate, and comply with regulations across multiple regulatory domains.

## Technology Stack

- **Framework**: NitroStack v1.0.13
- **Language**: TypeScript 5.3.3
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.10.0
- **Validation**: Zod 3.22.4
- **Scheduling**: node-cron 4.6.0
- **HTML Parsing**: Cheerio 1.2.0
- **Runtime**: Node.js 22.10.0

## Project Structure

```
regpilot-nexus/
├── src/
│   ├── index.ts                          # MCP server bootstrap
│   ├── app.module.ts                     # Root module with all imports
│   ├── worker.ts                         # Worker process entry point
│   ├── health/
│   │   └── system.health.ts              # System health checks
│   ├── modules/
│   │   ├── regulations/                  # Regulation discovery & search
│   │   │   ├── regulations.module.ts
│   │   │   ├── regulations.tools.ts      # 5 tools
│   │   │   ├── regulations.repository.ts
│   │   │   ├── regulations.resources.ts
│   │   │   └── regulations.prompts.ts
│   │   ├── compliance/                   # Compliance evaluation & planning
│   │   │   ├── compliance.module.ts
│   │   │   ├── compliance.tools.ts       # 7 tools
│   │   │   ├── compliance.repository.ts
│   │   │   ├── compliance.resources.ts
│   │   │   └── compliance.prompts.ts
│   │   ├── company/                      # Company profile management
│   │   │   ├── company.module.ts
│   │   │   ├── company.tools.ts          # 3 tools
│   │   │   ├── company.repository.ts
│   │   │   └── company.resources.ts
│   │   ├── enterprise/                   # GitHub & Slack integration
│   │   │   ├── enterprise.module.ts
│   │   │   └── enterprise.tools.ts       # 2 tools
│   │   ├── knowledge/                    # Semantic search & embeddings
│   │   │   ├── knowledge.module.ts
│   │   │   ├── knowledge.tools.ts        # 2 tools
│   │   │   └── knowledge.repository.ts
│   │   ├── embeddings/                   # Embedding generation & storage
│   │   │   ├── embeddings.module.ts
│   │   │   ├── embeddings.tools.ts       # 2 tools
│   │   │   ├── embeddings.service.ts
│   │   │   └── embeddings.types.ts
│   │   ├── scheduler/                    # Cron-based job scheduling
│   │   │   ├── scheduler.module.ts
│   │   │   ├── scheduler.tools.ts        # 4 tools
│   │   │   ├── scheduler.service.ts
│   │   │   └── scheduler.types.ts
│   │   ├── monitor/                      # Regulatory source monitoring
│   │   │   ├── monitor.module.ts
│   │   │   ├── monitor.tools.ts          # 3 tools
│   │   │   ├── monitor.service.ts
│   │   │   └── monitor.types.ts
│   │   ├── parser/                       # Document parsing
│   │   │   ├── parser.module.ts
│   │   │   ├── parser.tools.ts           # 2 tools
│   │   │   ├── parser.service.ts
│   │   │   └── parser.types.ts
│   │   └── extractor/                    # Compliance object extraction
│   │       ├── extractor.module.ts
│   │       ├── extractor.tools.ts        # 1 tool
│   │       ├── extractor.service.ts
│   │       └── extractor.types.ts
│   ├── demo/
│   │   └── seed-demo.ts                  # Demo data seeding
│   └── validation/
│       ├── clean-reseed.ts               # Clean database reseed
│       ├── comprehensive-seed.ts         # Comprehensive seed data
│       ├── tool-validation.ts            # Tool tests (57 tests)
│       ├── conversational-validation.ts  # Conversational tests (50 prompts)
│       ├── widget-validation.ts          # Widget tests (38 tests)
│       ├── edge-case-validation.ts       # Edge case tests (20 tests)
│       ├── scale-validation.ts           # Scale tests (16 tests)
│       ├── provider-validation.ts        # Provider tests (12 tests)
│       ├── validate-platform.ts          # Platform validation (18 tests)
│       └── run-all-validation.ts         # Orchestrator script
├── src/widgets/                          # Next.js widget UI
│   ├── app/
│   │   ├── layout.tsx                    # Widget layout wrapper
│   │   ├── regulation-explorer/
│   │   │   └── page.tsx                  # Regulation search & detail view
│   │   ├── compliance-dashboard/
│   │   │   └── page.tsx                  # Compliance overview & obligations
│   │   ├── action-plan-board/
│   │   │   └── page.tsx                  # Kanban-style action plan
│   │   └── applicability-matrix/
│   │       └── page.tsx                  # Regulation applicability table
│   ├── package.json                      # Widget dependencies
│   ├── tsconfig.json
│   ├── next.config.js
│   └── widget-manifest.json              # Widget metadata
├── prisma/
│   └── schema.prisma                     # Database schema (13 models)
├── package.json                          # Server dependencies
├── tsconfig.json
├── .env                                  # Environment variables
├── .env.example                          # Environment template
├── .gitignore
├── README.md
├── NITROSTUDIO_TESTING_GUIDE.md          # Testing guide
├── PHASE_2_INTERACTIVE_TESTING_PLAN.md   # Testing checklist
└── PROJECT_ARCHITECTURE.md               # This file
```

## Module Architecture

### 1. Regulations Module
**Purpose**: Discover, search, and retrieve regulations

**Tools**:
- `search_regulations` — Search by keyword, regulator, type, status
- `get_regulation` — Get full regulation with sections and versions
- `compare_regulation_versions` — Show diff between versions
- `get_regulation_versions` — List all versions of a regulation
- `explain_regulation` — Plain language explanation

**Resources**:
- `regulations://latest` — Latest active regulations
- `regulations://history` — Regulation version history

**Prompts**:
- `explain_regulation` — Explain regulation in simple terms

**Widget**: Regulation Explorer

### 2. Compliance Module
**Purpose**: Evaluate applicability, find obligations, generate action plans

**Tools**:
- `evaluate_applicability` — Check if regulation applies to company
- `find_obligations` — Find obligations with filters
- `generate_action_plan` — Create prioritized action plan
- `assess_company` — Alias for evaluate_applicability
- `find_compliance_obligations` — Alias for find_obligations
- `generate_gap_report` — Alias for generate_action_plan
- `simulate_compliance` — Test hypothetical company profile

**Resources**:
- `obligations://all` — All obligations with summary stats

**Prompts**:
- `compliance_summary` — Summarize compliance status
- `audit_checklist` — Generate audit checklist

**Widgets**: Compliance Dashboard, Applicability Matrix, Action Plan Board

### 3. Company Module
**Purpose**: Manage company profiles and policies

**Tools**:
- `get_company_profile` — Get company details
- `update_company_profile` — Update profile fields
- `manage_policies` — List/create/update policies

**Resources**:
- `company://profile` — Current company profile
- `policies://all` — All company policies

### 4. Enterprise Module
**Purpose**: GitHub and Slack integration

**Tools**:
- `create_github_issue` — Create GitHub issue
- `notify_slack` — Send Slack notification

### 5. Knowledge Module
**Purpose**: Semantic search and chunk retrieval

**Tools**:
- `semantic_search` — Search regulations by semantic similarity
- `get_regulation_chunks` — Get text chunks from regulation

### 6. Embeddings Module
**Purpose**: Generate and manage embeddings

**Tools**:
- `chunk_and_embed` — Generate embeddings for regulation
- `get_regulation_embeddings` — Retrieve embeddings
- `delete_regulation_embeddings` — Delete embeddings

**Service**: EmbeddingsService
- Text chunking (1000 char chunks, 200 char overlap)
- Embedding generation (OpenAI/Anthropic/mock)
- Vector storage (pgvector)

### 7. Scheduler Module
**Purpose**: Cron-based job scheduling

**Tools**:
- `get_scheduler_status` — Get job status
- `trigger_monitoring_job` — Run job manually
- `update_job_schedule` — Update cron schedule
- `start_scheduler` / `stop_scheduler` — Control scheduler

**Service**: SchedulerService
- Job registration and management
- Cron expression parsing
- Manual trigger support
- Schedule updates

### 8. Monitor Module
**Purpose**: Regulatory source monitoring

**Tools**:
- `check_regulatory_source` — Check single source
- `list_regulatory_sources` — List all sources
- `get_recent_regulations` — Get recently discovered regulations

**Service**: MonitorService
- Document discovery from RBI, SEBI, MCA, CERT-In
- Change detection with hash tracking
- Source-specific selectors

### 9. Parser Module
**Purpose**: Document parsing

**Tools**:
- `parse_document` — Parse HTML/PDF/text
- `extract_metadata` — Extract document metadata

**Service**: ParserService
- HTML parsing with Cheerio
- Section extraction from headings
- Table extraction
- Metadata extraction

### 10. Extractor Module
**Purpose**: Compliance object extraction

**Tools**:
- `extract_compliance_objects` — Extract obligations/deadlines/penalties

**Service**: ExtractorService
- Keyword-based extraction
- Priority/mandatory/frequency detection
- Obligation grouping

## Database Schema

### Core Models

**Regulator**
- id, name, abbreviation, website

**Regulation**
- id, title, regulationNumber, documentNumber, gazetteReference
- documentType, issueDate, effectiveDate, status
- regulatorId, summary, sourceUrl, language, documentStatus

**Version**
- id, regulationId, versionNumber, publicationDate, effectiveDate
- supersedesVersion, changeSummary

**Section**
- id, versionId, sectionNumber, title, content, parentSectionId

**Applicability**
- id, sectionId, description, operator, industries, entityTypes
- jurisdictions, thresholds, conditions

**Obligation**
- id, sectionId, title, description, obligationType, priority
- mandatory, frequency, status

**Deadline**
- id, obligationId, deadlineType, frequency, dueCondition
- description, effectiveFrom, effectiveUntil

**Penalty**
- id, sectionId, obligationId, description, penaltyType, severity

**ReportingRequirement**
- id, sectionId, obligationId, authority, reportType
- frequency, submissionMethod

**Citation**
- id, entityType, entityId, sectionNumber, pageNumber
- paragraphNumber, sourceText, startOffset, endOffset, obligationId

**CompanyProfile**
- id, name, industry, subIndustry, entityType, incorporationType
- jurisdictions, locations, products, services, licenses
- employeeCount, website

**Policy**
- id, companyId, title, category, version, status

**VectorChunk**
- id, regulationId, sectionId, chunkIndex, content
- embedding (pgvector), tokenCount, createdAt

## MCP Tool Summary

| Module | Tools | Total |
|--------|-------|-------|
| Regulations | 5 | 5 |
| Compliance | 7 | 12 |
| Company | 3 | 15 |
| Enterprise | 2 | 17 |
| Knowledge | 2 | 19 |
| Embeddings | 3 | 22 |
| Scheduler | 4 | 26 |
| Monitor | 3 | 29 |
| Parser | 2 | 31 |
| Extractor | 1 | 32 |
| **TOTAL** | **32** | **32** |

*Note: Some tools are aliases (e.g., `assess_company` = `evaluate_applicability`). Unique tools: 27*

## Widget Summary

| Widget | Route | Purpose | Tools |
|--------|-------|---------|-------|
| Regulation Explorer | `regulation-explorer` | Search & view regulations | search_regulations, get_regulation, get_regulation_versions |
| Compliance Dashboard | `compliance-dashboard` | View obligations & compliance status | find_obligations, evaluate_applicability, get_company_profile |
| Action Plan Board | `action-plan-board` | Kanban-style action plan | generate_action_plan |
| Applicability Matrix | `applicability-matrix` | Regulation applicability table | evaluate_applicability, simulate_compliance |

## Data Model

### Regulations
- **28 total** across 13 regulators
- **30 versions** with change tracking
- **36 sections** with hierarchical structure
- **13 applicability rules** for matching companies

### Obligations
- **27 total** with deadlines and penalties
- **11 deadlines** with multiple types
- **7 penalties** with severity levels
- **6 reporting requirements**

### Companies
- **15 total** across multiple industries
- **10 policies** with version tracking
- **Applicability rules** for each regulation

## API Integration Points

### OpenAI (Embeddings)
- Model: `text-embedding-3-small`
- Dimensions: 1536
- Fallback: Mock embeddings

### Anthropic (Embeddings Fallback)
- Model: `claude-3-5-sonnet-20241022`
- Fallback: Mock embeddings

### GitHub (Enterprise)
- Endpoint: `https://api.github.com`
- Auth: `GITHUB_TOKEN`
- Fallback: Graceful error message

### Slack (Enterprise)
- Endpoint: `https://slack.com/api`
- Auth: `SLACK_BOT_TOKEN`
- Fallback: Graceful error message

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Logging
LOG_LEVEL=info

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_RBI_CRON=0 0 * * *
SCHEDULER_SEBI_CRON=0 0 * * *
SCHEDULER_MCA_CRON=0 0 * * *
SCHEDULER_CERTIN_CRON=0 0 * * *

# Embeddings
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Enterprise
GITHUB_TOKEN=ghp_...
SLACK_BOT_TOKEN=xoxb-...
```

## Performance Characteristics

### Query Performance
- Regulation search: ~765ms
- Obligation query: ~907ms
- Applicability query: ~583ms
- Complex join query: ~1566ms
- **Average**: ~879ms

### Database Size
- Regulators: 13
- Regulations: 28
- Versions: 30
- Sections: 36
- Obligations: 27
- Deadlines: 11
- Penalties: 7
- Company Profiles: 15
- Policies: 10
- **Total Records**: ~177

### Widget Performance
- Regulation Explorer: 2.16 kB, 92.3 kB first load
- Compliance Dashboard: 2.3 kB, 92.4 kB first load
- Action Plan Board: 2.57 kB, 92.7 kB first load
- Applicability Matrix: 2.87 kB, 93 kB first load

## Deployment Architecture

### Development
- Local PostgreSQL or Supabase
- NitroStack dev server
- Next.js widget dev server

### Production
- Supabase PostgreSQL (managed)
- NitroStack MCP server (containerized)
- Next.js widget server (Vercel or self-hosted)
- pgvector extension enabled
- Connection pooling configured

## Security Considerations

- **Database**: Encrypted connections, prepared statements
- **API Keys**: Environment variables, never in code
- **Input Validation**: Zod schemas on all tool inputs
- **SQL Injection**: Prisma ORM prevents injection
- **XSS**: React escaping + CSP headers
- **CORS**: Configured for widget domain

## Monitoring & Observability

### Health Checks
- System uptime
- Memory usage
- Process ID
- Database connectivity

### Logging
- Structured logging with context
- Log levels: debug, info, warn, error
- Configurable via `LOG_LEVEL` env var

### Metrics
- Tool execution time
- Database query time
- Widget render time
- Error rates

## Future Enhancements

### Phase 3
- [ ] Real web scraping for Monitor module
- [ ] Actual HTML parsing with Cheerio
- [ ] OpenAI/Anthropic API integration for embeddings
- [ ] Enterprise API integration (GitHub, Slack)
- [ ] P2 widgets (Diff Viewer, Timeline)

### Phase 4
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Compliance scoring
- [ ] Risk assessment
- [ ] Audit trail
- [ ] User authentication
- [ ] Role-based access control

### Phase 5
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Collaboration features
- [ ] Custom reporting
- [ ] API marketplace
- [ ] Third-party integrations

---

**Last Updated**: July 18, 2026  
**Version**: 0.1.0  
**Status**: Phase 2 — Interactive Testing
