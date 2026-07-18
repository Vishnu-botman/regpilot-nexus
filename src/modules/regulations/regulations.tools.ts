import { ToolDecorator as Tool, Widget, z } from '@nitrostack/core';
import { RegulationsRepository } from './regulations.repository.js';

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
      regulator: regulation.regulator,
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

  @Tool({
    name: 'compare_regulation_versions',
    description: 'Compare two versions of a regulation and highlight what was added, removed, or modified between them.',
    inputSchema: z.object({
      versionAId: z.string().describe('ID of the first (older) version'),
      versionBId: z.string().describe('ID of the second (newer) version'),
    }),
    examples: {
      request: { versionAId: 'ver-001', versionBId: 'ver-002' },
      response: {
        versionA: { versionNumber: '1.0', effectiveDate: '2025-01-01' },
        versionB: { versionNumber: '1.1', effectiveDate: '2025-06-01' },
        added: ['Section 5: New reporting requirement'],
        removed: [],
        modified: ['Section 4: Updated applicability criteria'],
      },
    },
  })
  async compareVersions(input: { versionAId: string; versionBId: string }) {
    const result = await this.repository.compareVersions(input.versionAId, input.versionBId);

    if (!result) {
      return { error: 'One or both versions not found' };
    }

    return result;
  }

  @Tool({
    name: 'get_regulation_versions',
    description: 'Get all versions of a regulation, ordered by publication date (newest first).',
    inputSchema: z.object({
      regulationId: z.string().describe('The regulation ID'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001' },
      response: {
        versions: [
          { id: 'ver-002', versionNumber: '1.1', effectiveDate: '2025-06-01', status: 'active' },
          { id: 'ver-001', versionNumber: '1.0', effectiveDate: '2025-01-01', status: 'superseded' },
        ],
      },
    },
  })
  @Widget('regulation-explorer')
  async getRegulationVersions(input: { regulationId: string }) {
    const versions = await this.repository.getVersionHistory(input.regulationId);
    return { versions };
  }

  @Tool({
    name: 'explain_regulation',
    description: 'Explain a specific regulation in plain language, covering its purpose, key obligations, and applicability.',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID to explain'),
    }),
    examples: {
      request: { regulationId: 'reg-rbi-001' },
      response: {
        regulationId: 'reg-rbi-001',
        title: 'Digital Lending Directions, 2025',
        regulator: 'RBI',
        explanation: 'This regulation covers...'
      }
    }
  })
  async explainRegulation(input: { regulationId: string }) {
    const regulation = await this.repository.getById(input.regulationId);

    if (!regulation) {
      return { error: 'Regulation not found', regulationId: input.regulationId };
    }

    const versions = regulation.versions.length;
    const latestVersion = regulation.versions[0];

    let explanation = `This regulation is titled "${regulation.title}", issued by the ${regulation.regulator.name} (${regulation.regulator.abbreviation}).\n`;
    explanation += `Document Type: ${regulation.documentType.replace(/_/g, ' ')}\n`;
    explanation += `Status: ${regulation.status}\n`;
    explanation += `Effective Date: ${regulation.effectiveDate ? new Date(regulation.effectiveDate).toLocaleDateString() : 'N/A'}\n`;
    explanation += `Versions: ${versions} total. ${latestVersion ? `Latest version is v${latestVersion.versionNumber}` : ''}\n\n`;
    explanation += `Summary:\n${regulation.summary || 'No summary available.'}\n\n`;

    if (latestVersion && latestVersion.sections) {
      explanation += `Sections details:\n`;
      for (const section of latestVersion.sections) {
        explanation += `- §${section.sectionNumber}: ${section.title || 'Untitled'}\n  ${section.content ? section.content.substring(0, 150) + '...' : ''}\n`;
      }
    }

    return {
      regulationId: regulation.id,
      title: regulation.title,
      regulator: regulation.regulator.abbreviation,
      explanation,
    };
  }
}
