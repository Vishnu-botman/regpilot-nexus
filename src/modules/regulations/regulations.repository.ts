import { Injectable } from '@nitrostack/core';
import { prisma } from '../../lib/prisma.js';

export interface SearchRegulationsInput {
  query?: string;
  regulator?: string;
  documentType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface RegulationWithVersions {
  id: string;
  title: string;
  regulationNumber: string | null;
  documentNumber: string | null;
  gazetteReference: string | null;
  documentType: string;
  issueDate: Date | null;
  effectiveDate: Date | null;
  status: string;
  summary: string | null;
  sourceUrl: string | null;
  language: string;
  documentStatus: string | null;
  regulator: {
    id: string;
    name: string;
    abbreviation: string;
  };
  versions: {
    id: string;
    versionNumber: string;
    publicationDate: Date | null;
    effectiveDate: Date | null;
    changeSummary: string | null;
  }[];
}

@Injectable()
export class RegulationsRepository {
  async search(input: SearchRegulationsInput) {
    const { query, regulator, documentType, status, limit = 20, offset = 0 } = input;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (regulator) {
      where.regulator = { abbreviation: regulator };
    }

    if (documentType) {
      where.documentType = documentType;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { regulationNumber: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [regulations, total] = await Promise.all([
      prisma.regulation.findMany({
        where,
        include: {
          regulator: {
            select: { id: true, name: true, abbreviation: true },
          },
          versions: {
            select: {
              id: true,
              versionNumber: true,
              publicationDate: true,
              effectiveDate: true,
              changeSummary: true,
            },
            orderBy: { publicationDate: 'desc' },
            take: 1,
          },
        },
        orderBy: { effectiveDate: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.regulation.count({ where }),
    ]);

    return { regulations, total, limit, offset };
  }

  async getById(regulationId: string) {
    return prisma.regulation.findUnique({
      where: { id: regulationId },
      include: {
        regulator: {
          select: { id: true, name: true, abbreviation: true },
        },
        versions: {
          select: {
            id: true,
            versionNumber: true,
            publicationDate: true,
            effectiveDate: true,
            changeSummary: true,
            sections: {
              orderBy: { sectionNumber: 'asc' },
            },
          },
          orderBy: { publicationDate: 'desc' },
        },
      },
    });
  }

  async getLatest(limit: number = 10) {
    return prisma.regulation.findMany({
      where: { status: 'active' },
      include: {
        regulator: {
          select: { id: true, name: true, abbreviation: true },
        },
        versions: {
          select: {
            id: true,
            versionNumber: true,
            publicationDate: true,
          },
          orderBy: { publicationDate: 'desc' },
          take: 1,
        },
      },
      orderBy: { effectiveDate: 'desc' },
      take: limit,
    });
  }

  async getVersionWithSections(versionId: string) {
    return prisma.version.findUnique({
      where: { id: versionId },
      include: {
        regulation: {
          select: { id: true, title: true, documentType: true },
        },
        sections: {
          orderBy: { sectionNumber: 'asc' },
        },
      },
    });
  }

  async getVersionHistory(regulationId: string) {
    return prisma.version.findMany({
      where: { regulationId },
      orderBy: { publicationDate: 'desc' },
    });
  }

  async compareVersions(versionAId: string, versionBId: string) {
    const [versionA, versionB] = await Promise.all([
      this.getVersionWithSections(versionAId),
      this.getVersionWithSections(versionBId),
    ]);

    if (!versionA || !versionB) return null;

    const sectionsA = new Map(versionA.sections.map(s => [s.sectionNumber, s]));
    const sectionsB = new Map(versionB.sections.map(s => [s.sectionNumber, s]));

    const added: any[] = [];
    const removed: any[] = [];
    const modified: any[] = [];

    for (const [num, section] of sectionsB) {
      if (!sectionsA.has(num)) {
        added.push(section);
      } else {
        const original = sectionsA.get(num)!;
        if (original.content !== section.content || original.title !== section.title) {
          modified.push({ original, updated: section });
        }
      }
    }

    for (const [num, section] of sectionsA) {
      if (!sectionsB.has(num)) {
        removed.push(section);
      }
    }

    return {
      versionA: { id: versionA.id, versionNumber: versionA.versionNumber },
      versionB: { id: versionB.id, versionNumber: versionB.versionNumber },
      differences: { added, removed, modified },
      summary: {
        added: added.length,
        removed: removed.length,
        modified: modified.length,
      },
    };
  }

  async create(data: {
    title: string;
    regulatorId: string;
    documentType: string;
    regulationNumber?: string;
    issueDate?: Date;
    effectiveDate?: Date;
    summary?: string;
    sourceUrl?: string;
  }) {
    return prisma.regulation.create({ data });
  }

  async createVersion(data: {
    regulationId: string;
    versionNumber: string;
    publicationDate?: Date;
    effectiveDate?: Date;
    changeSummary?: string;
  }) {
    return prisma.version.create({ data });
  }
}
