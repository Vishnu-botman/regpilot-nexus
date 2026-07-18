import { Injectable } from '@nitrostack/core';
import { prisma } from '../../lib/prisma.js';

export interface ObligationWithDetails {
  id: string;
  title: string;
  description: string | null;
  obligationType: string | null;
  priority: string;
  mandatory: boolean;
  frequency: string | null;
  status: string;
  section: {
    id: string;
    sectionNumber: string;
    title: string | null;
    content: string | null;
    version: {
      id: string;
      versionNumber: string;
      effectiveDate: Date | null;
      regulation: {
        id: string;
        title: string;
        regulationNumber: string | null;
        regulator: {
          name: string;
          abbreviation: string;
        };
      };
    };
  };
  deadlines: {
    id: string;
    deadlineType: string | null;
    frequency: string | null;
    dueCondition: string | null;
    description: string | null;
    effectiveFrom: Date | null;
    effectiveUntil: Date | null;
  }[];
  reportingReqs: {
    id: string;
    authority: string | null;
    reportType: string | null;
    frequency: string | null;
    submissionMethod: string | null;
  }[];
  penalties: {
    id: string;
    description: string | null;
    penaltyType: string | null;
    severity: string | null;
  }[];
  citations: {
    id: string;
    sectionNumber: string | null;
    sourceText: string | null;
  }[];
}

export interface ApplicabilityResult {
  applicable: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  matchingApplicabilities: {
    sectionNumber: string;
    sectionTitle: string | null;
    description: string | null;
    operator: string;
    matchedFields: string[];
  }[];
}

export interface ActionPlanTask {
  obligationId: string;
  title: string;
  description: string | null;
  priority: string;
  mandatory: boolean;
  frequency: string | null;
  deadlineDescription: string | null;
  deadlineType: string | null;
  dueCondition: string | null;
  effectiveFrom: Date | null;
  effectiveUntil: Date | null;
  regulation: string;
  regulator: string;
  sectionNumber: string;
  sectionTitle: string | null;
  reportingRequirements: {
    authority: string | null;
    reportType: string | null;
    frequency: string | null;
    submissionMethod: string | null;
  }[];
}

@Injectable()
export class ComplianceRepository {
  async getCompanyProfile(companyId: string) {
    return prisma.companyProfile.findUnique({
      where: { id: companyId },
      include: { policies: true },
    });
  }

  async getDefaultCompanyProfile() {
    return prisma.companyProfile.findFirst({
      include: { policies: true },
    });
  }

  async getApplicabilities(regulationId: string) {
    const versions = await prisma.version.findMany({
      where: { regulationId },
      orderBy: { publicationDate: 'desc' },
      include: {
        sections: {
          include: {
            applicabilities: true,
          },
        },
      },
    });

    const allSections = versions.flatMap(v => v.sections);
    if (allSections.length === 0) return [];

    const applicabilities: {
      sectionNumber: string;
      sectionTitle: string | null;
      sectionId: string;
      applicability: {
        id: string;
        description: string | null;
        operator: string;
        industries: string[];
        entityTypes: string[];
        jurisdictions: string[];
        thresholds: any;
        conditions: any;
      };
    }[] = [];

    for (const section of allSections) {
      for (const app of section.applicabilities) {
        applicabilities.push({
          sectionNumber: section.sectionNumber,
          sectionTitle: section.title,
          sectionId: section.id,
          applicability: {
            id: app.id,
            description: app.description,
            operator: app.operator,
            industries: app.industries,
            entityTypes: app.entityTypes,
            jurisdictions: app.jurisdictions,
            thresholds: app.thresholds,
            conditions: app.conditions,
          },
        });
      }
    }

    return applicabilities;
  }

  async findObligations(filters: {
    regulationId?: string;
    companyId?: string;
    status?: string;
    mandatory?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ obligations: ObligationWithDetails[]; total: number }> {
    const { regulationId, status, mandatory, limit = 50, offset = 0 } = filters;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (mandatory !== undefined) {
      where.mandatory = mandatory;
    }

    if (regulationId) {
      where.section = {
        version: {
          regulationId,
        },
      };
    }

    const [obligations, total] = await Promise.all([
      prisma.obligation.findMany({
        where,
        include: {
          section: {
            include: {
              version: {
                include: {
                  regulation: {
                    include: {
                      regulator: {
                        select: { name: true, abbreviation: true },
                      },
                    },
                  },
                },
              },
            },
          },
          deadlines: true,
          reportingReqs: true,
          penalties: true,
          citations: true,
        },
        orderBy: [{ mandatory: 'desc' }, { priority: 'desc' }, { createdAt: 'asc' }],
        take: limit,
        skip: offset,
      }),
      prisma.obligation.count({ where }),
    ]);

    return { obligations: obligations as ObligationWithDetails[], total };
  }

  async getObligationById(obligationId: string): Promise<ObligationWithDetails | null> {
    return prisma.obligation.findUnique({
      where: { id: obligationId },
      include: {
        section: {
          include: {
            version: {
              include: {
                regulation: {
                  include: {
                    regulator: {
                      select: { name: true, abbreviation: true },
                    },
                  },
                },
              },
            },
          },
        },
        deadlines: true,
        reportingReqs: true,
        penalties: true,
        citations: true,
      },
    }) as Promise<ObligationWithDetails | null>;
  }

  async getObligationsByRegulation(regulationId: string): Promise<ObligationWithDetails[]> {
    return prisma.obligation.findMany({
      where: {
        section: {
          version: {
            regulationId,
          },
        },
      },
      include: {
        section: {
          include: {
            version: {
              include: {
                regulation: {
                  include: {
                    regulator: {
                      select: { name: true, abbreviation: true },
                    },
                  },
                },
              },
            },
          },
        },
        deadlines: true,
        reportingReqs: true,
        penalties: true,
        citations: true,
      },
      orderBy: [{ mandatory: 'desc' }, { priority: 'desc' }],
    }) as Promise<ObligationWithDetails[]>;
  }

  async getAllObligations(limit: number = 100, offset: number = 0) {
    const [obligations, total] = await Promise.all([
      prisma.obligation.findMany({
        include: {
          section: {
            include: {
              version: {
                include: {
                  regulation: {
                    include: {
                      regulator: {
                        select: { name: true, abbreviation: true },
                      },
                    },
                  },
                },
              },
            },
          },
          deadlines: true,
          reportingReqs: true,
          penalties: true,
        },
        orderBy: [{ mandatory: 'desc' }, { priority: 'desc' }],
        take: limit,
        skip: offset,
      }),
      prisma.obligation.count(),
    ]);

    return { obligations, total };
  }

  async getObligationStats() {
    const [total, pending, mandatory, overdue] = await Promise.all([
      prisma.obligation.count(),
      prisma.obligation.count({ where: { status: 'pending' } }),
      prisma.obligation.count({ where: { mandatory: true } }),
      prisma.obligation.count({ where: { status: 'overdue' } }),
    ]);

    const byType = await prisma.obligation.groupBy({
      by: ['obligationType'],
      _count: { id: true },
    });

    const byPriority = await prisma.obligation.groupBy({
      by: ['priority'],
      _count: { id: true },
    });

    return {
      total,
      pending,
      mandatory,
      overdue,
      byType: byType.map(t => ({ type: t.obligationType, count: t._count.id })),
      byPriority: byPriority.map(p => ({ priority: p.priority, count: p._count.id })),
    };
  }
}
