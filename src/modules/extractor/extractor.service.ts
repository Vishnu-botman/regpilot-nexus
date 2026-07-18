import { Injectable } from '@nitrostack/core';
import {
  ExtractedObligation,
  ExtractedDeadline,
  ExtractedPenalty,
  ExtractedReportingRequirement,
  ExtractedApplicability,
  ExtractionResult,
  ExtractionConfig,
  DEFAULT_EXTRACTION_CONFIG,
} from './extractor.types.js';
import { ParsedSection } from '../parser/parser.types.js';

@Injectable()
export class ExtractorService {
  private config: ExtractionConfig;

  constructor(config?: Partial<ExtractionConfig>) {
    this.config = { ...DEFAULT_EXTRACTION_CONFIG, ...config };
  }

  extractFromSections(sections: ParsedSection[]): ExtractionResult {
    const result: ExtractionResult = {
      obligations: [],
      deadlines: [],
      penalties: [],
      reportingRequirements: [],
      applicabilities: [],
    };

    for (const section of sections) {
      if (this.config.detectObligations) {
        result.obligations.push(...this.extractObligations(section));
      }
      if (this.config.detectDeadlines) {
        result.deadlines.push(...this.extractDeadlines(section));
      }
      if (this.config.detectPenalties) {
        result.penalties.push(...this.extractPenalties(section));
      }
      if (this.config.detectReporting) {
        result.reportingRequirements.push(...this.extractReportingRequirements(section));
      }
      if (this.config.detectApplicability) {
        result.applicabilities.push(...this.extractApplicabilities(section));
      }
    }

    return result;
  }

  private extractObligations(section: ParsedSection): ExtractedObligation[] {
    const obligations: ExtractedObligation[] = [];
    const content = section.content.toLowerCase();

    // Keywords that indicate obligations
    const obligationKeywords = [
      'shall', 'must', 'required to', 'obligated to',
      'is mandated to', 'should ensure', 'need to',
    ];

    const hasObligation = obligationKeywords.some(keyword => content.includes(keyword));

    if (hasObligation) {
      const priority = this.determinePriority(content);
      const mandatory = this.determineMandatory(content);
      const frequency = this.determineFrequency(content);
      const obligationType = this.determineObligationType(content);

      obligations.push({
        title: section.title,
        description: section.content,
        obligationType,
        priority,
        mandatory,
        frequency,
        sectionNumber: section.sectionNumber,
      });
    }

    return obligations;
  }

  private extractDeadlines(section: ParsedSection): ExtractedDeadline[] {
    const deadlines: ExtractedDeadline[] = [];
    const content = section.content.toLowerCase();

    // Keywords that indicate deadlines
    const deadlineKeywords = [
      'within', 'before', 'after', 'by the',
      'no later than', 'deadline', 'timeline',
    ];

    const hasDeadline = deadlineKeywords.some(keyword => content.includes(keyword));

    if (hasDeadline) {
      deadlines.push({
        obligationTitle: section.title,
        deadlineType: 'relative',
        description: this.extractDeadlineDescription(section.content),
      });
    }

    return deadlines;
  }

  private extractPenalties(section: ParsedSection): ExtractedPenalty[] {
    const penalties: ExtractedPenalty[] = [];
    const content = section.content.toLowerCase();

    // Keywords that indicate penalties
    const penaltyKeywords = [
      'penalty', 'fine', 'punishment', 'consequences',
      'non-compliance may attract', 'supervisory action',
      'monetary penalty', 'restriction',
    ];

    const hasPenalty = penaltyKeywords.some(keyword => content.includes(keyword));

    if (hasPenalty) {
      const severity = this.determineSeverity(content);

      penalties.push({
        sectionNumber: section.sectionNumber,
        description: section.content,
        penaltyType: this.determinePenaltyType(content),
        severity,
      });
    }

    return penalties;
  }

  private extractReportingRequirements(section: ParsedSection): ExtractedReportingRequirement[] {
    const requirements: ExtractedReportingRequirement[] = [];
    const content = section.content.toLowerCase();

    // Keywords that indicate reporting requirements
    const reportingKeywords = [
      'report', 'submit', 'file', 'disclosure',
      'notify', 'reporting requirement',
    ];

    const hasReporting = reportingKeywords.some(keyword => content.includes(keyword));

    if (hasReporting) {
      requirements.push({
        obligationTitle: section.title,
        authority: this.extractAuthority(section.content),
        reportType: this.determineReportType(content),
        frequency: this.determineFrequency(content) || 'ongoing',
      });
    }

    return requirements;
  }

