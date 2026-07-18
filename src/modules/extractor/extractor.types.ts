import { ParsedSection } from '../parser/parser.types.js';

export interface ExtractedObligation {
  title: string;
  description: string;
  obligationType: string;
  priority: 'high' | 'medium' | 'low';
  mandatory: boolean;
  frequency?: string;
  sectionNumber: string;
}

export interface ExtractedDeadline {
  obligationTitle: string;
  deadlineType: string;
  dueCondition?: string;
  description: string;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
}

export interface ExtractedPenalty {
  sectionNumber: string;
  description: string;
  penaltyType: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ExtractedReportingRequirement {
  obligationTitle: string;
  authority: string;
  reportType: string;
  frequency: string;
  submissionMethod?: string;
}

export interface ExtractedApplicability {
  sectionNumber: string;
  description: string;
  operator: 'includes' | 'excludes';
  industries: string[];
  entityTypes: string[];
  jurisdictions: string[];
}

export interface ExtractionResult {
  obligations: ExtractedObligation[];
  deadlines: ExtractedDeadline[];
  penalties: ExtractedPenalty[];
  reportingRequirements: ExtractedReportingRequirement[];
  applicabilities: ExtractedApplicability[];
}

export interface ExtractionConfig {
  defaultPriority: 'high' | 'medium' | 'low';
  defaultMandatory: boolean;
  detectObligations: boolean;
  detectDeadlines: boolean;
  detectPenalties: boolean;
  detectReporting: boolean;
  detectApplicability: boolean;
}

export const DEFAULT_EXTRACTION_CONFIG: ExtractionConfig = {
  defaultPriority: 'medium',
  defaultMandatory: true,
  detectObligations: true,
  detectDeadlines: true,
  detectPenalties: true,
  detectReporting: true,
  detectApplicability: true,
};
