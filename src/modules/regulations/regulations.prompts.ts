import { PromptDecorator as Prompt, ExecutionContext, Injectable } from '@nitrostack/core';
import { RegulationsRepository } from './regulations.repository.js';

@Injectable({ deps: [RegulationsRepository] })
export class RegulationsPrompts {
  constructor(private readonly repository: RegulationsRepository) {}

  @Prompt({
    name: 'explain_regulation_prompt',
    description: 'Explain a specific regulation in plain language, covering its purpose, key obligations, and applicability.',
    arguments: [
      { name: 'regulationId', description: 'Regulation ID to explain', required: true },
    ]
  })
  async explainRegulation(args: { regulationId: string }, context?: ExecutionContext) {
    const regulation = await this.repository.getById(args.regulationId);

    if (!regulation) {
      return {
        messages: [
          { role: 'user', content: `Regulation ${args.regulationId} not found. Please provide a valid regulation ID.` }
        ]
      };
    }

    const versions = regulation.versions.length;
    const latestVersion = regulation.versions[0];

    return {
      messages: [
        {
          role: 'user',
          content: `Explain the following regulation in plain language:

Title: ${regulation.title}
Regulator: ${regulatorName(regulation.regulator.abbreviation)}
Document Type: ${regulation.documentType}
Status: ${regulation.status}
Issue Date: ${regulation.issueDate ? new Date(regulation.issueDate).toLocaleDateString() : 'N/A'}
Effective Date: ${regulation.effectiveDate ? new Date(regulation.effectiveDate).toLocaleDateString() : 'N/A'}
Versions: ${versions}
${latestVersion ? `Latest Version: ${latestVersion.versionNumber}` : ''}

Please provide:
1. What this regulation is about
2. Who it applies to
3. Key obligations and requirements
4. Important deadlines or timelines
5. Penalties for non-compliance (if any)
6. How to stay compliant`
        }
      ]
    };
  }
}

function regulatorName(abbr: string): string {
  const names: Record<string, string> = {
    'RBI': 'Reserve Bank of India',
    'SEBI': 'Securities and Exchange Board of India',
    'MCA': 'Ministry of Corporate Affairs',
    'CERT_IN': 'Indian Computer Emergency Response Team',
  };
  return names[abbr] || abbr;
}
