import { Injectable } from '@nitrostack/core';
import { prisma } from '../../lib/prisma.js';
import * as cheerio from 'cheerio';
import {
  RegulatorySource,
  DiscoveredDocument,
  MonitorResult,
  SOURCE_CONFIGS,
} from './monitor.types.js';
import crypto from 'crypto';

@Injectable()
export class MonitorService {
  private seenHashes: Map<string, string> = new Map();

  async checkSource(source: RegulatorySource): Promise<MonitorResult> {
    const config = SOURCE_CONFIGS[source];
    if (!config || !config.enabled) {
      return {
        source,
        success: false,
        documentsFound: 0,
        newDocuments: [],
        updatedDocuments: [],
        error: `Source ${source} is not enabled`,
        checkedAt: new Date(),
      };
    }

    try {
      const documents = await this.fetchDocuments(source, config);
      const result = await this.processDocuments(source, documents);

      return {
        source,
        success: true,
        documentsFound: documents.length,
        newDocuments: result.newDocuments,
        updatedDocuments: result.updatedDocuments,
        checkedAt: new Date(),
      };
    } catch (error) {
      return {
        source,
        success: false,
        documentsFound: 0,
        newDocuments: [],
        updatedDocuments: [],
        error: error instanceof Error ? error.message : String(error),
        checkedAt: new Date(),
      };
    }
  }

  private async fetchDocuments(
    source: RegulatorySource,
    config: { baseUrl: string; feedUrl: string; enabled: boolean }
  ): Promise<DiscoveredDocument[]> {
    console.log(`[Monitor] Fetching from ${source}: ${config.feedUrl}`);

    try {
      const response = await fetch(config.feedUrl, {
        headers: {
          'User-Agent': 'RegPilot-Nexus/1.0 (Compliance Monitoring Bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.parseHTML(source, html, config.baseUrl);
    } catch (error) {
      console.error(`[Monitor] Error fetching from ${source}:`, error);
      return [];
    }
  }

  private parseHTML(source: RegulatorySource, html: string, baseUrl: string): DiscoveredDocument[] {
    const $ = cheerio.load(html);
    const documents: DiscoveredDocument[] = [];

    switch (source) {
      case 'rbi':
        return this.parseRBI($, baseUrl);
      case 'sebi':
        return this.parseSEBI($, baseUrl);
      case 'mca':
        return this.parseMCA($, baseUrl);
      case 'cert_in':
        return this.parseCERTIn($, baseUrl);
      default:
        return [];
    }
  }

  private parseRBI($: cheerio.CheerioAPI, baseUrl: string): DiscoveredDocument[] {
    const documents: DiscoveredDocument[] = [];

    // RBI publications page structure
    $('table.table-responsive tbody tr').each((_, element) => {
      const title = $(element).find('td:nth-child(2) a').text().trim();
      const link = $(element).find('td:nth-child(2) a').attr('href');
      const dateStr = $(element).find('td:nth-child(1)').text().trim();

      if (title && link) {
        const url = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const contentHash = this.generateSourceHash(title + url);
        
        documents.push({
          title,
          url,
          source: 'rbi',
          publishedDate: new Date(),
          documentType: 'circular',
          sourceHash: contentHash,
        });
      }
    });

    // Also check press releases
    $('div.row div.col-md-4').each((_, element) => {
      const title = $(element).find('h5 a').text().trim();
      const link = $(element).find('h5 a').attr('href');
      const dateStr = $(element).find('p').text().trim();

      if (title && link) {
        const url = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const contentHash = this.generateSourceHash(title + url);
        
        documents.push({
          title,
          url,
          source: 'rbi',
          publishedDate: new Date(),
          documentType: 'press_release',
          sourceHash: contentHash,
        });
      }
    });

    return documents;
  }

  private parseSEBI($: cheerio.CheerioAPI, baseUrl: string): DiscoveredDocument[] {
    const documents: DiscoveredDocument[] = [];

    // SEBI circulars page structure
    $('table tbody tr').each((_, element) => {
      const title = $(element).find('td:nth-child(2)').text().trim();
      const link = $(element).find('td:nth-child(2) a').attr('href');
      const dateStr = $(element).find('td:nth-child(1)').text().trim();

      if (title && link) {
        const url = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const contentHash = this.generateSourceHash(title + url);
        
        documents.push({
          title,
          url,
          source: 'sebi',
          publishedDate: new Date(),
          documentType: 'circular',
          sourceHash: contentHash,
        });
      }
    });

    return documents;
  }

  private parseMCA($: cheerio.CheerioAPI, baseUrl: string): DiscoveredDocument[] {
    const documents: DiscoveredDocument[] = [];

    // MCA notifications page structure
    $('div.panel-body ul li').each((_, element) => {
      const title = $(element).find('a').text().trim();
      const link = $(element).find('a').attr('href');
      const dateStr = $(element).text().match(/\d{2}\.\d{2}\.\d{4}/)?.[0] || '';

      if (title && link) {
        const url = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const contentHash = this.generateSourceHash(title + url);
        
        documents.push({
          title,
          url,
          source: 'mca',
          publishedDate: new Date(),
          documentType: 'notification',
          sourceHash: contentHash,
        });
      }
    });

    return documents;
  }

  private parseCERTIn($: cheerio.CheerioAPI, baseUrl: string): DiscoveredDocument[] {
    const documents: DiscoveredDocument[] = [];

    // CERT-In advisories page structure
    $('div.advisory-item').each((_, element) => {
      const title = $(element).find('h4').text().trim();
      const link = $(element).find('a').attr('href');
      const dateStr = $(element).find('span.date').text().trim();

      if (title && link) {
        const url = link.startsWith('http') ? link : `${baseUrl}${link}`;
        const contentHash = this.generateSourceHash(title + url);
        
        documents.push({
          title,
          url,
          source: 'cert_in',
          publishedDate: new Date(),
          documentType: 'advisory',
          sourceHash: contentHash,
        });
      }
    });

    return documents;
  }

  private async processDocuments(
    source: RegulatorySource,
    documents: DiscoveredDocument[]
  ): Promise<{ newDocuments: DiscoveredDocument[]; updatedDocuments: DiscoveredDocument[] }> {
    const newDocuments: DiscoveredDocument[] = [];
    const updatedDocuments: DiscoveredDocument[] = [];

    for (const doc of documents) {
      const existingHash = this.seenHashes.get(doc.url);

      if (!existingHash) {
        // New document
        this.seenHashes.set(doc.url, doc.sourceHash);
        newDocuments.push(doc);
      } else if (existingHash !== doc.sourceHash) {
        // Updated document
        this.seenHashes.set(doc.url, doc.sourceHash);
        updatedDocuments.push(doc);
      }
    }

    return { newDocuments, updatedDocuments };
  }

  generateSourceHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async getRecentDocuments(source: RegulatorySource, limit: number = 10) {
    return prisma.regulation.findMany({
      where: {
        sourceUrl: {
          contains: SOURCE_CONFIGS[source]?.baseUrl || '',
        },
      },
      include: {
        regulator: true,
        versions: {
          orderBy: { publicationDate: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markDocumentProcessed(document: DiscoveredDocument) {
    // Store the hash to track we've seen this document
    this.seenHashes.set(document.url, document.sourceHash);
  }
}
