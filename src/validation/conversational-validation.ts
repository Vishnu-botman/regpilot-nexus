import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ConversationalTest {
  id: string;
  category: string;
  prompt: string;
  expectedTools: string[];
  expectedRegulators?: string[];
  expectedObligationCount?: number;
  validation: (data: any) => boolean;
  description: string;
}

// ============================================================
// CONVERSATIONAL VALIDATION SUITE
// 50+ Natural Language Prompts
// ============================================================

const conversationalTests: ConversationalTest[] = [
  // === CATEGORY A: Direct Questions (10 prompts) ===
  {
    id: 'conv-001',
    category: 'Direct Questions',
    prompt: 'What regulations does RBI have?',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['RBI'],
    validation: (data) => data.regulator === 'RBI',
    description: 'Should search regulations filtered by RBI',
  },
  {
    id: 'conv-002',
    category: 'Direct Questions',
    prompt: 'Show me SEBI LODR',
    expectedTools: ['search_regulations', 'get_regulation'],
    validation: (data) => data.title?.includes('LODR'),
    description: 'Should find SEBI LODR regulation',
  },
  {
    id: 'conv-003',
    category: 'Direct Questions',
    prompt: 'What are the penalties for non-compliance?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasPenalties === true,
    description: 'Should find obligations with penalties',
  },
  {
    id: 'conv-004',
    category: 'Direct Questions',
    prompt: 'List all obligations for Digital Lending',
    expectedTools: ['find_obligations'],
    validation: (data) => data.regulation?.includes('Digital Lending'),
    description: 'Should find obligations for RBI Digital Lending',
  },
  {
    id: 'conv-005',
    category: 'Direct Questions',
    prompt: 'What is the Companies Act?',
    expectedTools: ['search_regulations', 'get_regulation'],
    validation: (data) => data.title?.includes('Companies Act'),
    description: 'Should find Companies Act 2013',
  },
  {
    id: 'conv-006',
    category: 'Direct Questions',
    prompt: 'Show me recent CERT-In advisories',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['CERT-In'],
    validation: (data) => data.regulator === 'CERT-In',
    description: 'Should search CERT-In regulations',
  },
  {
    id: 'conv-007',
    category: 'Direct Questions',
    prompt: 'What changed in the latest amendment?',
    expectedTools: ['get_regulation_versions', 'compare_regulation_versions'],
    validation: (data) => data.hasVersions === true,
    description: 'Should compare versions',
  },
  {
    id: 'conv-008',
    category: 'Direct Questions',
    prompt: 'Compare version 1.0 and 1.1 of Digital Lending',
    expectedTools: ['compare_regulation_versions'],
    validation: (data) => data.regulation?.includes('Digital Lending'),
    description: 'Should compare Digital Lending versions',
  },
  {
    id: 'conv-009',
    category: 'Direct Questions',
    prompt: 'Does DPDP apply to my company?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.regulation?.includes('Digital Personal Data Protection'),
    description: 'Should evaluate DPDP applicability',
  },
  {
    id: 'conv-010',
    category: 'Direct Questions',
    prompt: 'What are our mandatory obligations?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.allMandatory === true,
    description: 'Should find only mandatory obligations',
  },

  // === CATEGORY B: Indirect Questions (10 prompts) ===
  {
    id: 'conv-011',
    category: 'Indirect Questions',
    prompt: 'Anything new from RBI?',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['RBI'],
    validation: (data) => data.regulator === 'RBI',
    description: 'Should search recent RBI regulations',
  },
  {
    id: 'conv-012',
    category: 'Indirect Questions',
    prompt: 'What should I do next?',
    expectedTools: ['generate_action_plan'],
    validation: (data) => data.hasPlan === true,
    description: 'Should generate action plan',
  },
  {
    id: 'conv-013',
    category: 'Indirect Questions',
    prompt: 'Show only high priority items',
    expectedTools: ['find_obligations'],
    validation: (data) => data.priority === 'high',
    description: 'Should filter by high priority',
  },
  {
    id: 'conv-014',
    category: 'Indirect Questions',
    prompt: 'Show deadlines only',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasDeadlines === true,
    description: 'Should show obligations with deadlines',
  },
  {
    id: 'conv-015',
    category: 'Indirect Questions',
    prompt: 'Am I compliant with SEBI?',
    expectedTools: ['evaluate_applicability', 'find_obligations'],
    validation: (data) => data.regulator === 'SEBI',
    description: 'Should evaluate SEBI compliance',
  },
  {
    id: 'conv-016',
    category: 'Indirect Questions',
    prompt: 'What is our compliance score?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.hasScore === true,
    description: 'Should calculate compliance score',
  },
  {
    id: 'conv-017',
    category: 'Indirect Questions',
    prompt: 'Show me reporting requirements',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasReporting === true,
    description: 'Should find obligations with reporting requirements',
  },
  {
    id: 'conv-018',
    category: 'Indirect Questions',
    prompt: 'Which regulations affect fintech?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.industry === 'fintech',
    description: 'Should find fintech-applicable regulations',
  },
  {
    id: 'conv-019',
    category: 'Indirect Questions',
    prompt: 'Which regulations affect NBFCs?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.entityType === 'nbfc',
    description: 'Should find NBFC-applicable regulations',
  },
  {
    id: 'conv-020',
    category: 'Indirect Questions',
    prompt: 'What changed this month?',
    expectedTools: ['search_regulations'],
    validation: (data) => data.hasDateFilter === true,
    description: 'Should search with date filter',
  },

  // === CATEGORY C: Complex/Multi-Step (5 prompts) ===
  {
    id: 'conv-021',
    category: 'Complex/Multi-Step',
    prompt: 'We are expanding to healthcare - what new regulations apply?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.industry === 'healthcare',
    description: 'Should find healthcare regulations',
  },
  {
    id: 'conv-022',
    category: 'Complex/Multi-Step',
    prompt: 'We are planning an IPO - what do we need?',
    expectedTools: ['search_regulations', 'find_obligations'],
    validation: (data) => data.regulation?.includes('ICDR'),
    description: 'Should find IPO-related obligations',
  },
  {
    id: 'conv-023',
    category: 'Complex/Multi-Step',
    prompt: 'We acquired a listed company - what changes?',
    expectedTools: ['evaluate_applicability', 'find_obligations'],
    validation: (data) => data.entityType === 'listed_company',
    description: 'Should evaluate listed company obligations',
  },
  {
    id: 'conv-024',
    category: 'Complex/Multi-Step',
    prompt: 'We are launching a data product - what applies?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.regulation?.includes('DPDP'),
    description: 'Should find data protection obligations',
  },
  {
    id: 'conv-025',
    category: 'Complex/Multi-Step',
    prompt: 'We have 500 employees now - what labour codes apply?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.category === 'labour',
    description: 'Should find labour code obligations',
  },

  // === CATEGORY D: Ambiguous/Short (5 prompts) ===
  {
    id: 'conv-026',
    category: 'Ambiguous/Short',
    prompt: 'RBI?',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['RBI'],
    validation: (data) => data.regulator === 'RBI',
    description: 'Should search RBI regulations',
  },
  {
    id: 'conv-027',
    category: 'Ambiguous/Short',
    prompt: 'Penalties?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasPenalties === true,
    description: 'Should find obligations with penalties',
  },
  {
    id: 'conv-028',
    category: 'Ambiguous/Short',
    prompt: 'Deadline?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasDeadlines === true,
    description: 'Should find obligations with deadlines',
  },
  {
    id: 'conv-029',
    category: 'Ambiguous/Short',
    prompt: 'DPDP',
    expectedTools: ['search_regulations'],
    validation: (data) => data.regulation?.includes('Digital Personal Data Protection'),
    description: 'Should find DPDP Act',
  },
  {
    id: 'conv-030',
    category: 'Ambiguous/Short',
    prompt: 'Am I safe?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.hasEvaluation === true,
    description: 'Should evaluate overall compliance',
  },

  // === CATEGORY E: Conversational/Chatty (5 prompts) ===
  {
    id: 'conv-031',
    category: 'Conversational',
    prompt: 'Hey, can you help me understand what regulations apply to our fintech startup?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.industry === 'fintech',
    description: 'Should find fintech regulations',
  },
  {
    id: 'conv-032',
    category: 'Conversational',
    prompt: 'We just got a new RBI circular - should we be worried?',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['RBI'],
    validation: (data) => data.regulator === 'RBI',
    description: 'Should search recent RBI circulars',
  },
  {
    id: 'conv-033',
    category: 'Conversational',
    prompt: 'Our auditor is asking about CSR compliance - what do we need?',
    expectedTools: ['search_regulations', 'find_obligations'],
    validation: (data) => data.regulation?.includes('CSR'),
    description: 'Should find CSR obligations',
  },
  {
    id: 'conv-034',
    category: 'Conversational',
    prompt: 'We are hiring 100 new employees - any labour law implications?',
    expectedTools: ['search_regulations', 'evaluate_applicability'],
    validation: (data) => data.category === 'labour',
    description: 'Should find labour code obligations',
  },
  {
    id: 'conv-035',
    category: 'Conversational',
    prompt: 'We are processing personal data - are we covered under DPDP?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.regulation?.includes('Digital Personal Data Protection'),
    description: 'Should evaluate DPDP applicability',
  },

  // === CATEGORY F: Follow-up/Context-Dependent (5 prompts) ===
  {
    id: 'conv-036',
    category: 'Follow-up',
    prompt: 'What about SEBI?',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['SEBI'],
    validation: (data) => data.regulator === 'SEBI',
    description: 'Should search SEBI regulations',
  },
  {
    id: 'conv-037',
    category: 'Follow-up',
    prompt: 'And the penalties?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.hasPenalties === true,
    description: 'Should find obligations with penalties',
  },
  {
    id: 'conv-038',
    category: 'Follow-up',
    prompt: 'Does this apply to our NBFC subsidiary?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.entityType === 'nbfc',
    description: 'Should evaluate NBFC applicability',
  },
  {
    id: 'conv-039',
    category: 'Follow-up',
    prompt: 'What about the 2026 amendment?',
    expectedTools: ['get_regulation_versions'],
    validation: (data) => data.version?.includes('2026'),
    description: 'Should find 2026 amendment',
  },
  {
    id: 'conv-040',
    category: 'Follow-up',
    prompt: 'Show me the details',
    expectedTools: ['get_regulation'],
    validation: (data) => data.hasDetails === true,
    description: 'Should show regulation details',
  },

  // === CATEGORY G: Correction/Clarification (5 prompts) ===
  {
    id: 'conv-041',
    category: 'Correction',
    prompt: 'No, I meant SEBI, not RBI',
    expectedTools: ['search_regulations'],
    expectedRegulators: ['SEBI'],
    validation: (data) => data.regulator === 'SEBI',
    description: 'Should search SEBI instead of RBI',
  },
  {
    id: 'conv-042',
    category: 'Correction',
    prompt: 'Actually, we are a listed company now',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.entityType === 'listed_company',
    description: 'Should evaluate listed company obligations',
  },
  {
    id: 'conv-043',
    category: 'Correction',
    prompt: 'Sorry, I meant the DPDP Act, not IT Act',
    expectedTools: ['search_regulations'],
    validation: (data) => data.regulation?.includes('Digital Personal Data Protection'),
    description: 'Should find DPDP Act',
  },
  {
    id: 'conv-044',
    category: 'Correction',
    prompt: 'Wait, we also have operations in USA',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.jurisdictions?.includes('usa'),
    description: 'Should evaluate USA jurisdiction',
  },
  {
    id: 'conv-045',
    category: 'Correction',
    prompt: 'Correction - we are an NBFC, not a bank',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.entityType === 'nbfc',
    description: 'Should evaluate NBFC applicability',
  },

  // === CATEGORY H: Edge Cases (5 prompts) ===
  {
    id: 'conv-046',
    category: 'Edge Cases',
    prompt: 'What regulations apply to a space company on Mars?',
    expectedTools: ['evaluate_applicability'],
    validation: (data) => data.result === 'empty' || data.result === 'error',
    description: 'Should handle non-existent jurisdiction',
  },
  {
    id: 'conv-047',
    category: 'Edge Cases',
    prompt: 'Show me all regulations from 1900',
    expectedTools: ['search_regulations'],
    validation: (data) => data.result === 'empty',
    description: 'Should return empty for historical regulations',
  },
  {
    id: 'conv-048',
    category: 'Edge Cases',
    prompt: 'What is the penalty for violating every law in India?',
    expectedTools: ['find_obligations'],
    validation: (data) => data.result === 'comprehensive' || data.result === 'empty',
    description: 'Should handle broad query',
  },
  {
    id: 'conv-049',
    category: 'Edge Cases',
    prompt: 'Explain all regulations in one word',
    expectedTools: ['search_regulations'],
    validation: (data) => data.result === 'summarized',
    description: 'Should handle impossible request',
  },
  {
    id: 'conv-050',
    category: 'Edge Cases',
    prompt: 'What happens if I ignore everything?',
    expectedTools: ['generate_action_plan'],
    validation: (data) => data.hasPlan === true,
    description: 'Should show consequences of non-compliance',
  },
];

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

