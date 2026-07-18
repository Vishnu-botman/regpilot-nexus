import { Module } from '@nitrostack/core';
import { ParserTools } from './parser.tools.js';
import { ParserService } from './parser.service.js';

@Module({
  name: 'parser',
  description: 'Document parsing and structured extraction',
  imports: [],
  controllers: [],
  providers: [
    ParserService,
  ],
  exports: [
    ParserService,
  ]
})
export class ParserModule {}
