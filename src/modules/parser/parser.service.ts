import { Injectable } from '@nitrostack/core';
import * as cheerio from 'cheerio';
import {
  ParsedDocument,
  ParsedSection,
  ParsedTable,
  ParserConfig,
  DEFAULT_PARSER_CONFIG,
  DocumentFormat,
} from './parser.types.js';

@Injectable()
export class ParserService {
  private config: ParserConfig;

  constructor(config?: Partial<ParserConfig>) {
    this.config = { ...DEFAULT_PARSER_CONFIG, ...config };
  }

  async parseDocument(
    content: string,
    format: DocumentFormat,
    metadata: Record<string, string> = {}
  ): Promise<ParsedDocument> {
    switch (format) {
      case 'html':
        return this.parseHtml(content, metadata);
      case 'text':
        return this.parseText(content, metadata);
      case 'pdf':
        return this.parsePdf(content, metadata);
      case 'gazette':
        return this.parseGazette(content, metadata);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async parseHtml(
    content: string,
    metadata: Record<string, string>
  ): Promise<ParsedDocument> {
    const $ = cheerio.load(content);
    
    // Remove script and style elements
    $('script, style, nav, footer, header').remove();
    
    // Extract title from page title or first h1
    const title = $('title').text().trim() || $('h1').first().text().trim() || metadata.title || 'Untitled Document';
    
    // Extract sections from headings
    const sections = this.extractSectionsFromHtml($);
    
    // Extract tables
    const tables = this.config.extractTables ? this.extractTablesFromHtml($) : [];
    
    // Extract metadata from meta tags
    const extractedMetadata = this.extractMetadataFromHtml($, metadata);

    return {
      title,
      documentType: metadata.documentType || 'unknown',
      regulationNumber: metadata.regulationNumber || extractedMetadata.regulationNumber,
      issueDate: metadata.issueDate ? new Date(metadata.issueDate) : undefined,
      effectiveDate: metadata.effectiveDate ? new Date(metadata.effectiveDate) : undefined,
      sourceUrl: metadata.sourceUrl || '',
      language: metadata.language || 'en',
      sections,
      tables,
      metadata: extractedMetadata,
      rawContent: content,
    };
  }

  private async parseText(
    content: string,
    metadata: Record<string, string>
  ): Promise<ParsedDocument> {
    const sections = this.extractSectionsFromText(content);

    return {
      title: metadata.title || 'Untitled Document',
      documentType: metadata.documentType || 'unknown',
      regulationNumber: metadata.regulationNumber,
      issueDate: metadata.issueDate ? new Date(metadata.issueDate) : undefined,
      effectiveDate: metadata.effectiveDate ? new Date(metadata.effectiveDate) : undefined,
      sourceUrl: metadata.sourceUrl || '',
      language: metadata.language || 'en',
      sections,
      tables: [],
      metadata,
      rawContent: content,
    };
  }

  private async parsePdf(
    content: string,
    metadata: Record<string, string>
  ): Promise<ParsedDocument> {
    // PDF content would be pre-extracted to text
    return this.parseText(content, metadata);
  }

  private async parseGazette(
    content: string,
    metadata: Record<string, string>
  ): Promise<ParsedDocument> {
    // Gazette documents have specific structure
    return this.parseText(content, metadata);
  }

  private extractSectionsFromHtml($: cheerio.CheerioAPI): ParsedSection[] {
    const sections: ParsedSection[] = [];
    
    // Find all headings (h1-h6)
    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
      const $el = $(element);
      const level = parseInt(element.tagName.charAt(1));
      const title = $el.text().trim();
      
      // Get content until next heading
      let content = '';
      let nextElement = $el.next();
      while (nextElement.length && !nextElement.is('h1, h2, h3, h4, h5, h6')) {
        content += nextElement.text() + '\n';
        nextElement = nextElement.next();
      }
      
      // Extract section number from title if present
      const sectionMatch = title.match(/^(\d+(?:\.\d+)*)\s+(.+)/);
      
      sections.push({
        sectionNumber: sectionMatch ? sectionMatch[1] : '',
        title: sectionMatch ? sectionMatch[2] : title,
        content: content.trim(),
        level,
        subsections: [],
      });
    });
    
    return sections;
  }

  private extractSectionsFromText(content: string): ParsedSection[] {
    const sections: ParsedSection[] = [];
    const lines = content.split('\n');

    let currentSection: ParsedSection | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const sectionMatch = line.match(/^(\d+(?:\.\d+)*)\s+(.+)/);

      if (sectionMatch) {
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }

        currentSection = {
          sectionNumber: sectionMatch[1],
          title: sectionMatch[2],
          content: '',
          level: sectionMatch[1].split('.').length,
          subsections: [],
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections;
  }

  private extractTablesFromHtml($: cheerio.CheerioAPI): ParsedTable[] {
    const tables: ParsedTable[] = [];
    
    $('table').each((_, tableElement) => {
      const $table = $(tableElement);
      const headers: string[] = [];
      const rows: string[][] = [];
      
      // Extract headers
      $table.find('thead th, thead td').each((_, th) => {
        headers.push($(th).text().trim());
      });
      
      // Extract rows
      $table.find('tbody tr').each((_, tr) => {
        const cells: string[] = [];
        $(tr).find('td, th').each((_, td) => {
          cells.push($(td).text().trim());
        });
        if (cells.length > 0) {
          rows.push(cells);
        }
      });
      
      // If no thead, try first row as headers
      if (headers.length === 0) {
        const firstRow = $table.find('tr').first();
        firstRow.find('td, th').each((_, td) => {
          headers.push($(td).text().trim());
        });
        // Skip first row in body
        $table.find('tr').slice(1).each((_, tr) => {
          const cells: string[] = [];
          $(tr).find('td, th').each((_, td) => {
            cells.push($(td).text().trim());
          });
          if (cells.length > 0) {
            rows.push(cells);
          }
        });
      }
      
      if (headers.length > 0 || rows.length > 0) {
        tables.push({ headers, rows });
      }
    });
    
    return tables;
  }

  private extractMetadataFromHtml($: cheerio.CheerioAPI, baseMetadata: Record<string, string>): Record<string, string> {
    const metadata = { ...baseMetadata };
    
    // Extract from meta tags
    $('meta').each((_, element) => {
      const name = $(element).attr('name') || $(element).attr('property') || '';
      const content = $(element).attr('content') || '';
      
      if (name && content) {
        if (name.includes('title') || name.includes('og:title')) {
          metadata.title = content;
        } else if (name.includes('description') || name.includes('og:description')) {
          metadata.description = content;
        } else if (name.includes('date') || name.includes('published')) {
          metadata.publishDate = content;
        }
      }
    });
    
    // Extract regulation number patterns from content
    const bodyText = $('body').text();
    const regNumMatch = bodyText.match(/(?:No\.|Number|Regulation)\s*[:.]?\s*([A-Z0-9\/-]+)/i);
    if (regNumMatch && !metadata.regulationNumber) {
      metadata.regulationNumber = regNumMatch[1].trim();
    }
    
    // Extract dates from content
    const dateMatch = bodyText.match(/(?:dated|date|issued on)\s*[:.]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i);
    if (dateMatch && !metadata.issueDate) {
      metadata.issueDate = dateMatch[1].trim();
    }
    
    return metadata;
  }

  extractMetadata(content: string): Record<string, string> {
    const $ = cheerio.load(content);
    return this.extractMetadataFromHtml($, {});
  }
}