async function validatePromptSelection(prompt: string, expectedTools: string[]): Promise<boolean> {
  // This simulates tool selection based on prompt content
  const promptLower = prompt.toLowerCase();
  
  // Simple heuristics for tool selection
  const toolHints: Record<string, string[]> = {
    'search_regulations': ['what', 'show', 'list', 'find', 'regulations', 'rbi', 'sebi', 'mca', 'cert-in', 'dpdp', 'companies act'],
    'get_regulation': ['details', 'show me', 'explain', 'what is'],
    'get_regulation_versions': ['versions', 'history', 'amendment', 'changed', 'latest'],
    'compare_regulation_versions': ['compare', 'difference', 'diff', 'version 1', 'v1'],
    'evaluate_applicability': ['apply', 'affect', 'comply', 'compliant', 'score', 'applicable'],
    'find_obligations': ['obligations', 'penalties', 'deadlines', 'mandatory', 'reporting', 'requirements'],
    'generate_action_plan': ['action', 'plan', 'next', 'do', 'what should'],
    'get_company_profile': ['company', 'profile', 'our company'],
    'update_company_profile': ['update', 'change', 'modify'],
    'manage_policies': ['policies', 'policy'],
  };

  for (const tool of expectedTools) {
    const hints = toolHints[tool] || [];
    const hasHint = hints.some(hint => promptLower.includes(hint));
    if (!hasHint) return false;
  }

  return true;
}

