import { Module } from '@nitrostack/core';
import { CompanyTools } from './company.tools.js';
import { CompanyResources } from './company.resources.js';
import { CompanyRepository } from './company.repository.js';

@Module({
  name: 'company',
  description: 'Company profile management and policy tracking',
  imports: [],
  controllers: [
    CompanyTools,
    CompanyResources,
  ],
  providers: [
    CompanyRepository,
  ],
  exports: [
    CompanyRepository,
  ]
})
export class CompanyModule {}
