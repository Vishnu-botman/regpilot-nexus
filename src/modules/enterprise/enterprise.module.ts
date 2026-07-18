import { Module } from '@nitrostack/core';
import { EnterpriseTools } from './enterprise.tools.js';

@Module({
  name: 'enterprise',
  description: 'External integrations (GitHub, Slack, future: Jira, Email)',
  imports: [],
  controllers: [
    EnterpriseTools,
  ],
  providers: [],
  exports: [
    EnterpriseTools,
  ]
})
export class EnterpriseModule {}
