import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { MonitorService } from './monitor.service.js';
import { RegulatorySource, SOURCE_CONFIGS } from './monitor.types.js';

export class MonitorTools {
  constructor(private readonly monitorService: MonitorService) {}

  @Tool({
    name: 'check_regulatory_source',
    description: 'Check a regulatory source for new or updated publications',
    inputSchema: z.object({
      source: z.enum(['rbi', 'sebi', 'mca', 'cert_in']).describe('Regulatory source to check'),
    })
  })
  async checkRegulatorySource(input: { source: RegulatorySource }) {
    const result = await this.monitorService.checkSource(input.source);
    return result;
  }

  @Tool({
    name: 'list_regulatory_sources',
    description: 'List all supported regulatory sources and their status',
    inputSchema: z.object({})
  })
  async listRegulatorySources() {
    const sources = Object.entries(SOURCE_CONFIGS).map(([key, config]) => ({
      id: key,
      name: config.name,
      baseUrl: config.baseUrl,
      feedUrl: config.feedUrl,
      documentType: config.documentType,
      enabled: config.enabled,
    }));
    return { sources };
  }

  @Tool({
    name: 'get_recent_regulations',
    description: 'Get recently fetched regulations from a specific source',
    inputSchema: z.object({
      source: z.enum(['rbi', 'sebi', 'mca', 'cert_in']).describe('Regulatory source'),
      limit: z.number().optional().default(10).describe('Max results'),
    })
  })
  async getRecentRegulations(input: { source: RegulatorySource; limit?: number }) {
    const regulations = await this.monitorService.getRecentDocuments(
      input.source,
      input.limit || 10
    );
    return {
      source: input.source,
      regulations: regulations.map(r => ({
        id: r.id,
        title: r.title,
        regulationNumber: r.regulationNumber,
        status: r.status,
        effectiveDate: r.effectiveDate,
        regulator: r.regulator.abbreviation,
        versions: r.versions.length,
      })),
    };
  }
}
