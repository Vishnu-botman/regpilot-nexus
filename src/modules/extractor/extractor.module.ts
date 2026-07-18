import { Module } from '@nitrostack/core';
import { ExtractorTools } from './extractor.tools.js';
import { ExtractorService } from './extractor.service.js';

@Module({
  name: 'extractor',
  description: 'Compliance object extraction from parsed regulations',
  imports: [],
  controllers: [],
  providers: [
    ExtractorService,
  ],
  exports: [
    ExtractorService,
  ]
})
export class ExtractorModule {}