  private extractApplicabilities(section: ParsedSection): ExtractedApplicability[] {
    const applicabilities: ExtractedApplicability[] = [];
    const content = section.content.toLowerCase();

    // Keywords that indicate applicability
    const applicabilityKeywords = [
      'applies to', 'applicable to', 'shall apply',
      'this section applies', 'these directions apply',
    ];

    const hasApplicability = applicabilityKeywords.some(keyword => content.includes(keyword));

    if (hasApplicability) {
      const industries = this.extractIndustries(content);
      const entityTypes = this.extractEntityTypes(content);
      const jurisdictions = this.extractJurisdictions(content);

      applicabilities.push({
        sectionNumber: section.sectionNumber,
        description: section.content,
        operator: 'includes',
        industries,
        entityTypes,
        jurisdictions,
      });
    }

    return applicabilities;
  }

  private determinePriority(content: string): 'high' | 'medium' | 'low' {
    const highKeywords = ['critical', 'urgent', 'immediately', 'without delay'];
    const lowKeywords = ['optional', 'recommended', 'advisory'];

    if (highKeywords.some(k => content.includes(k))) return 'high';
    if (lowKeywords.some(k => content.includes(k))) return 'low';
    return this.config.defaultPriority;
  }

  private determineMandatory(content: string): boolean {
    const mandatoryKeywords = ['shall', 'must', 'required', 'mandatory'];
    const optionalKeywords = ['may', 'optional', 'recommended'];

    if (mandatoryKeywords.some(k => content.includes(k))) return true;
    if (optionalKeywords.some(k => content.includes(k))) return false;
    return this.config.defaultMandatory;
  }

  private determineFrequency(content: string): string | undefined {
    if (content.includes('daily')) return 'daily';
    if (content.includes('weekly')) return 'weekly';
    if (content.includes('monthly')) return 'monthly';
    if (content.includes('quarterly')) return 'quarterly';
    if (content.includes('annually') || content.includes('yearly')) return 'annually';
    return undefined;
  }

  private determineObligationType(content: string): string {
    if (content.includes('report') || content.includes('submit')) return 'filing';
    if (content.includes('maintain') || content.includes('keep')) return 'maintenance';
    if (content.includes('disclose') || content.includes('disclosure')) return 'disclosure';
    return 'general';
  }

  private determineSeverity(content: string): 'high' | 'medium' | 'low' {
    const highKeywords = ['criminal', 'imprisonment', 'significant', 'substantial'];
    const lowKeywords = ['minor', 'warning', 'advisory'];

    if (highKeywords.some(k => content.includes(k))) return 'high';
    if (lowKeywords.some(k => content.includes(k))) return 'low';
    return 'medium';
  }

  private determinePenaltyType(content: string): string {
    if (content.includes('criminal')) return 'criminal';
    if (content.includes('monetary') || content.includes('fine')) return 'monetary';
    if (content.includes('restriction')) return 'restriction';
    return 'regulatory_action';
  }

  private determineReportType(content: string): string {
    if (content.includes('annual')) return 'annual_report';
    if (content.includes('quarterly')) return 'quarterly_report';
    if (content.includes('monthly')) return 'monthly_report';
    return 'periodic_report';
  }

  private extractDeadlineDescription(content: string): string {
    const match = content.match(/within\s+(\d+\s+\w+)/i);
    return match ? `Within ${match[1]}` : 'As per regulation';
  }

  private extractAuthority(content: string): string {
    const authorities = ['RBI', 'SEBI', 'MCA', 'CERT-In', 'Reserve Bank', 'Board'];
    for (const auth of authorities) {
      if (content.includes(auth)) return auth;
    }
    return 'Regulatory Authority';
  }

  private extractIndustries(content: string): string[] {
    const industries: string[] = [];
    if (content.includes('banking')) industries.push('banking');
    if (content.includes('nbfc') || content.includes('non-banking')) industries.push('nbfc');
    if (content.includes('fintech')) industries.push('fintech');
    if (content.includes('insurance')) industries.push('insurance');
    if (content.includes('securities')) industries.push('securities');
    return industries;
  }

  private extractEntityTypes(content: string): string[] {
    const entityTypes: string[] = [];
    if (content.includes('bank')) entityTypes.push('bank');
    if (content.includes('nbfc')) entityTypes.push('nbfc');
    if (content.includes('company') || content.includes('corporation')) entityTypes.push('company');
    if (content.includes('lsp') || content.includes('lending service provider')) entityTypes.push('lsp');
    return entityTypes;
  }

  private extractJurisdictions(content: string): string[] {
    const jurisdictions: string[] = [];
    if (content.includes('india') || content.includes('indian')) jurisdictions.push('india');
    return jurisdictions;
  }
}
