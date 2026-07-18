import { PromptDecorator as Prompt, Injectable } from '@nitrostack/core';
import { ComplianceRepository } from './compliance.repository.js';

@Injectable({ deps: [ComplianceRepository] })
export class CompliancePrompts {
  constructor(private readonly repo: ComplianceRepository) {}

  @Prompt({
    name: 'compliance_summary',
    description: 'Generate a compliance summary for a regulation',
    arguments: [
      { name: 'regulationId', description: 'Regulation ID', required: true },
      { name: 'companyId', description: 'Company profile ID', required: true },
    ]
  })
  async complianceSummary(args: { regulationId: string; companyId: string }) {
    const [company, obligations] = await Promise.all([
      this.repo.getCompanyProfile(args.companyId),
      this.repo.findObligations({ regulationId: args.regulationId }),
    ]);

    const companyName = company?.name || 'Unknown Company';
    const obligationList = obligations.obligations.map(o =>
      `- [${o.priority.toUpperCase()}] ${o.title} (${o.section.version.regulation.title} §${o.section.sectionNumber}) - Status: ${o.status}, Mandatory: ${o.mandatory}`
    ).join('\n');

    const deadlineSummary = obligations.obligations
      .flatMap(o => o.deadlines.map(d => ({ title: o.title, deadline: d })))
      .filter(d => d.deadline.description)
      .map(d => `- ${d.title}: ${d.deadline.description}`)
      .join('\n');

    return {
      messages: [
        {
          role: 'user',
          content: `Provide a compliance summary for ${companyName} regarding regulation ${obligations.obligations[0]?.section.version.regulation.title || args.regulationId}.

## Obligations (${obligations.total} total)
${obligationList || 'No obligations found.'}

## Key Deadlines
${deadlineSummary || 'No specific deadlines defined.'}

Analyze compliance posture, highlight gaps, and recommend priority actions.`
        }
      ]
    };
  }

  @Prompt({
    name: 'audit_checklist',
    description: 'Generate an audit checklist for a regulation',
    arguments: [
      { name: 'regulationId', description: 'Regulation ID', required: true },
    ]
  })
  async auditChecklist(args: { regulationId: string }) {
    const obligations = await this.repo.findObligations({ regulationId: args.regulationId });

    const checklist = obligations.obligations.map(o => {
      const section = `${o.section.version.regulation.title} §${o.section.sectionNumber}`;
      const deadlines = o.deadlines.map(d => d.description).filter(Boolean).join('; ');
      const reporting = o.reportingReqs.map(r => `${r.reportType} to ${r.authority}`).join('; ');

      return `### ${o.title}
- **Section:** ${section}
- **Priority:** ${o.priority.toUpperCase()}
- **Mandatory:** ${o.mandatory ? 'Yes' : 'No'}
- **Type:** ${o.obligationType || 'general'}
- **Status:** ${o.status}
${deadlines ? `- **Deadlines:** ${deadlines}` : ''}
${reporting ? `- **Reporting:** ${reporting}` : ''}
${o.citations.length > 0 ? `- **Source:** ${o.citations[0].sourceText}` : ''}`;
    }).join('\n\n');

    return {
      messages: [
        {
          role: 'user',
          content: `Generate a detailed audit checklist for the regulation: ${obligations.obligations[0]?.section.version.regulation.title || args.regulationId}.

## Obligations Checklist
${ checklist || 'No obligations defined.' }

Include verification steps, required documentation, and compliance evidence for each obligation.`
        }
      ]
    };
  }
}
