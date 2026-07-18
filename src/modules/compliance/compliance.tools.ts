import { ToolDecorator as Tool, Widget, z } from '@nitrostack/core';
import { ComplianceRepository } from './compliance.repository.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComplianceTools {
  constructor(private readonly repo: ComplianceRepository) {}

  @Tool({
    name: 'evaluate_applicability',
    description: 'Evaluate whether a regulation applies to a company based on applicability rules and company profile',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID to evaluate'),
      companyId: z.string().describe('Company profile ID'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', companyId: 'comp-001' },
      response: {
        applicable: true,
        confidence: 'high',
        reasons: ['Matched Section 4 via industry: fintech, entityType: nbfc'],
        matchingApplicabilities: [
          {
            sectionNumber: '4',
            sectionTitle: 'Applicability',
            description: 'This direction applies to...',
            operator: 'includes',
            matchedFields: ['industry: fintech', 'entityType: nbfc'],
          },
        ],
      },
    },
  })
  @Widget('applicability-matrix')
  async evaluateApplicability(input: { regulationId: string; companyId: string }) {
    const [company, applicabilities] = await Promise.all([
      this.repo.getCompanyProfile(input.companyId),
      this.repo.getApplicabilities(input.regulationId),
    ]);

    if (!company) {
      return { error: `Company profile not found: ${input.companyId}` };
    }

    if (applicabilities.length === 0) {
      return {
        company: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          entityType: company.entityType,
        },
        applicable: null,
        confidence: 'low',
        reasons: ['No applicability rules defined for this regulation'],
        matchingApplicabilities: [],
      };
    }

    const matches: {
      sectionNumber: string;
      sectionTitle: string | null;
      description: string | null;
      operator: string;
      matchedFields: string[];
    }[] = [];

    const reasons: string[] = [];

    for (const item of applicabilities) {
      const app = item.applicability;
      const matchedFields: string[] = [];

      if (app.industries.length > 0 && company.industry) {
        if (app.industries.includes('all') || app.industries.includes(company.industry) || app.industries.includes(company.subIndustry || '')) {
          matchedFields.push(`industry: ${company.industry}`);
        }
      }

      if (app.entityTypes.length > 0 && company.entityType) {
        if (app.entityTypes.includes('all') || app.entityTypes.includes(company.entityType)) {
          matchedFields.push(`entityType: ${company.entityType}`);
        }
      }

      if (app.jurisdictions.length > 0 && company.jurisdictions.length > 0) {
        const jurisdictionOverlap = company.jurisdictions.filter(j => app.jurisdictions.includes(j));
        if (jurisdictionOverlap.length > 0) {
          matchedFields.push(`jurisdictions: ${jurisdictionOverlap.join(', ')}`);
        }
      }

      if (matchedFields.length > 0) {
        if (app.operator === 'excludes') {
          reasons.push(`Excluded by ${item.sectionNumber}: ${matchedFields.join('; ')}`);
        } else {
          matches.push({
            sectionNumber: item.sectionNumber,
            sectionTitle: item.sectionTitle,
            description: app.description,
            operator: app.operator,
            matchedFields,
          });
          reasons.push(`Matched ${item.sectionNumber} via ${matchedFields.join('; ')}`);
        }
      }
    }

    const hasExclusions = reasons.some(r => r.startsWith('Excluded'));
    const hasInclusions = matches.length > 0;

    let applicable: boolean;
    let confidence: 'high' | 'medium' | 'low';

    if (hasExclusions && !hasInclusions) {
      applicable = false;
      confidence = 'high';
    } else if (hasInclusions) {
      applicable = true;
      confidence = hasExclusions ? 'medium' : 'high';
    } else {
      applicable = false;
      confidence = 'low';
      reasons.push('No applicability rules matched company profile');
    }

    return {
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        entityType: company.entityType,
      },
      applicable,
      confidence,
      reasons,
      matchingApplicabilities: matches,
    };
  }

  @Tool({
    name: 'find_obligations',
    description: 'Find all obligations for a regulation or across all applicable regulations, with optional filters',
    inputSchema: z.object({
      regulationId: z.string().optional().describe('Filter by specific regulation'),
      companyId: z.string().optional().describe('Company profile ID (for future filtering)'),
      status: z.enum(['pending', 'in_progress', 'compliant', 'overdue']).optional().describe('Filter by obligation status'),
      mandatory: z.boolean().optional().describe('Filter by mandatory flag'),
      limit: z.number().optional().describe('Max results (default: 50)'),
      offset: z.number().optional().describe('Offset for pagination'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', status: 'pending' },
      response: {
        obligations: [
          {
            id: 'obl-001',
            title: 'Data Fiduciaries must provide notice',
            obligationType: 'maintenance',
            priority: 'high',
            mandatory: true,
            status: 'pending',
            regulation: 'Digital Lending Directions, 2025',
            regulator: 'RBI',
            sectionNumber: '4',
            sectionTitle: 'Applicability',
            deadlines: [{ type: 'absolute', description: 'Compliance by May 2027' }],
            penalties: [{ description: 'Up to ₹250 crore per breach', type: 'monetary', severity: 'high' }],
          },
        ],
        total: 1,
        limit: 50,
        offset: 0,
      },
    },
  })
  @Widget('compliance-dashboard')
  async findObligations(input: {
    regulationId?: string;
    companyId?: string;
    status?: string;
    mandatory?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let companyProfile: any = null;
    if (input.companyId) {
      companyProfile = await this.repo.getCompanyProfile(input.companyId);
    } else {
      companyProfile = await prisma.companyProfile.findFirst({ include: { policies: true } });
    }

    const result = await this.repo.findObligations({
      regulationId: input.regulationId,
      status: input.status,
      mandatory: input.mandatory,
      limit: input.limit,
      offset: input.offset,
    });

    const obligations = result.obligations.map(o => ({
      id: o.id,
      title: o.title,
      description: o.description,
      obligationType: o.obligationType,
      priority: o.priority,
      mandatory: o.mandatory,
      frequency: o.frequency,
      status: o.status,
      regulation: o.section.version.regulation.title,
      regulator: o.section.version.regulation.regulator.abbreviation,
      sectionNumber: o.section.sectionNumber,
      sectionTitle: o.section.title,
      deadlines: o.deadlines.map(d => ({
        type: d.deadlineType,
        condition: d.dueCondition,
        description: d.description,
        effectiveFrom: d.effectiveFrom,
        effectiveUntil: d.effectiveUntil,
      })),
      reportingRequirements: o.reportingReqs.map(r => ({
        authority: r.authority,
        reportType: r.reportType,
        frequency: r.frequency,
        submissionMethod: r.submissionMethod,
      })),
      penalties: o.penalties.map(p => ({
        description: p.description,
        type: p.penaltyType,
        severity: p.severity,
      })),
    }));

    return {
      company: companyProfile ? {
        id: companyProfile.id,
        name: companyProfile.name,
        industry: companyProfile.industry,
        entityType: companyProfile.entityType,
        policies: companyProfile.policies?.map((p: any) => ({
          id: p.id,
          title: p.title,
          version: p.version,
          category: p.category,
          status: p.status,
        })) || [],
      } : undefined,
      summary: {
        total: obligations.length,
        pending: obligations.filter(o => o.status === 'pending').length,
        mandatory: obligations.filter(o => o.mandatory).length,
        overdue: obligations.filter(o => o.status === 'overdue').length,
      },
      obligations,
      total: result.total,
      limit: input.limit || 50,
      offset: input.offset || 0,
    };
  }

  @Tool({
    name: 'generate_action_plan',
    description: 'Generate a deterministic compliance action plan organized by priority and deadline',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
      companyId: z.string().optional().describe('Company profile ID'),
      department: z.string().optional().describe('Filter by department (reserved for V2)'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', companyId: 'comp-001' },
      response: {
        actionPlan: {
          regulation: 'Digital Lending Directions, 2025',
          grouped: {
            immediate: [{ title: 'Data Fiduciaries must provide notice', priority: 'high', mandatory: true }],
            scheduled: [],
            monitored: [],
          },
          summary: { total: 4, mandatory: 4, highPriority: 4, immediate: 4, scheduled: 0, monitored: 0 },
        },
      },
    },
  })
  @Widget('action-plan-board')
  async generateActionPlan(input: { regulationId: string; companyId?: string; department?: string }) {
    const obligations = await this.repo.getObligationsByRegulation(input.regulationId);

    if (obligations.length === 0) {
      return { actionPlan: { tasks: [], summary: { total: 0, mandatory: 0, highPriority: 0 } } };
    }

    const tasks = obligations.map(o => ({
      obligationId: o.id,
      title: o.title,
      description: o.description,
      priority: o.priority,
      mandatory: o.mandatory,
      frequency: o.frequency,
      regulation: o.section.version.regulation.title,
      regulator: o.section.version.regulation.regulator.abbreviation,
      sectionNumber: o.section.sectionNumber,
      sectionTitle: o.section.title,
      deadlines: o.deadlines.map(d => ({
        description: d.description,
        type: d.deadlineType,
        condition: d.dueCondition,
        effectiveFrom: d.effectiveFrom,
        effectiveUntil: d.effectiveUntil,
      })),
      reportingRequirements: o.reportingReqs.map(r => ({
        authority: r.authority,
        reportType: r.reportType,
        frequency: r.frequency,
        submissionMethod: r.submissionMethod,
      })),
    }));

    const mandatoryTasks = tasks.filter(t => t.mandatory);
    const highPriorityTasks = tasks.filter(t => t.priority === 'high');

    const grouped = {
      immediate: tasks.filter(t => t.priority === 'high' && t.mandatory),
      scheduled: tasks.filter(t => t.priority === 'medium' || (t.priority === 'high' && !t.mandatory)),
      monitored: tasks.filter(t => t.priority === 'low'),
    };

    return {
      actionPlan: {
        regulation: obligations[0]?.section.version.regulation.title,
        grouped,
        summary: {
          total: tasks.length,
          mandatory: mandatoryTasks.length,
          highPriority: highPriorityTasks.length,
          immediate: grouped.immediate.length,
          scheduled: grouped.scheduled.length,
          monitored: grouped.monitored.length,
        },
      },
    };
  }

  @Tool({
    name: 'assess_company',
    description: 'Assess whether a regulation applies to a company based on applicability rules and company profile',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID to evaluate'),
      companyId: z.string().describe('Company profile ID'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', companyId: 'comp-001' },
      response: {
        applicable: true,
        confidence: 'high',
        reasons: ['Matched Section 4 via industry: fintech, entityType: nbfc'],
      },
    },
  })
  @Widget('applicability-matrix')
  async assessCompany(input: { regulationId: string; companyId: string }) {
    return this.evaluateApplicability(input);
  }

  @Tool({
    name: 'find_compliance_obligations',
    description: 'Find all compliance obligations for a regulation or across all applicable regulations, with optional filters',
    inputSchema: z.object({
      regulationId: z.string().optional().describe('Filter by specific regulation'),
      companyId: z.string().optional().describe('Company profile ID'),
      status: z.enum(['pending', 'in_progress', 'compliant', 'overdue']).optional().describe('Filter by obligation status'),
      mandatory: z.boolean().optional().describe('Filter by mandatory flag'),
      limit: z.number().optional().describe('Max results (default: 50)'),
      offset: z.number().optional().describe('Offset for pagination'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', status: 'pending' },
      response: {
        obligations: [
          {
            id: 'obl-001',
            title: 'Data Fiduciaries must provide notice',
            obligationType: 'maintenance',
            priority: 'high',
            mandatory: true,
            status: 'pending',
          },
        ],
        total: 1,
      },
    },
  })
  @Widget('compliance-dashboard')
  async findComplianceObligations(input: {
    regulationId?: string;
    companyId?: string;
    status?: string;
    mandatory?: boolean;
    limit?: number;
    offset?: number;
  }) {
    return this.findObligations(input);
  }

  @Tool({
    name: 'generate_gap_report',
    description: 'Generate a gap report / compliance action plan organized by priority and deadline',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
      companyId: z.string().optional().describe('Company profile ID'),
      department: z.string().optional().describe('Filter by department'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001', companyId: 'comp-001' },
      response: {
        actionPlan: {
          regulation: 'Digital Lending Directions, 2025',
          summary: { total: 4, mandatory: 4, highPriority: 4 },
        },
      },
    },
  })
  @Widget('action-plan-board')
  async generateGapReport(input: { regulationId: string; companyId?: string; department?: string }) {
    return this.generateActionPlan(input);
  }

  @Tool({
    name: 'simulate_compliance',
    description: 'Simulate compliance applicability and find all obligations for a hypothetical company profile structure',
    inputSchema: z.object({
      industry: z.string().describe('Industry of the simulated company (e.g., fintech, saas, healthcare, energy, manufacturing)'),
      entityType: z.string().describe('Entity type of the simulated company (e.g., private_company, startup, public_limited, public_sector_bank)'),
      jurisdictions: z.array(z.string()).describe('Jurisdictions of the simulated company (e.g., ["india"])'),
      subIndustry: z.string().optional().describe('Sub-industry of the simulated company'),
    })
  })
  @Widget('applicability-matrix')
  async simulateCompliance(input: {
    industry: string;
    entityType: string;
    jurisdictions: string[];
    subIndustry?: string;
  }) {
    const mockCompany = {
      id: 'simulated',
      name: 'Simulated Company',
      industry: input.industry,
      entityType: input.entityType,
      jurisdictions: input.jurisdictions,
      subIndustry: input.subIndustry || null,
    };

    const regulations = await prisma.regulation.findMany({
      select: { id: true, title: true, status: true }
    });

    const results = [];

    for (const reg of regulations) {
      const applicabilities = await this.repo.getApplicabilities(reg.id);
      if (applicabilities.length === 0) continue;

      const matches = [];
      for (const item of applicabilities) {
        const app = item.applicability;
        const matchedFields = [];

        if (app.industries.length > 0 && mockCompany.industry) {
          if (app.industries.includes('all') || app.industries.includes(mockCompany.industry) || app.industries.includes(mockCompany.subIndustry || '')) {
            matchedFields.push(`industry: ${mockCompany.industry}`);
          }
        }

        if (app.entityTypes.length > 0 && mockCompany.entityType) {
          if (app.entityTypes.includes('all') || app.entityTypes.includes(mockCompany.entityType)) {
            matchedFields.push(`entityType: ${mockCompany.entityType}`);
          }
        }

        if (app.jurisdictions.length > 0 && mockCompany.jurisdictions.length > 0) {
          const jurisdictionOverlap = mockCompany.jurisdictions.filter(j => app.jurisdictions.includes(j));
          if (jurisdictionOverlap.length > 0) {
            matchedFields.push(`jurisdictions: ${jurisdictionOverlap.join(', ')}`);
          }
        }

        if (matchedFields.length > 0 && app.operator !== 'excludes') {
          matches.push({
            sectionNumber: item.sectionNumber,
            sectionTitle: item.sectionTitle,
            matchedFields,
          });
        }
      }

      if (matches.length > 0) {
        const obs = await this.repo.getObligationsByRegulation(reg.id);
        results.push({
          regulationId: reg.id,
          title: reg.title,
          status: reg.status,
          matchingSections: matches,
          obligationsCount: obs.length,
          mandatoryCount: obs.filter(o => o.mandatory).length,
          highPriorityCount: obs.filter(o => o.priority === 'high').length,
        });
      }
    }

    return {
      simulatedProfile: input,
      applicableRegulations: results,
      totalApplicable: results.length,
    };
  }
}
