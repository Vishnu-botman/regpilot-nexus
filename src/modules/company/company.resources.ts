import { ResourceDecorator as Resource, Injectable } from '@nitrostack/core';
import { CompanyRepository } from './company.repository.js';

@Injectable({ deps: [CompanyRepository] })
export class CompanyResources {
  constructor(private readonly repo: CompanyRepository) {}

  @Resource({
    uri: 'company://profile',
    name: 'Company Profile',
    description: 'Current company profile for applicability evaluation',
    mimeType: 'application/json'
  })
  async getCompanyProfile() {
    const profile = await this.repo.getFirstProfile();
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
    };
  }

  @Resource({
    uri: 'policies://all',
    name: 'All Policies',
    description: 'All company policies for compliance mapping',
    mimeType: 'application/json'
  })
  async getAllPolicies() {
    const profile = await this.repo.getFirstProfile();
    if (!profile) {
      return { policies: [], total: 0 };
    }

    const policies = await this.repo.listPolicies(profile.id);
    return {
      company: profile.name,
      policies: policies.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        version: p.version,
        status: p.status,
        createdAt: p.createdAt,
      })),
      total: policies.length,
    };
  }
}
