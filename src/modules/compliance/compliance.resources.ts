import { ResourceDecorator as Resource } from '@nitrostack/core';
import { ComplianceRepository } from './compliance.repository.js';

export class ComplianceResources {
  constructor(private readonly repo: ComplianceRepository) {}

  @Resource({
    uri: 'obligations://all',
    name: 'All Obligations',
    description: 'All compliance obligations across applicable regulations with summary stats',
    mimeType: 'application/json'
  })
  async getAllObligations() {
    const [data, stats] = await Promise.all([
      this.repo.getAllObligations(100, 0),
      this.repo.getObligationStats(),
    ]);

    const obligations = data.obligations.map(o => ({
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
      section: o.section.sectionNumber,
    }));

    return {
      summary: stats,
      obligations,
    };
  }
}
