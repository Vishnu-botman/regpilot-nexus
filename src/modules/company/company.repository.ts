import { Injectable } from '@nitrostack/core';
import { prisma } from '../../lib/prisma.js';

@Injectable()
export class CompanyRepository {
  async getProfile(companyId: string) {
    return prisma.companyProfile.findUnique({
      where: { id: companyId },
      include: {
        policies: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getFirstProfile() {
    return prisma.companyProfile.findFirst({
      include: {
        policies: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async updateProfile(companyId: string, data: {
    name?: string;
    industry?: string;
    subIndustry?: string;
    entityType?: string;
    incorporationType?: string;
    jurisdictions?: string[];
    locations?: string[];
    products?: string[];
    services?: string[];
    licenses?: string[];
    employeeCount?: number;
    website?: string;
  }) {
    return prisma.companyProfile.update({
      where: { id: companyId },
      data,
      include: { policies: true },
    });
  }

  async createProfile(data: {
    name: string;
    industry?: string;
    subIndustry?: string;
    entityType?: string;
    incorporationType?: string;
    jurisdictions?: string[];
    locations?: string[];
    products?: string[];
    services?: string[];
    licenses?: string[];
    employeeCount?: number;
    website?: string;
  }) {
    return prisma.companyProfile.create({ data });
  }

  async listPolicies(companyId: string) {
    return prisma.policy.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPolicyById(policyId: string) {
    return prisma.policy.findUnique({
      where: { id: policyId },
      include: { company: true },
    });
  }

  async createPolicy(data: {
    companyId: string;
    title: string;
    category?: string;
    version?: string;
    status?: string;
  }) {
    return prisma.policy.create({ data });
  }

  async updatePolicy(policyId: string, data: {
    title?: string;
    category?: string;
    version?: string;
    status?: string;
  }) {
    return prisma.policy.update({
      where: { id: policyId },
      data,
    });
  }
}
