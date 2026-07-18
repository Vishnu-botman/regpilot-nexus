import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { MonitorService } from './monitor.service.js';
import { RegulatorySource, SOURCE_CONFIGS } from './monitor.types.js';

@Injectable({ deps: [MonitorService] })
export class MonitorTools {
  constructor(private readonly monitorService: MonitorService) {}

  @Tool({
    name: 'trigger_monitoring_job',
    description: 'Manually trigger a check of a regulatory source for new or updated publications',
    inputSchema: z.object({
      source: z.enum(['rbi', 'sebi', 'mca', 'cert_in']).describe('Regulatory source to check'),
    })
  })
  async triggerMonitoringJob(input: { source: RegulatorySource }) {
    const result = await this.monitorService.checkSource(input.source);
    return {
      source: result.source,
      success: result.success,
      documentsFound: result.documentsFound,
      newDocuments: result.newDocuments.length,
      updatedDocuments: result.updatedDocuments.length,
      error: result.error,
      checkedAt: result.checkedAt,
    };
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
      documentType: config.documentType,
      enabled: config.enabled,
    }));
    return { sources };
  }
}
