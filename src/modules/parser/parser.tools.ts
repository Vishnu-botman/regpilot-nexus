import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { ParserService } from './parser.service.js';
import { DocumentFormat } from './parser.types.js';

@Injectable({ deps: [ParserService] })
export class ParserTools {
  constructor(private readonly parserService: ParserService) {}

  @Tool({
    name: 'parse_document',
    description: 'Parse a regulatory document into structured sections and metadata',
    inputSchema: z.object({
      content: z.string().describe('Document content (HTML, text, etc.)'),
      format: z.enum(['html', 'pdf', 'gazette', 'text']).describe('Document format'),
      metadata: z.record(z.string()).optional().describe('Document metadata'),
    })
  })
  async parseDocument(input: { content: string; format: DocumentFormat; metadata?: Record<string, string> }) {
    const parsed = await this.parserService.parseDocument(
      input.content,
      input.format,
      input.metadata || {}
    );

    return {
      title: parsed.title,
      documentType: parsed.documentType,
      regulationNumber: parsed.regulationNumber,
      sectionsCount: parsed.sections.length,
      tablesCount: parsed.tables.length,
      sections: parsed.sections,
      metadata: parsed.metadata,
    };
  }

  @Tool({
    name: 'extract_metadata',
    description: 'Extract metadata from document content',
    inputSchema: z.object({
      content: z.string().describe('Document content'),
    })
  })
  async extractMetadata(input: { content: string }) {
    const metadata = this.parserService.extractMetadata(input.content);
    return { metadata };
  }
}
