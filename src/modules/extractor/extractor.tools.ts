import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { ExtractorService } from './extractor.service.js';
import { ParsedSection } from '../parser/parser.types.js';

@Injectable({ deps: [ExtractorService] })
export class ExtractorTools {
  constructor(private readonly extractorService: ExtractorService) {}

  @Tool({
    name: 'extract_compliance_objects',
    description: 'Extract compliance objects (obligations, deadlines, penalties) from parsed sections',
    inputSchema: z.object({
      sections: z.array(z.object({
        sectionNumber: z.string(),
        title: z.string(),
        content: z.string(),
        level: z.number(),
      })).describe('Parsed document sections'),
    })
  })
  async extractComplianceObjects(input: { sections: ParsedSection[] }) {
    const result = this.extractorService.extractFromSections(input.sections);
    return {
      obligations: result.obligations,
      deadlines: result.deadlines,
      penalties: result.penalties,
      reportingRequirements: result.reportingRequirements,
      applicabilities: result.applicabilities,
    };
  }
}
