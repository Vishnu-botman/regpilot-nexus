/**
 * RegPilot Nexus - Demo Flow Script
 * 
 * This script demonstrates the complete MCP interaction flow:
 * 1. Seed company profile
 * 2. Seed regulation
 * 3. Execute ingestion pipeline
 * 4. Generate embeddings
 * 5. Show Regulation Explorer
 * 6. Show Compliance Dashboard
 * 7. Generate Action Plan
 * 
 * Usage: npx tsx src/demo/seed-demo.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting RegPilot Nexus Demo Flow...\n');

  // Step 1: Seed Company Profile
  console.log('📝 Step 1: Seeding company profile...');
  const company = await prisma.companyProfile.upsert({
    where: { id: 'demo-company-001' },
    update: {},
    create: {
      id: 'demo-company-001',
      name: 'Acme Fintech Solutions Pvt Ltd',
      industry: 'fintech',
      subIndustry: 'digital_lending',
      entityType: 'nbfc',
      jurisdictions: ['india'],
      employeeCount: 500,
    },
  });
  console.log(`   ✅ Company: ${company.name} (${company.id})\n`);

  // Step 2: Seed Regulator
  console.log('🏦 Step 2: Seeding regulator...');
  const existingRegulator = await prisma.regulator.findUnique({
    where: { abbreviation: 'RBI' },
  });
  
  let regulator;
  if (existingRegulator) {
    regulator = existingRegulator;
    console.log(`   ✅ Regulator already exists: ${regulator.name} (${regulator.abbreviation})\n`);
  } else {
    regulator = await prisma.regulator.create({
      data: {
        id: 'demo-regulator-rbi',
        name: 'Reserve Bank of India',
        abbreviation: 'RBI',
        website: 'https://rbi.org.in',
      },
    });
    console.log(`   ✅ Regulator created: ${regulator.name} (${regulator.abbreviation})\n`);
  }

  // Step 3: Seed Regulation
  console.log('📜 Step 3: Seeding regulation...');
  const regulation = await prisma.regulation.upsert({
    where: { id: 'demo-regulation-001' },
    update: {},
    create: {
      id: 'demo-regulation-001',
      title: 'Digital Lending Directions, 2025',
      regulationNumber: 'RBI/2025-26/01',
      documentNumber: 'FIDD.CO.BSD.BC.No.08/21.04.048/2025-26',
      gazetteReference: 'Gazette of India, Extraordinary, Part II, Section 3, Sub-section (i)',
      documentType: 'master_direction',
      issueDate: new Date('2025-04-01'),
      effectiveDate: new Date('2025-01-01'),
      status: 'active',
      summary: 'Directions for regulated entities on digital lending activities',
      sourceUrl: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
      language: 'english',
      documentStatus: 'enforced',
      regulatorId: regulator.id,
    },
  });
  console.log(`   ✅ Regulation: ${regulation.title}\n`);

  // Step 4: Seed Version
  console.log('🔖 Step 4: Seeding version...');
  const version = await prisma.version.upsert({
    where: { id: 'demo-version-001' },
    update: {},
    create: {
      id: 'demo-version-001',
      versionNumber: '1.0',
      effectiveDate: new Date('2025-01-01'),
      publicationDate: new Date('2025-04-01'),
      regulationId: regulation.id,
    },
  });
  console.log(`   ✅ Version: ${version.versionNumber}\n`);

  // Step 5: Seed Sections
  console.log('📑 Step 5: Seeding sections...');
  const sections = await Promise.all([
    prisma.section.upsert({
      where: { id: 'demo-section-001' },
      update: {},
      create: {
        id: 'demo-section-001',
        sectionNumber: '4',
        title: 'Applicability',
        content: 'These directions shall apply to all Regulated Entities engaged in digital lending activities...',
        versionId: version.id,
      },
    }),
    prisma.section.upsert({
      where: { id: 'demo-section-002' },
      update: {},
      create: {
        id: 'demo-section-002',
        sectionNumber: '5',
        title: 'General Principles',
        content: 'Regulated Entities shall ensure that all digital lending activities are conducted in a fair, transparent, and responsible manner...',
        versionId: version.id,
      },
    }),
    prisma.section.upsert({
      where: { id: 'demo-section-003' },
      update: {},
      create: {
        id: 'demo-section-003',
        sectionNumber: '6',
        title: 'Grievance Redressal',
        content: 'Regulated Entities shall establish a robust grievance redressal mechanism for digital lending customers...',
        versionId: version.id,
      },
    }),
  ]);
  console.log(`   ✅ Sections: ${sections.length} seeded\n`);

  // Step 6: Seed Applicability Rules
  console.log('🎯 Step 6: Seeding applicability rules...');
  const applicability = await prisma.applicability.upsert({
    where: { id: 'demo-applicability-001' },
    update: {},
    create: {
      id: 'demo-applicability-001',
      description: 'Applies to NBFCs and banks engaged in digital lending',
      industries: ['fintech', 'banking'],
      entityTypes: ['nbfc', 'bank'],
      jurisdictions: ['india'],
      operator: 'includes',
      sectionId: 'demo-section-001',
    },
  });
  console.log(`   ✅ Applicability: ${applicability.description}\n`);

  // Step 7: Seed Obligations
  console.log('📋 Step 7: Seeding obligations...');
  const obligations = await Promise.all([
    prisma.obligation.upsert({
      where: { id: 'demo-obligation-001' },
      update: {},
      create: {
        id: 'demo-obligation-001',
        title: 'Provide clear disclosure of loan terms',
        description: 'Regulated Entities must provide clear and conspicuous disclosure of all loan terms, including APR, total cost of credit, and repayment schedule',
        obligationType: 'disclosure',
        priority: 'high',
        mandatory: true,
        frequency: 'ongoing',
        status: 'pending',
        sectionId: 'demo-section-001',
      },
    }),
    prisma.obligation.upsert({
      where: { id: 'demo-obligation-002' },
      update: {},
      create: {
        id: 'demo-obligation-002',
        title: 'Establish grievance redressal mechanism',
        description: 'Regulated Entities must establish a robust grievance redressal mechanism with designated nodal officer',
        obligationType: 'operational',
        priority: 'high',
        mandatory: true,
        frequency: 'ongoing',
        status: 'pending',
        sectionId: 'demo-section-003',
      },
    }),
    prisma.obligation.upsert({
      where: { id: 'demo-obligation-003' },
      update: {},
      create: {
        id: 'demo-obligation-003',
        title: 'Submit quarterly compliance report',
        description: 'Regulated Entities must submit quarterly compliance reports to RBI on digital lending activities',
        obligationType: 'filing',
        priority: 'medium',
        mandatory: true,
        frequency: 'quarterly',
        status: 'pending',
        sectionId: 'demo-section-002',
      },
    }),
    prisma.obligation.upsert({
      where: { id: 'demo-obligation-004' },
      update: {},
      create: {
        id: 'demo-obligation-004',
        title: 'Conduct annual audit of digital lending systems',
        description: 'Regulated Entities must conduct annual audits of their digital lending systems and processes',
        obligationType: 'audit',
        priority: 'medium',
        mandatory: true,
        frequency: 'annual',
        status: 'pending',
        sectionId: 'demo-section-002',
      },
    }),
  ]);
  console.log(`   ✅ Obligations: ${obligations.length} seeded\n`);

  // Step 8: Seed Deadlines
  console.log('⏰ Step 8: Seeding deadlines...');
  const deadlines = await Promise.all([
    prisma.deadline.upsert({
      where: { id: 'demo-deadline-001' },
      update: {},
      create: {
        id: 'demo-deadline-001',
        deadlineType: 'absolute',
        dueCondition: 'immediate',
        description: 'Compliance required immediately upon effective date',
        obligationId: 'demo-obligation-001',
      },
    }),
    prisma.deadline.upsert({
      where: { id: 'demo-deadline-002' },
      update: {},
      create: {
        id: 'demo-deadline-002',
        deadlineType: 'absolute',
        dueCondition: 'within_90_days',
        description: 'Establish grievance mechanism within 90 days',
        obligationId: 'demo-obligation-002',
      },
    }),
    prisma.deadline.upsert({
      where: { id: 'demo-deadline-003' },
      update: {},
      create: {
        id: 'demo-deadline-003',
        deadlineType: 'recurring',
        dueCondition: 'quarterly',
        description: 'Submit quarterly reports within 15 days of quarter end',
        obligationId: 'demo-obligation-003',
      },
    }),
  ]);
  console.log(`   ✅ Deadlines: ${deadlines.length} seeded\n`);

  // Step 9: Seed Penalties
  console.log('⚠️ Step 9: Seeding penalties...');
  const penalties = await Promise.all([
    prisma.penalty.upsert({
      where: { id: 'demo-penalty-001' },
      update: {},
      create: {
        id: 'demo-penalty-001',
        description: 'Monetary penalty up to ₹5 lakh per violation',
        penaltyType: 'monetary',
        severity: 'medium',
        sectionId: 'demo-section-001',
      },
    }),
    prisma.penalty.upsert({
      where: { id: 'demo-penalty-002' },
      update: {},
      create: {
        id: 'demo-penalty-002',
        description: 'Restriction on digital lending operations',
        penaltyType: 'regulatory_action',
        severity: 'high',
        sectionId: 'demo-section-002',
      },
    }),
  ]);
  console.log(`   ✅ Penalties: ${penalties.length} seeded\n`);

  // Step 10: Summary
  console.log('📊 Demo Flow Complete!\n');
  console.log('Summary:');
  console.log(`   • Company: ${company.name}`);
  console.log(`   • Regulator: ${regulator.name}`);
  console.log(`   • Regulation: ${regulation.title}`);
  console.log(`   • Version: ${version.versionNumber}`);
  console.log(`   • Sections: ${sections.length}`);
  console.log(`   • Obligations: ${obligations.length}`);
  console.log(`   • Deadlines: ${deadlines.length}`);
  console.log(`   • Penalties: ${penalties.length}`);
  console.log('\n🎯 Next Steps:');
  console.log('   1. Run the ingestion pipeline to generate embeddings');
  console.log('   2. Open NitroStudio to test widgets');
  console.log('   3. Use Regulation Explorer to browse regulations');
  console.log('   4. Use Compliance Dashboard to view obligations');
  console.log('   5. Generate Action Plan for compliance tasks');
}

main()
  .catch((e) => {
    console.error('❌ Demo flow failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
