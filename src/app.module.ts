import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { RegulationsModule } from './modules/regulations/regulations.module.js';
import { ComplianceModule } from './modules/compliance/compliance.module.js';
import { CompanyModule } from './modules/company/company.module.js';
import { EnterpriseModule } from './modules/enterprise/enterprise.module.js';
import { KnowledgeModule } from './modules/knowledge/knowledge.module.js';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module.js';
import { SystemHealthCheck } from './health/system.health.js';

const logLevel = (process.env.LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'info' || process.env.LOG_LEVEL === 'warn' || process.env.LOG_LEVEL === 'error')
  ? process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error'
  : 'info';

@McpApp({
  module: AppModule,
  server: {
    name: 'regpilot-nexus',
    version: '0.1.0'
  },
  logging: {
    level: logLevel
  }
})
@Module({
  name: 'app',
  description: 'RegPilot Nexus - Regulatory Compliance MCP Server',
  imports: [
    ConfigModule.forRoot(),
    RegulationsModule,
    ComplianceModule,
    CompanyModule,
    EnterpriseModule,
    KnowledgeModule,
    EmbeddingsModule,
  ],
  providers: [
    SystemHealthCheck,
  ]
})
export class AppModule {}
