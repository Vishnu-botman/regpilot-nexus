import { ToolDecorator as Tool, Widget, Injectable, z } from '@nitrostack/core';
import { RegulationsRepository } from './regulations.repository.js';

@Injectable()
export class RegulationsTools {
  constructor(private readonly repository: RegulationsRepository) {}

  @Tool({
    name: 'search_regulations',
    description: 'Search regulations by keyword, regulator, document type, or status. Returns matching regulations with their latest version info.',
    inputSchema: z.object({
      query: z.string().optional().describe('Search keyword or phrase (searches title, summary, regulation number)'),
      regulator: z.enum(['RBI', 'SEBI', 'MCA', 'CERT_IN']).optional().describe('Filter by regulator abbreviation'),
      documentType: z.enum(['master_direction', 'circular', 'notification', 'guideline']).optional().describe('Filter by document type'),
      status: z.enum(['active', 'superseded', 'revoked']).optional().describe('Filter by status'),
      limit: z.number().optional().default(20).describe('Max results to return'),
      offset: z.number().optional().default(0).describe('Offset for pagination'),
    }),
    examples: {
      request: { query: 'digital lending', regulator: 'RBI' },
      response: {
        regulations: [
          {
            id: 'reg-rbi-001',
            title: 'Digital Lending Directions, 2025',
            regulationNumber: 'RBI/2025-26/01',
            documentType: 'master_direction',
            status: 'active',
            effectiveDate: '2025-01-01',
            regulator: 'RBI',
            latestVersion: '1.0',
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
      },
    },
  })
  @Widget('regulation-explorer')
  async searchRegulations(input: {
    query?: string;
    regulator?: string;
    documentType?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const result = await this.repository.search(input);
    return {
      regulations: result.regulations.map(r => ({
        id: r.id,
        title: r.title,
        regulationNumber: r.regulationNumber,
        documentType: r.documentType,
        status: r.status,
        effectiveDate: r.effectiveDate,
        regulator: r.regulator.abbreviation,
        latestVersion: r.versions[0]?.versionNumber || null,
      })),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  }

  @Tool({
    name: 'get_regulation',
    description: 'Get a specific regulation with all its versions and metadata. Use this to get full details of a regulation.',
    inputSchema: z.object({
      regulationId: z.string().describe('The regulation ID'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001' },
      response: {
        id: 'reg-rbi-001',
        title: 'Digital Lending Directions, 2025',
        regulationNumber: 'RBI/2025-26/01',
        documentType: 'master_direction',
        status: 'active',
        effectiveDate: '2025-01-01',
        regulator: { abbreviation: 'RBI', name: 'Reserve Bank of India' },
        versions: [{ versionNumber: '1.0', effectiveDate: '2025-01-01', status: 'active' }],
        sections: [
          { sectionNumber: '4', title: 'Applicability', content: 'This direction applies to...' },
        ],
      },
    },
  })
  @Widget('regulation-explorer')
  async getRegulation(input: { regulationId: string }) {
    const regulation = await this.repository.getById(input.regulationId);

    if (!regulation) {
      return { error: 'Regulation not found', regulationId: input.regulationId };
    }

    const latestVersion = regulation.versions[0];

    return {
      id: regulation.id,
      title: regulation.title,
      regulationNumber: regulation.regulationNumber,
      documentNumber: regulation.documentNumber,
      gazetteReference: regulation.gazetteReference,
      documentType: regulation.documentType,
      issueDate: regulation.issueDate,
      effectiveDate: regulation.effectiveDate,
      status: regulation.status,
      summary: regulation.summary,
      sourceUrl: regulation.sourceUrl,
      language: regulation.language,
      documentStatus: regulation.documentStatus,
      regulator: regulation.regulator.abbreviation,
      versions: regulation.versions.map(v => ({
        id: v.id,
        versionNumber: v.versionNumber,
        publicationDate: v.publicationDate,
        effectiveDate: v.effectiveDate,
        changeSummary: v.changeSummary,
      })),
      sections: latestVersion?.sections || [],
    };
  }
}
