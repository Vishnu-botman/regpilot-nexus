import { Module } from '@nitrostack/core';
import { RegulationsTools } from './regulations.tools.js';
import { RegulationsResources } from './regulations.resources.js';
import { RegulationsPrompts } from './regulations.prompts.js';
import { RegulationsRepository } from './regulations.repository.js';

@Module({
  name: 'regulations',
  description: 'Regulation monitoring, parsing, and versioning',
  imports: [],
  controllers: [
    RegulationsTools,
    RegulationsResources,
    RegulationsPrompts,
  ],
  providers: [
    RegulationsRepository,
  ],
  exports: [
    RegulationsRepository,
  ]
})
export class RegulationsModule {}
