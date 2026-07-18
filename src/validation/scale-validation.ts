import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ScaleTest {
  id: string;
  category: string;
  description: string;
  metric: string;
  target: number;
  actual?: number;
  passed: boolean;
  duration?: number;
}

// ============================================================
// SCALE VALIDATION SUITE
// Performance & Scale Testing
// ============================================================

async function runScaleValidation() {
  console.log('📊 RegPilot Nexus - Scale Validation Suite');
  console.log('='.repeat(60));

  const results: ScaleTest[] = [];

  // === Dataset Counts ===
  console.log('\n📋 Dataset Counts:');

  const regCount = await prisma.regulation.count();
  results.push({
    id: 'scale-001',
    category: 'Dataset',
    description: 'Total regulations',
    metric: 'count',
    target: 25,
    actual: regCount,
    passed: regCount >= 25,
  });
  console.log(`  Regulations: ${regCount} (target: 25+) ${regCount >= 25 ? '✅' : '❌'}`);

  const verCount = await prisma.version.count();
  results.push({
    id: 'scale-002',
    category: 'Dataset',
    description: 'Total versions',
    metric: 'count',
    target: 30,
    actual: verCount,
    passed: verCount >= 30,
  });
  console.log(`  Versions: ${verCount} (target: 30+) ${verCount >= 30 ? '✅' : '❌'}`);

  const secCount = await prisma.section.count();
  results.push({
    id: 'scale-003',
    category: 'Dataset',
    description: 'Total sections',
    metric: 'count',
    target: 25,
    actual: secCount,
    passed: secCount >= 25,
  });
  console.log(`  Sections: ${secCount} (target: 25+) ${secCount >= 25 ? '✅' : '❌'}`);

  const oblCount = await prisma.obligation.count();
  results.push({
    id: 'scale-004',
    category: 'Dataset',
    description: 'Total obligations',
    metric: 'count',
    target: 15,
    actual: oblCount,
    passed: oblCount >= 15,
  });
  console.log(`  Obligations: ${oblCount} (target: 15+) ${oblCount >= 15 ? '✅' : '❌'}`);

  const appCount = await prisma.applicability.count();
  results.push({
    id: 'scale-005',
    category: 'Dataset',
    description: 'Total applicability rules',
    metric: 'count',
    target: 10,
    actual: appCount,
    passed: appCount >= 10,
  });
  console.log(`  Applicability Rules: ${appCount} (target: 10+) ${appCount >= 10 ? '✅' : '❌'}`);

  const dlCount = await prisma.deadline.count();
  results.push({
    id: 'scale-006',
    category: 'Dataset',
    description: 'Total deadlines',
    metric: 'count',
    target: 5,
    actual: dlCount,
    passed: dlCount >= 5,
  });
  console.log(`  Deadlines: ${dlCount} (target: 5+) ${dlCount >= 5 ? '✅' : '❌'}`);

  const penCount = await prisma.penalty.count();
  results.push({
    id: 'scale-007',
    category: 'Dataset',
    description: 'Total penalties',
    metric: 'count',
    target: 5,
    actual: penCount,
    passed: penCount >= 5,
  });
  console.log(`  Penalties: ${penCount} (target: 5+) ${penCount >= 5 ? '✅' : '❌'}`);

  const compCount = await prisma.companyProfile.count();
  results.push({
    id: 'scale-008',
    category: 'Dataset',
    description: 'Total company profiles',
    metric: 'count',
    target: 15,
    actual: compCount,
    passed: compCount >= 15,
  });
  console.log(`  Company Profiles: ${compCount} (target: 15+) ${compCount >= 15 ? '✅' : '❌'}`);

  // === Performance Tests ===
  console.log('\n⏱️  Performance Tests:');

  // Search performance
  const searchStart = Date.now();
  await prisma.regulation.findMany({
    where: { status: 'active' },
    include: { regulator: true, versions: true },
  });
  const searchDuration = Date.now() - searchStart;
  results.push({
    id: 'scale-009',
    category: 'Performance',
    description: 'Regulation search',
    metric: 'ms',
    target: 1000,
    actual: searchDuration,
    passed: searchDuration < 1000,
    duration: searchDuration,
  });
  console.log(`  Regulation search: ${searchDuration}ms (target: <1000ms) ${searchDuration < 1000 ? '✅' : '❌'}`);

  // Obligation query performance
  const oblStart = Date.now();
  await prisma.obligation.findMany({
    include: { section: true, deadlines: true, penalties: true },
  });
  const oblDuration = Date.now() - oblStart;
  results.push({
    id: 'scale-010',
    category: 'Performance',
    description: 'Obligation query',
    metric: 'ms',
    target: 2000,
    actual: oblDuration,
    passed: oblDuration < 2000,
    duration: oblDuration,
  });
  console.log(`  Obligation query: ${oblDuration}ms (target: <2000ms) ${oblDuration < 2000 ? '✅' : '❌'}`);

  // Applicability query performance
  const appStart = Date.now();
  await prisma.applicability.findMany({
    include: { section: true },
  });
  const appDuration = Date.now() - appStart;
  results.push({
    id: 'scale-011',
    category: 'Performance',
    description: 'Applicability query',
    metric: 'ms',
    target: 1000,
    actual: appDuration,
    passed: appDuration < 1000,
    duration: appDuration,
  });
  console.log(`  Applicability query: ${appDuration}ms (target: <1000ms) ${appDuration < 1000 ? '✅' : '❌'}`);

  // Company profile query performance
  const compStart = Date.now();
  await prisma.companyProfile.findMany({
    include: { policies: true },
  });
  const compDuration = Date.now() - compStart;
  results.push({
    id: 'scale-012',
    category: 'Performance',
    description: 'Company profile query',
    metric: 'ms',
    target: 1000,
    actual: compDuration,
    passed: compDuration < 1000,
    duration: compDuration,
  });
  console.log(`  Company profile query: ${compDuration}ms (target: <1000ms) ${compDuration < 1000 ? '✅' : '❌'}`);

  // Complex join query performance
  const joinStart = Date.now();
  await prisma.regulation.findMany({
    include: {
      regulator: true,
      versions: {
        include: {
          sections: {
            include: {
              applicabilities: true,
              obligations: {
                include: {
                  deadlines: true,
                  penalties: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const joinDuration = Date.now() - joinStart;
  results.push({
    id: 'scale-013',
    category: 'Performance',
    description: 'Complex join query (regulation + versions + sections + obligations)',
    metric: 'ms',
    target: 3000,
    actual: joinDuration,
    passed: joinDuration < 3000,
    duration: joinDuration,
  });
  console.log(`  Complex join query: ${joinDuration}ms (target: <3000ms) ${joinDuration < 3000 ? '✅' : '❌'}`);

  // === Search Quality Tests ===
  console.log('\n🔍 Search Quality Tests:');

  // Search for "digital lending"
  const dlRegs = await prisma.regulation.findMany({
    where: { title: { contains: 'Digital Lending', mode: 'insensitive' } },
  });
  results.push({
    id: 'scale-014',
    category: 'Search Quality',
    description: 'Search "digital lending"',
    metric: 'count',
    target: 1,
    actual: dlRegs.length,
    passed: dlRegs.length >= 1,
  });
  console.log(`  "digital lending": ${dlRegs.length} results ${dlRegs.length >= 1 ? '✅' : '❌'}`);

  // Search for "SEBI"
  const sebiRegs = await prisma.regulation.findMany({
    where: { regulator: { abbreviation: 'SEBI' } },
  });
  results.push({
    id: 'scale-015',
    category: 'Search Quality',
    description: 'Search by regulator SEBI',
    metric: 'count',
    target: 3,
    actual: sebiRegs.length,
    passed: sebiRegs.length >= 3,
  });
  console.log(`  SEBI regulations: ${sebiRegs.length} results ${sebiRegs.length >= 3 ? '✅' : '❌'}`);

  // Search for "labour"
  const labourRegs = await prisma.regulation.findMany({
    where: { title: { contains: 'Code', mode: 'insensitive' } },
  });
  results.push({
    id: 'scale-016',
    category: 'Search Quality',
    description: 'Search "Code" (labour codes)',
    metric: 'count',
    target: 4,
    actual: labourRegs.length,
    passed: labourRegs.length >= 4,
  });
  console.log(`  "Code" results: ${labourRegs.length} ${labourRegs.length >= 4 ? '✅' : '❌'}`);

  // === Summary ===
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 SCALE VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${results.length}`);
  console.log('='.repeat(60));

  // Performance summary
  const perfTests = results.filter(r => r.category === 'Performance');
  const avgDuration = perfTests.reduce((sum, r) => sum + (r.duration || 0), 0) / perfTests.length;
  console.log(`\n⏱️  Average query duration: ${avgDuration.toFixed(0)}ms`);

  return { passed, failed, total: results.length, results };
}

runScaleValidation()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
