import { ResourceDecorator as Resource, Injectable } from '@nitrostack/core';
import { RegulationsRepository } from './regulations.repository.js';

@Injectable({ deps: [RegulationsRepository] })
export class RegulationsResources {
  constructor(private readonly repository: RegulationsRepository) {}

  @Resource({
    uri: 'regulations://latest',
    name: 'Latest Regulations',
    description: 'Most recent active regulations from all regulators with latest version info',
    mimeType: 'application/json'
  })
  async getLatestRegulations() {
    const regulations = await this.repository.getLatest(10);
    return {
      regulations: regulations.map(r => ({
        id: r.id,
        title: r.title,
        regulationNumber: r.regulationNumber,
        documentType: r.documentType,
        status: r.status,
        effectiveDate: r.effectiveDate,
        regulator: r.regulator.abbreviation,
        latestVersion: r.versions[0]?.versionNumber || null,
      })),
    };
  }

  @Resource({
    uri: 'regulations://history',
    name: 'Regulation History',
    description: 'Historical regulations and version timeline',
    mimeType: 'application/json'
  })
  async getRegulationHistory() {
    const regulations = await this.repository.getLatest(50);
    return {
      history: regulations.map(r => ({
        id: r.id,
        title: r.title,
        regulator: r.regulator.abbreviation,
        effectiveDate: r.effectiveDate,
        versions: r.versions.length,
      })),
    };
  }
}
