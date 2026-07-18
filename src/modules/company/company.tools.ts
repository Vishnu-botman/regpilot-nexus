import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { CompanyRepository } from './company.repository.js';

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

  @Tool({
    name: 'update_company_profile',
    description: 'Update company profile information for applicability evaluation',
    inputSchema: z.object({
      companyId: z.string().describe('Company ID'),
      name: z.string().optional(),
      industry: z.string().optional(),
      subIndustry: z.string().optional(),
      entityType: z.string().optional(),
      jurisdictions: z.array(z.string()).optional(),
      locations: z.array(z.string()).optional(),
      products: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
      licenses: z.array(z.string()).optional(),
      employeeCount: z.number().optional(),
      website: z.string().optional(),
    })
  })
  async updateCompanyProfile(input: {
    companyId: string;
    name?: string;
    industry?: string;
    subIndustry?: string;
    entityType?: string;
    jurisdictions?: string[];
    locations?: string[];
    products?: string[];
    services?: string[];
    licenses?: string[];
    employeeCount?: number;
    website?: string;
  }) {
    const { companyId, ...data } = input;

    const updated = await this.repo.updateProfile(companyId, data);

    return {
      success: true,
      profile: {
        id: updated.id,
        name: updated.name,
        industry: updated.industry,
        subIndustry: updated.subIndustry,
        entityType: updated.entityType,
        jurisdictions: updated.jurisdictions,
        locations: updated.locations,
        products: updated.products,
        services: updated.services,
        licenses: updated.licenses,
        employeeCount: updated.employeeCount,
      },
    };
  }

  @Tool({
    name: 'manage_policies',
    description: 'List, create, or update company policies',
    inputSchema: z.object({
      companyId: z.string().describe('Company ID'),
      action: z.enum(['list', 'create', 'update']).describe('Action to perform'),
      policyId: z.string().optional().describe('Policy ID (for update)'),
      title: z.string().optional().describe('Policy title (for create/update)'),
      category: z.string().optional().describe('Policy category (for create/update)'),
      version: z.string().optional().describe('Policy version (for create/update)'),
      status: z.string().optional().describe('Policy status (for create/update)'),
    })
  })
  async managePolicies(input: {
    companyId: string;
    action: 'list' | 'create' | 'update';
    policyId?: string;
    title?: string;
    category?: string;
    version?: string;
    status?: string;
  }) {
    switch (input.action) {
      case 'list': {
        const policies = await this.repo.listPolicies(input.companyId);
        return {
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

      case 'create': {
        if (!input.title) {
          return { error: 'Title is required for policy creation' };
        }
        const policy = await this.repo.createPolicy({
          companyId: input.companyId,
          title: input.title,
          category: input.category,
          version: input.version,
          status: input.status,
        });
        return {
          success: true,
          policy: {
            id: policy.id,
            title: policy.title,
            category: policy.category,
            version: policy.version,
            status: policy.status,
          },
        };
      }

      case 'update': {
        if (!input.policyId) {
          return { error: 'Policy ID is required for update' };
        }
        const data: any = {};
        if (input.title) data.title = input.title;
        if (input.category) data.category = input.category;
        if (input.version) data.version = input.version;
        if (input.status) data.status = input.status;

        const updated = await this.repo.updatePolicy(input.policyId, data);
        return {
          success: true,
          policy: {
            id: updated.id,
            title: updated.title,
            category: updated.category,
            version: updated.version,
            status: updated.status,
          },
        };
      }
    }
  }
}
