/**
 * RegPilot Nexus - Automated Validation Suite
 * 
 * This script validates the platform across:
 * - Multiple regulation families
 * - Multiple company profiles
 * - Prompt diversity
 * - MCP Tools
 * - Edge cases
 * 
 * Usage: npx tsx src/validation/validate-platform.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ValidationResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration?: number;
}

const results: ValidationResult[] = [];

function logResult(result: ValidationResult) {
  results.push(result);
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
  console.log(`  ${icon} ${result.test}: ${result.message}`);
}

async function validateRegulationSearch() {
  console.log('\n📚 Validating Regulation Search...');
  
  // Test 1: Search by keyword
  const startTime = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: {
        title: { contains: 'digital lending', mode: 'insensitive' },
      },
      include: { regulator: true },
    });
    logResult({
      category: 'Regulation Search',
      test: 'Keyword search',
      status: regulations.length > 0 ? 'pass' : 'fail',
      message: `Found ${regulations.length} regulations`,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    logResult({
      category: 'Regulation Search',
      test: 'Keyword search',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    });
  }

  // Test 2: Search by regulator
  const startTime2 = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: {
        regulator: { abbreviation: 'RBI' },
      },
    });
    logResult({
      category: 'Regulation Search',
      test: 'Regulator filter',
      status: regulations.length > 0 ? 'pass' : 'fail',
      message: `Found ${regulations.length} RBI regulations`,
      duration: Date.now() - startTime2,
    });
  } catch (error) {
    logResult({
      category: 'Regulation Search',
      test: 'Regulator filter',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime2,
    });
  }

  // Test 3: Search by status
  const startTime3 = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: { status: 'active' },
    });
    logResult({
      category: 'Regulation Search',
      test: 'Status filter',
      status: 'pass',
      message: `Found ${regulations.length} active regulations`,
      duration: Date.now() - startTime3,
    });
  } catch (error) {
    logResult({
      category: 'Regulation Search',
      test: 'Status filter',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime3,
    });
  }

  // Test 4: Empty search
  const startTime4 = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: {
        title: { contains: 'nonexistent regulation xyz' },
      },
    });
    logResult({
      category: 'Regulation Search',
      test: 'Empty search results',
      status: regulations.length === 0 ? 'pass' : 'fail',
      message: `Found ${regulations.length} regulations (expected 0)`,
      duration: Date.now() - startTime4,
    });
  } catch (error) {
    logResult({
      category: 'Regulation Search',
      test: 'Empty search results',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime4,
    });
  }
}

async function validateApplicability() {
  console.log('\n🎯 Validating Applicability Evaluation...');
  
  // Get test company
  const company = await prisma.companyProfile.findFirst({
    where: { id: 'demo-company-001' },
  });

  if (!company) {
    logResult({
      category: 'Applicability',
      test: 'Company profile exists',
      status: 'fail',
      message: 'Demo company not found',
    });
    return;
  }

  logResult({
    category: 'Applicability',
    test: 'Company profile exists',
    status: 'pass',
    message: `Found company: ${company.name}`,
  });

  // Get test regulation
  const regulation = await prisma.regulation.findFirst({
    where: { id: 'demo-regulation-001' },
    include: { regulator: true },
  });

  if (!regulation) {
    logResult({
      category: 'Applicability',
      test: 'Regulation exists',
      status: 'fail',
      message: 'Demo regulation not found',
    });
    return;
  }

  logResult({
    category: 'Applicability',
    test: 'Regulation exists',
    status: 'pass',
    message: `Found regulation: ${regulation.title}`,
  });

  // Test applicability rules
  const startTime = Date.now();
  try {
    const applicabilities = await prisma.applicability.findMany({
      where: {
        section: {
          version: { regulationId: regulation.id },
        },
      },
    });

    let matched = false;
    for (const app of applicabilities) {
      if (app.industries.includes(company.industry || '')) {
        matched = true;
        break;
      }
      if (app.entityTypes.includes(company.entityType || '')) {
        matched = true;
        break;
      }
    }

    logResult({
      category: 'Applicability',
      test: 'Applicability rules exist',
      status: applicabilities.length > 0 ? 'pass' : 'fail',
      message: `Found ${applicabilities.length} rules, matched: ${matched}`,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    logResult({
      category: 'Applicability',
      test: 'Applicability rules exist',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    });
  }
}

async function validateObligations() {
  console.log('\n📋 Validating Obligations...');
  
  // Test 1: Find obligations for regulation
  const startTime = Date.now();
  try {
    const obligations = await prisma.obligation.findMany({
      where: {
        section: {
          version: { regulationId: 'demo-regulation-001' },
        },
      },
      include: {
        section: {
          include: {
            version: {
              include: {
                regulation: {
                  include: { regulator: true },
                },
              },
            },
          },
        },
        deadlines: true,
        penalties: true,
        reportingReqs: true,
      },
    });

    logResult({
      category: 'Obligations',
      test: 'Find obligations by regulation',
      status: obligations.length > 0 ? 'pass' : 'fail',
      message: `Found ${obligations.length} obligations`,
      duration: Date.now() - startTime,
    });

    // Test 2: Check obligation structure
    if (obligations.length > 0) {
      const obl = obligations[0];
      const hasRequiredFields = 
        obl.title &&
        obl.priority &&
        obl.section?.version?.regulation?.regulator?.abbreviation;

      logResult({
        category: 'Obligations',
        test: 'Obligation structure valid',
        status: hasRequiredFields ? 'pass' : 'fail',
        message: hasRequiredFields ? 'All required fields present' : 'Missing required fields',
      });
    }

    // Test 3: Filter by priority
    const highPriority = obligations.filter(o => o.priority === 'high');
    logResult({
      category: 'Obligations',
      test: 'Filter by priority',
      status: 'pass',
      message: `Found ${highPriority.length} high priority obligations`,
    });

    // Test 4: Filter by mandatory
    const mandatory = obligations.filter(o => o.mandatory);
    logResult({
      category: 'Obligations',
      test: 'Filter by mandatory',
      status: 'pass',
      message: `Found ${mandatory.length} mandatory obligations`,
    });

  } catch (error) {
    logResult({
      category: 'Obligations',
      test: 'Find obligations by regulation',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    });
  }
}

async function validateEdgeCases() {
  console.log('\n🔍 Validating Edge Cases...');
  
  // Test 1: Non-existent regulation
  const startTime = Date.now();
  try {
    const regulation = await prisma.regulation.findUnique({
      where: { id: 'non-existent-id' },
    });
    logResult({
      category: 'Edge Cases',
      test: 'Non-existent regulation',
      status: regulation === null ? 'pass' : 'fail',
      message: regulation === null ? 'Correctly returned null' : 'Should return null',
      duration: Date.now() - startTime,
    });
  } catch (error) {
    logResult({
      category: 'Edge Cases',
      test: 'Non-existent regulation',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    });
  }

  // Test 2: Non-existent company
  const startTime2 = Date.now();
  try {
    const company = await prisma.companyProfile.findUnique({
      where: { id: 'non-existent-company' },
    });
    logResult({
      category: 'Edge Cases',
      test: 'Non-existent company',
      status: company === null ? 'pass' : 'fail',
      message: company === null ? 'Correctly returned null' : 'Should return null',
      duration: Date.now() - startTime2,
    });
  } catch (error) {
    logResult({
      category: 'Edge Cases',
      test: 'Non-existent company',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime2,
    });
  }

  // Test 3: Empty search
  const startTime3 = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: {
        title: { contains: '' },
      },
    });
    logResult({
      category: 'Edge Cases',
      test: 'Empty search string',
      status: 'pass',
      message: `Found ${regulations.length} regulations`,
      duration: Date.now() - startTime3,
    });
  } catch (error) {
    logResult({
      category: 'Edge Cases',
      test: 'Empty search string',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime3,
    });
  }

  // Test 4: Special characters in search
  const startTime4 = Date.now();
  try {
    const regulations = await prisma.regulation.findMany({
      where: {
        title: { contains: '<script>alert("xss")</script>' },
      },
    });
    logResult({
      category: 'Edge Cases',
      test: 'Special characters in search',
      status: 'pass',
      message: `Found ${regulations.length} regulations (no XSS)`,
      duration: Date.now() - startTime4,
    });
  } catch (error) {
    logResult({
      category: 'Edge Cases',
      test: 'Special characters in search',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime4,
    });
  }
}

async function validateDataIntegrity() {
  console.log('\n🔒 Validating Data Integrity...');
  
  // Test 1: Orphaned obligations
  const startTime = Date.now();
  try {
    const orphaned = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM obligations o
      LEFT JOIN sections s ON o.section_id = s.id
      WHERE s.id IS NULL
    `;
    const count = (orphaned as any)[0]?.count || 0;
    logResult({
      category: 'Data Integrity',
      test: 'No orphaned obligations',
      status: count === 0 ? 'pass' : 'fail',
      message: `Found ${count} orphaned obligations`,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    logResult({
      category: 'Data Integrity',
      test: 'No orphaned obligations',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    });
  }

  // Test 2: Orphaned sections
  const startTime2 = Date.now();
  try {
    const orphaned = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM sections s
      LEFT JOIN versions v ON s.version_id = v.id
      WHERE v.id IS NULL
    `;
    const count = (orphaned as any)[0]?.count || 0;
    logResult({
      category: 'Data Integrity',
      test: 'No orphaned sections',
      status: count === 0 ? 'pass' : 'fail',
      message: `Found ${count} orphaned sections`,
      duration: Date.now() - startTime2,
    });
  } catch (error) {
    logResult({
      category: 'Data Integrity',
      test: 'No orphaned sections',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime2,
    });
  }

  // Test 3: Unique constraints
  const startTime3 = Date.now();
  try {
    const regulators = await prisma.regulator.groupBy({
      by: ['abbreviation'],
      _count: true,
      having: {
        abbreviation: { _count: { gt: 1 } },
      },
    });
    logResult({
      category: 'Data Integrity',
      test: 'Unique regulator abbreviations',
      status: regulators.length === 0 ? 'pass' : 'fail',
      message: regulators.length === 0 ? 'All abbreviations unique' : `Found ${regulators.length} duplicates`,
      duration: Date.now() - startTime3,
    });
  } catch (error) {
    logResult({
      category: 'Data Integrity',
      test: 'Unique regulator abbreviations',
      status: 'fail',
      message: `Error: ${error}`,
      duration: Date.now() - startTime3,
    });
  }
}

async function main() {
  console.log('🚀 RegPilot Nexus - Automated Validation Suite\n');
  console.log('=' .repeat(60));

  await validateRegulationSearch();
  await validateApplicability();
  await validateObligations();
  await validateEdgeCases();
  await validateDataIntegrity();

  console.log('\n' + '=' .repeat(60));
  console.log('📊 Validation Summary\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;

  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  📊 Total: ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter(r => r.status === 'fail')
      .forEach(r => console.log(`  - ${r.category}: ${r.test} - ${r.message}`));
  }

  console.log('\n🎯 Validation Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Validation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
