export interface ParsedSection {
  sectionNumber: string;
  title: string;
  content: string;
  level: number;
  subsections: ParsedSection[];
}

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export interface ParsedDocument {
  title: string;
  documentType: string;
  regulationNumber?: string;
  issueDate?: Date;
  effectiveDate?: Date;
  sourceUrl: string;
  language: string;
  sections: ParsedSection[];
  tables: ParsedTable[];
  metadata: Record<string, string>;
  rawContent: string;
}

export type DocumentFormat = 'html' | 'pdf' | 'gazette' | 'text';

export interface ParserConfig {
  format: DocumentFormat;
  preserveFormatting: boolean;
  extractTables: boolean;
  maxDepth: number;
}

export const DEFAULT_PARSER_CONFIG: ParserConfig = {
  format: 'html',
  preserveFormatting: false,
  extractTables: true,
  maxDepth: 5,
};
