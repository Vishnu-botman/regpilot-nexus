import { ToolDecorator as Tool, Injectable, z } from '@nitrostack/core';
import { CompanyRepository } from './company.repository.js';

@Injectable({ deps: [CompanyRepository] })
export class CompanyTools {
  constructor(private readonly repo: CompanyRepository) {}

  @Tool({
    name: 'get_company_profile',
    description: 'Get the company profile for applicability evaluation',
    inputSchema: z.object({
      companyId: z.string().optional().describe('Company ID (defaults to first profile)'),
    })
  })
  async getCompanyProfile(input: { companyId?: string }) {
    const profile = input.companyId
      ? await this.repo.getProfile(input.companyId)
      : await this.repo.getFirstProfile();

    if (!profile) {
      return { error: 'No company profile found' };
    }

    return {
      id: profile.id,
      name: profile.name,
      industry: profile.industry,
      subIndustry: profile.subIndustry,
      entityType: profile.entityType,
      incorporationType: profile.incorporationType,
      jurisdictions: profile.jurisdictions,
      locations: profile.locations,
      products: profile.products,
      services: profile.services,
      licenses: profile.licenses,
      employeeCount: profile.employeeCount,
      website: profile.website,
      policies: profile.policies.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        version: p.version,
        status: p.status,
      })),
    };
  }
}