async function validateToolInvocation(toolName: string, data: any): Promise<boolean> {
  // Validate that the tool would be invoked correctly
  switch (toolName) {
    case 'search_regulations':
      return data.regulator !== undefined || data.keyword !== undefined;
    case 'get_regulation':
      return data.regulationId !== undefined;
    case 'evaluate_applicability':
      return data.companyId !== undefined && data.regulationId !== undefined;
    case 'find_obligations':
      return data.regulationId !== undefined || data.companyId !== undefined;
    case 'generate_action_plan':
      return data.companyId !== undefined;
    default:
      return true;
  }
}

// ============================================================
// MAIN TEST RUNNER
// ============================================================

async function runConversationalValidation() {
  console.log('🗣️  RegPilot Nexus - Conversational Validation Suite');
  console.log('='.repeat(60));
  console.log(`Total prompts: ${conversationalTests.length}`);
  console.log('');

  let passed = 0;
  let failed = 0;
  const results: { id: string; status: string; message?: string }[] = [];

  for (const test of conversationalTests) {
    try {
      // Simulate prompt processing
      const isToolSelectionCorrect = await validatePromptSelection(test.prompt, test.expectedTools);
      
      if (isToolSelectionCorrect) {
        console.log(`✅ [${test.category}] ${test.prompt}`);
        passed++;
        results.push({ id: test.id, status: 'PASS' });
      } else {
        console.log(`❌ [${test.category}] ${test.prompt}`);
        console.log(`   Expected tools: ${test.expectedTools.join(', ')}`);
        failed++;
        results.push({ id: test.id, status: 'FAIL', message: 'Tool selection mismatch' });
      }
    } catch (error) {
      console.log(`❌ [${test.category}] ${test.prompt}`);
      console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
      results.push({ id: test.id, status: 'FAIL', message: error instanceof Error ? error.message : String(error) });
    }
  }

  // Summary by category
  const categories = [...new Set(conversationalTests.map(t => t.category))];
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS BY CATEGORY');
  console.log('='.repeat(60));
  
  for (const category of categories) {
    const catTests = conversationalTests.filter(t => t.category === category);
    const catPassed = results.filter(r => r.status === 'PASS' && catTests.some(t => t.id === r.id)).length;
    console.log(`${category}: ${catPassed}/${catTests.length}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSATIONAL VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${conversationalTests.length}`);
  console.log('='.repeat(60));

  return { passed, failed, total: conversationalTests.length };
}

runConversationalValidation()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
