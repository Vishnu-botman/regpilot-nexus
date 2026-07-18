import { Module } from '@nitrostack/core';
import { ComplianceTools } from './compliance.tools.js';
import { ComplianceResources } from './compliance.resources.js';
import { CompliancePrompts } from './compliance.prompts.js';
import { ComplianceRepository } from './compliance.repository.js';

@Module({
  name: 'compliance',
  description: 'Applicability evaluation, obligation tracking, and action planning',
  imports: [],
  controllers: [
    ComplianceTools,
    ComplianceResources,
    CompliancePrompts,
  ],
  providers: [
    ComplianceRepository,
  ],
  exports: [
    ComplianceRepository,
  ]
})
export class ComplianceModule {}
