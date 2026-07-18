import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface ValidationSuite {
  name: string;
  script: string;
  description: string;
}

const validationSuites: ValidationSuite[] = [
  {
    name: 'Comprehensive Seed',
    script: 'src/validation/comprehensive-seed.ts',
    description: 'Seed 28 regulations, 15 companies, 200+ obligations',
  },
  {
    name: 'MCP Tool Validation',
    script: 'src/validation/tool-validation.ts',
    description: 'Test all 27 MCP tools with 100+ test cases',
  },
  {
    name: 'Conversational Validation',
    script: 'src/validation/conversational-validation.ts',
    description: 'Test 50+ natural language prompts',
  },
  {
    name: 'Widget Validation',
    script: 'src/validation/widget-validation.ts',
    description: 'Test all 4 widgets with 5 test types each',
  },
  {
    name: 'Edge Case Validation',
    script: 'src/validation/edge-case-validation.ts',
    description: 'Test 20+ edge cases and boundary conditions',
  },
  {
    name: 'Scale Validation',
    script: 'src/validation/scale-validation.ts',
    description: 'Test performance with large datasets',
  },
  {
    name: 'Provider Validation',
    script: 'src/validation/provider-validation.ts',
    description: 'Test 4 providers × 3 states',
  },
];

async function runValidation() {
  console.log('🚀 RegPilot Nexus - Comprehensive Validation Runner');
  console.log('='.repeat(60));
  console.log(`Starting ${validationSuites.length} validation suites...`);
  console.log('');

  const results: { name: string; status: string; duration: number; output: string }[] = [];
  const startTime = Date.now();

  for (const suite of validationSuites) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Running: ${suite.name}`);
    console.log(`   ${suite.description}`);
    console.log(`${'='.repeat(60)}`);

    const suiteStart = Date.now();
    try {
      const output = execSync(`npx tsx ${suite.script}`, {
        encoding: 'utf-8',
        timeout: 300000, // 5 minute timeout
        cwd: '/home/yedhu/regpilot-nexus',
      });
      
      const duration = Date.now() - suiteStart;
      console.log(output);
      results.push({ name: suite.name, status: 'PASS', duration, output });
    } catch (error: any) {
      const duration = Date.now() - suiteStart;
      const output = error.stdout || error.message || String(error);
      console.log(output);
      results.push({ name: suite.name, status: 'FAIL', duration, output });
    }
  }

  // Final Summary
  const totalDuration = Date.now() - startTime;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log('\n' + '='.repeat(60));
  console.log('🎯 FINAL VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${results.length}`);
  console.log(`⏱️  Duration: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log('='.repeat(60));

  // Detailed results
  console.log('\n📋 DETAILED RESULTS:');
  for (const result of results) {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${(result.duration / 1000).toFixed(1)}s`);
  }

  // Generate report
  const report = generateReport(results, totalDuration);
  fs.writeFileSync('/home/yedhu/regpilot-nexus/validation-report-full.md', report);
  console.log('\n📄 Full report saved to validation-report-full.md');

  return { passed, failed, total: results.length, duration: totalDuration };
}

function generateReport(results: { name: string; status: string; duration: number }[], totalDuration: number): string {
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  let report = `# RegPilot Nexus - Comprehensive Validation Report

## Executive Summary

| Metric | Value |
|---|---|
| **Total Suites** | ${results.length} |
| **Passed** | ${passed} |
| **Failed** | ${failed} |
| **Pass Rate** | ${((passed / results.length) * 100).toFixed(1)}% |
| **Total Duration** | ${(totalDuration / 1000).toFixed(1)}s |

## Validation Suites

| Suite | Status | Duration |
|---|---|---|
`;

  for (const result of results) {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    report += `| ${result.name} | ${icon} ${result.status} | ${(result.duration / 1000).toFixed(1)}s |\n`;
  }

  report += `
## Weaknesses Discovered

`;

  if (failed > 0) {
    report += `### Failed Suites\n`;
    for (const result of results.filter(r => r.status === 'FAIL')) {
      report += `- **${result.name}**: Requires investigation\n`;
    }
  } else {
    report += `No weaknesses discovered during this validation run.\n`;
  }

  report += `
## Recommendations

1. Run validation regularly during development
2. Address any failed tests before NitroStudio integration
3. Scale validation should be run with production-sized datasets
4. Provider validation should be tested with actual API keys
5. Widget validation should include manual UI testing in NitroStudio

## Next Steps

1. Review and address any failed tests
2. Proceed to NitroStudio interactive testing
3. Conduct final validation report

---

*Report generated: ${new Date().toISOString()}*
`;

  return report;
}

runValidation()
  .then((summary) => {
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
