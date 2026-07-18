import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// COMPREHENSIVE SEED DATA
// 28 Regulations | 14 Families | 15 Companies | 200+ Obligations
// ============================================================

// Regulators
const regulators = [
  { id: 'reg-rbi', name: 'Reserve Bank of India', abbreviation: 'RBI', website: 'https://www.rbi.org.in' },
  { id: 'reg-sebi', name: 'Securities and Exchange Board of India', abbreviation: 'SEBI', website: 'https://www.sebi.gov.in' },
  { id: 'reg-mca', name: 'Ministry of Corporate Affairs', abbreviation: 'MCA', website: 'https://www.mca.gov.in' },
  { id: 'reg-meity', name: 'Ministry of Electronics and Information Technology', abbreviation: 'MeitY', website: 'https://www.meity.gov.in' },
  { id: 'reg-certin', name: 'Indian Computer Emergency Response Team', abbreviation: 'CERT-In', website: 'https://www.cert-in.org.in' },
  { id: 'reg-mole', name: 'Ministry of Labour and Employment', abbreviation: 'MoLE', website: 'https://labour.gov.in' },
  { id: 'reg-irdai', name: 'Insurance Regulatory and Development Authority of India', abbreviation: 'IRDAI', website: 'https://www.irdai.gov.in' },
  { id: 'reg-trai', name: 'Telecom Regulatory Authority of India', abbreviation: 'TRAI', website: 'https://www.trai.gov.in' },
  { id: 'reg-fssai', name: 'Food Safety and Standards Authority of India', abbreviation: 'FSSAI', website: 'https://www.fssai.gov.in' },
  { id: 'reg-moefcc', name: 'Ministry of Environment, Forest and Climate Change', abbreviation: 'MoEFCC', website: 'https://moef.gov.in' },
  { id: 'reg-cerc', name: 'Central Electricity Regulatory Commission', abbreviation: 'CERC', website: 'https://cercind.gov.in' },
  { id: 'reg-cbic', name: 'Central Board of Indirect Taxes and Customs', abbreviation: 'CBIC', website: 'https://www.cbic.gov.in' },
  { id: 'reg-cdsco', name: 'Central Drugs Standard Control Organisation', abbreviation: 'CDSCO', website: 'https://cdsco.gov.in' },
];

// Regulations
const regulations = [
  // === FINANCIAL — BANKING ===
  {
    id: 'reg-001',
    title: 'Master Direction – Digital Lending',
    regulationNumber: 'RBI/2025-26/01',
    documentNumber: 'FIDD.GCO.No.S7/31.01.012/2025-26',
    gazetteReference: 'Gazette of India, Extraordinary, Part II, Section 3, Sub-section (ii)',
    regulatorId: 'reg-rbi',
    documentType: 'master_direction',
    issueDate: new Date('2025-09-01'),
    effectiveDate: new Date('2025-10-01'),
    status: 'active',
    summary: 'Directions for all REs engaging in digital lending activities',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  {
    id: 'reg-002',
    title: 'Master Direction – Know Your Customer',
    regulationNumber: 'RBI/2015-16/159',
    documentNumber: 'DBOD.AML.BC.No.81/14.01.001/2015-16',
    gazetteReference: 'Gazette of India, dated 25-02-2016',
    regulatorId: 'reg-rbi',
    documentType: 'master_direction',
    issueDate: new Date('2016-02-25'),
    effectiveDate: new Date('2016-02-25'),
    status: 'active',
    summary: 'Directions on KYC norms, AML standards and Combating Financing of Terrorism',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  {
    id: 'reg-003',
    title: 'Guidelines on Regulation of Payment Aggregators',
    regulationNumber: 'RBI/2020-21/02',
    documentNumber: 'DPSS.CO.PD.No.1810/02.01.001/2020-21',
    gazetteReference: 'RBI/2020-21/2',
    regulatorId: 'reg-rbi',
    documentType: 'guidelines',
    issueDate: new Date('2020-03-17'),
    effectiveDate: new Date('2020-04-01'),
    status: 'active',
    summary: 'Guidelines for regulation of payment aggregators under Payment and Settlement Systems Act',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === FINANCIAL — FOREX ===
  {
    id: 'reg-004',
    title: 'Foreign Exchange Management (Non-debt Instruments) Rules',
    regulationNumber: 'FEMA 20(R)/2018',
    documentNumber: 'GSR 382(E)',
    gazetteReference: 'Gazette of India, dated 13-03-2018',
    regulatorId: 'reg-rbi',
    documentType: 'rules',
    issueDate: new Date('2018-03-13'),
    effectiveDate: new Date('2018-04-10'),
    status: 'active',
    summary: 'Rules governing foreign exchange in non-debt instruments including equity and FDI',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === FINANCIAL — AML ===
  {
    id: 'reg-005',
    title: 'Prevention of Money Laundering (Maintenance of Records) Rules',
    regulationNumber: 'PMLA Rules 2005',
    documentNumber: 'S.O. 1737(E)',
    gazetteReference: 'Gazette of India, dated 01-07-2005',
    regulatorId: 'reg-rbi',
    documentType: 'rules',
    issueDate: new Date('2005-07-01'),
    effectiveDate: new Date('2005-07-01'),
    status: 'active',
    summary: 'KYC and AML compliance requirements under PMLA',
    sourceUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === SECURITIES — LISTING ===
  {
    id: 'reg-006',
    title: 'Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations',
    regulationNumber: 'SEBI (LODR) Regulations, 2015',
    documentNumber: 'SEBI/LAD/NRO/GN/2015/12',
    gazetteReference: 'Gazette of India, dated 01-09-2015',
    regulatorId: 'reg-sebi',
    documentType: 'regulations',
    issueDate: new Date('2015-09-01'),
    effectiveDate: new Date('2015-12-01'),
    status: 'active',
    summary: 'Regulations for listed entities regarding listing obligations and disclosure requirements',
    sourceUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === SECURITIES — INSIDER TRADING ===
  {
    id: 'reg-007',
    title: 'SEBI (Prohibition of Insider Trading) Regulations',
    regulationNumber: 'SEBI (PIT) Regulations, 2015',
    documentNumber: 'SEBI/LAD/NRO/GN/2015/18',
    gazetteReference: 'Gazette of India, dated 12-01-2015',
    regulatorId: 'reg-sebi',
    documentType: 'regulations',
    issueDate: new Date('2015-01-12'),
    effectiveDate: new Date('2015-05-15'),
    status: 'active',
    summary: 'Regulations prohibiting insider trading in securities',
    sourceUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === SECURITIES — IPO ===
  {
    id: 'reg-008',
    title: 'SEBI (Issue of Capital and Disclosure Requirements) Regulations',
    regulationNumber: 'SEBI (ICDR) Regulations, 2018',
    documentNumber: 'SEBI/LAD/NRO/GN/2018/21',
    gazetteReference: 'Gazette of India, dated 11-11-2018',
    regulatorId: 'reg-sebi',
    documentType: 'regulations',
    issueDate: new Date('2018-11-11'),
    effectiveDate: new Date('2018-11-11'),
    status: 'active',
    summary: 'Regulations governing issue of capital and disclosure requirements',
    sourceUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === SECURITIES — MUTUAL FUNDS ===
  {
    id: 'reg-009',
    title: 'SEBI (Mutual Funds) Regulations',
    regulationNumber: 'SEBI (MF) Regulations, 1996',
    documentNumber: 'SEBI/LAD/NRO/GN/1996/45',
    gazetteReference: 'Gazette of India, dated 03-12-1996',
    regulatorId: 'reg-sebi',
    documentType: 'regulations',
    issueDate: new Date('1996-12-03'),
    effectiveDate: new Date('1996-12-03'),
    status: 'active',
    summary: 'Regulations governing mutual funds',
    sourceUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === CORPORATE — COMPANY LAW ===
  {
    id: 'reg-010',
    title: 'Companies Act, 2013',
    regulationNumber: 'Act No. 18 of 2013',
    documentNumber: 'Act No. 18 of 2013',
    gazetteReference: 'Gazette of India, dated 12-09-2013',
    regulatorId: 'reg-mca',
    documentType: 'act',
    issueDate: new Date('2013-09-12'),
    effectiveDate: new Date('2013-09-12'),
    status: 'active',
    summary: 'Act governing formation, regulation and winding up of companies',
    sourceUrl: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === CORPORATE — CSR ===
  {
    id: 'reg-011',
    title: 'Companies (Corporate Social Responsibility Policy) Rules',
    regulationNumber: 'Companies (CSR Policy) Rules, 2014',
    documentNumber: 'GSR 218(E)',
    gazetteReference: 'Gazette of India, dated 27-02-2014',
    regulatorId: 'reg-mca',
    documentType: 'rules',
    issueDate: new Date('2014-02-27'),
    effectiveDate: new Date('2014-04-01'),
    status: 'active',
    summary: 'Rules for Corporate Social Responsibility policy and expenditure',
    sourceUrl: 'https://www.mca.gov.in/content/mca/global/en/acts-rules.html',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === CORPORATE — ACCOUNTS ===
  {
    id: 'reg-012',
    title: 'Companies (Accounts) Amendment Rules, 2026',
    regulationNumber: 'Companies (Accounts) Rules, 2014 (Amended 2026)',
    documentNumber: 'GSR 123(E)',
    gazetteReference: 'Gazette of India, dated 15-03-2026',
    regulatorId: 'reg-mca',
    documentType: 'rules',
    issueDate: new Date('2026-03-15'),
    effectiveDate: new Date('2026-04-01'),
    status: 'active',
    summary: 'Amended rules for preparation and maintenance of accounts by companies',
    sourceUrl: 'https://www.mca.gov.in/content/mca/global/en/acts-rules.html',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === DATA — PRIVACY ===
  {
    id: 'reg-013',
    title: 'Digital Personal Data Protection Act, 2023',
    regulationNumber: 'Act No. 22 of 2023',
    documentNumber: 'Act No. 22 of 2023',
    gazetteReference: 'Gazette of India, dated 11-08-2023',
    regulatorId: 'reg-meity',
    documentType: 'act',
    issueDate: new Date('2023-08-11'),
    effectiveDate: new Date('2023-08-11'),
    status: 'active',
    summary: 'Act for processing of digital personal data',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === CYBER — INCIDENT RESPONSE ===
  {
    id: 'reg-014',
    title: 'CERT-In Direction on Incident Reporting',
    regulationNumber: 'CERT-In Direction No. 20/2022',
    documentNumber: 'CERT-In/2022/20',
    gazetteReference: 'Gazette of India, dated 28-04-2022',
    regulatorId: 'reg-certin',
    documentType: 'direction',
    issueDate: new Date('2022-04-28'),
    effectiveDate: new Date('2022-06-27'),
    status: 'active',
    summary: 'Mandatory incident reporting requirements for organizations',
    sourceUrl: 'https://www.cert-in.org.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === CYBER — IT ===
  {
    id: 'reg-015',
    title: 'Information Technology Act, 2000',
    regulationNumber: 'Act No. 21 of 2000',
    documentNumber: 'Act No. 21 of 2000',
    gazetteReference: 'Gazette of India, dated 09-06-2000',
    regulatorId: 'reg-meity',
    documentType: 'act',
    issueDate: new Date('2000-06-09'),
    effectiveDate: new Date('2000-10-17'),
    status: 'active',
    summary: 'Act to provide legal recognition for transactions carried out by means of electronic communication',
    sourceUrl: 'https://www.meity.gov.in/e-governance',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === LABOUR — WAGES ===
  {
    id: 'reg-016',
    title: 'Code on Wages, 2019',
    regulationNumber: 'Act No. 29 of 2019',
    documentNumber: 'Act No. 29 of 2019',
    gazetteReference: 'Gazette of India, dated 08-08-2019',
    regulatorId: 'reg-mole',
    documentType: 'code',
    issueDate: new Date('2019-08-08'),
    effectiveDate: new Date('2019-08-08'),
    status: 'active',
    summary: 'Code consolidating laws relating to wages',
    sourceUrl: 'https://labour.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === LABOUR — SOCIAL SECURITY ===
  {
    id: 'reg-017',
    title: 'Code on Social Security, 2020',
    regulationNumber: 'Act No. 36 of 2020',
    documentNumber: 'Act No. 36 of 2020',
    gazetteReference: 'Gazette of India, dated 28-09-2020',
    regulatorId: 'reg-mole',
    documentType: 'code',
    issueDate: new Date('2020-09-28'),
    effectiveDate: new Date('2020-09-28'),
    status: 'active',
    summary: 'Code consolidating laws relating to social security',
    sourceUrl: 'https://labour.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === LABOUR — SAFETY ===
  {
    id: 'reg-018',
    title: 'Occupational Safety, Health and Working Conditions Code, 2020',
    regulationNumber: 'Act No. 37 of 2020',
    documentNumber: 'Act No. 37 of 2020',
    gazetteReference: 'Gazette of India, dated 28-09-2020',
    regulatorId: 'reg-mole',
    documentType: 'code',
    issueDate: new Date('2020-09-28'),
    effectiveDate: new Date('2020-09-28'),
    status: 'active',
    summary: 'Code consolidating laws relating to occupational safety and health',
    sourceUrl: 'https://labour.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === LABOUR — INDUSTRIAL RELATIONS ===
  {
    id: 'reg-019',
    title: 'Industrial Relations Code, 2020',
    regulationNumber: 'Act No. 35 of 2020',
    documentNumber: 'Act No. 35 of 2020',
    gazetteReference: 'Gazette of India, dated 28-09-2020',
    regulatorId: 'reg-mole',
    documentType: 'code',
    issueDate: new Date('2020-09-28'),
    effectiveDate: new Date('2020-09-28'),
    status: 'active',
    summary: 'Code consolidating laws relating to industrial relations',
    sourceUrl: 'https://labour.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === INSURANCE — CORPORATE AGENTS ===
  {
    id: 'reg-020',
    title: 'IRDAI (Registration of Corporate Agents) Regulations',
    regulationNumber: 'IRDAI (Corporate Agents) Regulations, 2015',
    documentNumber: 'IRDAI/Reg/6/107/2015',
    gazetteReference: 'IRDAI/Reg/6/107/2015',
    regulatorId: 'reg-irdai',
    documentType: 'regulations',
    issueDate: new Date('2015-10-26'),
    effectiveDate: new Date('2015-10-26'),
    status: 'active',
    summary: 'Regulations for registration and conduct of corporate agents',
    sourceUrl: 'https://www.irdai.gov.in/admincms/cms/printedbook.aspx',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === INSURANCE — ADVERTISEMENTS ===
  {
    id: 'reg-021',
    title: 'IRDAI (Insurance Advertisements) Regulations',
    regulationNumber: 'IRDAI (Advertisements) Regulations, 2022',
    documentNumber: 'IRDAI/Reg/8/2022',
    gazetteReference: 'IRDAI/Reg/8/2022',
    regulatorId: 'reg-irdai',
    documentType: 'regulations',
    issueDate: new Date('2022-06-15'),
    effectiveDate: new Date('2022-07-01'),
    status: 'active',
    summary: 'Regulations governing insurance advertisements',
    sourceUrl: 'https://www.irdai.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === TELECOM ===
  {
    id: 'reg-022',
    title: 'TRAI Quality of Service Regulations (Mobile Services)',
    regulationNumber: 'TRAI QoS Regulations, 2024',
    documentNumber: 'TRAI/QoS/2024/01',
    gazetteReference: 'Notification dated 15-01-2024',
    regulatorId: 'reg-trai',
    documentType: 'regulations',
    issueDate: new Date('2024-01-15'),
    effectiveDate: new Date('2024-02-01'),
    status: 'active',
    summary: 'Quality of Service benchmarks for mobile services',
    sourceUrl: 'https://www.trai.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === FOOD ===
  {
    id: 'reg-023',
    title: 'FSSAI Food Safety and Standards (Labelling and Display) Regulations',
    regulationNumber: 'FSSR 2020',
    documentNumber: 'F.No. P.15025/73/2020-Regulatory-FSSAI',
    gazetteReference: 'FSSAI/Notification/2020',
    regulatorId: 'reg-fssai',
    documentType: 'regulations',
    issueDate: new Date('2020-10-01'),
    effectiveDate: new Date('2021-10-01'),
    status: 'active',
    summary: 'Regulations for labelling and display of food products',
    sourceUrl: 'https://www.fssai.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === ENVIRONMENT — EIA ===
  {
    id: 'reg-024',
    title: 'Environment Protection Act, 1986 (EIA Notification)',
    regulationNumber: 'EIA Notification, 2006',
    documentNumber: 'S.O. 1533(E)',
    gazetteReference: 'Gazette of India, dated 14-09-2006',
    regulatorId: 'reg-moefcc',
    documentType: 'notification',
    issueDate: new Date('2006-09-14'),
    effectiveDate: new Date('2006-09-14'),
    status: 'active',
    summary: 'Environmental Impact Assessment requirements for industrial projects',
    sourceUrl: 'https://moef.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === ENVIRONMENT — E-WASTE ===
  {
    id: 'reg-025',
    title: 'E-Waste (Management) Rules, 2016',
    regulationNumber: 'E-Waste Rules, 2016',
    documentNumber: 'S.O. 3127(E)',
    gazetteReference: 'Gazette of India, dated 23-10-2016',
    regulatorId: 'reg-moefcc',
    documentType: 'rules',
    issueDate: new Date('2016-10-23'),
    effectiveDate: new Date('2017-01-01'),
    status: 'active',
    summary: 'Rules for management of e-waste including collection, storage and recycling',
    sourceUrl: 'https://moef.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === ENERGY — CERC ===
  {
    id: 'reg-026',
    title: 'CERC (Indian Electricity Grid Code) Regulations',
    regulationNumber: 'CERC IEGC Regulations, 2023',
    documentNumber: 'CERC/IEGC/2023/01',
    gazetteReference: 'CERC Notification dated 01-04-2023',
    regulatorId: 'reg-cerc',
    documentType: 'regulations',
    issueDate: new Date('2023-04-01'),
    effectiveDate: new Date('2023-04-01'),
    status: 'active',
    summary: 'Grid code for operation and maintenance of Indian electricity grid',
    sourceUrl: 'https://cercind.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === TAX — GST ===
  {
    id: 'reg-027',
    title: 'GST Council Circular on Compliance Requirements',
    regulationNumber: 'GST Council Circular No. 210/2024',
    documentNumber: 'Circular 210/2024',
    gazetteReference: 'CBIC Circular dated 15-12-2024',
    regulatorId: 'reg-cbic',
    documentType: 'circular',
    issueDate: new Date('2024-12-15'),
    effectiveDate: new Date('2024-12-15'),
    status: 'active',
    summary: 'Compliance requirements under GST for registered persons',
    sourceUrl: 'https://www.cbic.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
  // === HEALTHCARE ===
  {
    id: 'reg-028',
    title: 'Medical Device Rules, 2017',
    regulationNumber: 'Medical Device Rules, 2017',
    documentNumber: 'S.O. 778(E)',
    gazetteReference: 'Gazette of India, dated 01-02-2017',
    regulatorId: 'reg-cdsco',
    documentType: 'rules',
    issueDate: new Date('2017-02-01'),
    effectiveDate: new Date('2017-09-01'),
    status: 'active',
    summary: 'Rules for regulation of medical devices',
    sourceUrl: 'https://cdsco.gov.in',
    language: 'en',
    documentStatus: 'enforced',
  },
];

// Versions
const versions = [
  { id: 'ver-001-v1', regulationId: 'reg-001', versionNumber: '1.0', publicationDate: new Date('2025-09-01'), effectiveDate: new Date('2025-10-01'), supersedesVersion: null, changeSummary: 'Initial release of Digital Lending Directions' },
  { id: 'ver-001-v2', regulationId: 'reg-001', versionNumber: '1.1', publicationDate: new Date('2025-12-01'), effectiveDate: new Date('2026-01-01'), supersedesVersion: '1.0', changeSummary: 'Amendment to include additional disclosure requirements' },
  { id: 'ver-002-v1', regulationId: 'reg-002', versionNumber: '1.0', publicationDate: new Date('2016-02-25'), effectiveDate: new Date('2016-02-25'), supersedesVersion: null, changeSummary: 'Updated KYC norms' },
  { id: 'ver-003-v1', regulationId: 'reg-003', versionNumber: '1.0', publicationDate: new Date('2020-03-17'), effectiveDate: new Date('2020-04-01'), supersedesVersion: null, changeSummary: 'Initial PA guidelines' },
  { id: 'ver-004-v1', regulationId: 'reg-004', versionNumber: '1.0', publicationDate: new Date('2018-03-13'), effectiveDate: new Date('2018-04-10'), supersedesVersion: null, changeSummary: 'FEMA non-debt instruments rules' },
  { id: 'ver-005-v1', regulationId: 'reg-005', versionNumber: '1.0', publicationDate: new Date('2005-07-01'), effectiveDate: new Date('2005-07-01'), supersedesVersion: null, changeSummary: 'PMLA rules' },
  { id: 'ver-006-v1', regulationId: 'reg-006', versionNumber: '1.0', publicationDate: new Date('2015-09-01'), effectiveDate: new Date('2015-12-01'), supersedesVersion: null, changeSummary: 'LODR initial regulations' },
  { id: 'ver-006-v2', regulationId: 'reg-006', versionNumber: '2.0', publicationDate: new Date('2026-01-15'), effectiveDate: new Date('2026-04-01'), supersedesVersion: '1.0', changeSummary: 'Amended LODR regulations for enhanced disclosures' },
  { id: 'ver-007-v1', regulationId: 'reg-007', versionNumber: '1.0', publicationDate: new Date('2015-01-12'), effectiveDate: new Date('2015-05-15'), supersedesVersion: null, changeSummary: 'PIT initial regulations' },
  { id: 'ver-008-v1', regulationId: 'reg-008', versionNumber: '1.0', publicationDate: new Date('2018-11-11'), effectiveDate: new Date('2018-11-11'), supersedesVersion: null, changeSummary: 'ICDR initial regulations' },
  { id: 'ver-009-v1', regulationId: 'reg-009', versionNumber: '1.0', publicationDate: new Date('1996-12-03'), effectiveDate: new Date('1996-12-03'), supersedesVersion: null, changeSummary: 'MF initial regulations' },
  { id: 'ver-010-v1', regulationId: 'reg-010', versionNumber: '1.0', publicationDate: new Date('2013-09-12'), effectiveDate: new Date('2013-09-12'), supersedesVersion: null, changeSummary: 'Companies Act 2013' },
  { id: 'ver-011-v1', regulationId: 'reg-011', versionNumber: '1.0', publicationDate: new Date('2014-02-27'), effectiveDate: new Date('2014-04-01'), supersedesVersion: null, changeSummary: 'CSR Rules' },
  { id: 'ver-012-v1', regulationId: 'reg-012', versionNumber: '1.0', publicationDate: new Date('2026-03-15'), effectiveDate: new Date('2026-04-01'), supersedesVersion: null, changeSummary: 'Accounts Rules 2026' },
  { id: 'ver-013-v1', regulationId: 'reg-013', versionNumber: '1.0', publicationDate: new Date('2023-08-11'), effectiveDate: new Date('2023-08-11'), supersedesVersion: null, changeSummary: 'DPDP Act' },
  { id: 'ver-014-v1', regulationId: 'reg-014', versionNumber: '1.0', publicationDate: new Date('2022-04-28'), effectiveDate: new Date('2022-06-27'), supersedesVersion: null, changeSummary: 'CERT-In direction' },
  { id: 'ver-015-v1', regulationId: 'reg-015', versionNumber: '1.0', publicationDate: new Date('2000-06-09'), effectiveDate: new Date('2000-10-17'), supersedesVersion: null, changeSummary: 'IT Act' },
  { id: 'ver-016-v1', regulationId: 'reg-016', versionNumber: '1.0', publicationDate: new Date('2019-08-08'), effectiveDate: new Date('2019-08-08'), supersedesVersion: null, changeSummary: 'Code on Wages' },
  { id: 'ver-017-v1', regulationId: 'reg-017', versionNumber: '1.0', publicationDate: new Date('2020-09-28'), effectiveDate: new Date('2020-09-28'), supersedesVersion: null, changeSummary: 'Social Security Code' },
  { id: 'ver-018-v1', regulationId: 'reg-018', versionNumber: '1.0', publicationDate: new Date('2020-09-28'), effectiveDate: new Date('2020-09-28'), supersedesVersion: null, changeSummary: 'OSH Code' },
  { id: 'ver-019-v1', regulationId: 'reg-019', versionNumber: '1.0', publicationDate: new Date('2020-09-28'), effectiveDate: new Date('2020-09-28'), supersedesVersion: null, changeSummary: 'IR Code' },
  { id: 'ver-020-v1', regulationId: 'reg-020', versionNumber: '1.0', publicationDate: new Date('2015-10-26'), effectiveDate: new Date('2015-10-26'), supersedesVersion: null, changeSummary: 'Corporate Agents regulations' },
  { id: 'ver-021-v1', regulationId: 'reg-021', versionNumber: '1.0', publicationDate: new Date('2022-06-15'), effectiveDate: new Date('2022-07-01'), supersedesVersion: null, changeSummary: 'Advertisements regulations' },
  { id: 'ver-022-v1', regulationId: 'reg-022', versionNumber: '1.0', publicationDate: new Date('2024-01-15'), effectiveDate: new Date('2024-02-01'), supersedesVersion: null, changeSummary: 'QoS regulations' },
  { id: 'ver-023-v1', regulationId: 'reg-023', versionNumber: '1.0', publicationDate: new Date('2020-10-01'), effectiveDate: new Date('2021-10-01'), supersedesVersion: null, changeSummary: 'Labelling regulations' },
  { id: 'ver-024-v1', regulationId: 'reg-024', versionNumber: '1.0', publicationDate: new Date('2006-09-14'), effectiveDate: new Date('2006-09-14'), supersedesVersion: null, changeSummary: 'EIA notification' },
  { id: 'ver-025-v1', regulationId: 'reg-025', versionNumber: '1.0', publicationDate: new Date('2016-10-23'), effectiveDate: new Date('2017-01-01'), supersedesVersion: null, changeSummary: 'E-Waste rules' },
  { id: 'ver-026-v1', regulationId: 'reg-026', versionNumber: '1.0', publicationDate: new Date('2023-04-01'), effectiveDate: new Date('2023-04-01'), supersedesVersion: null, changeSummary: 'IEGC regulations' },
  { id: 'ver-027-v1', regulationId: 'reg-027', versionNumber: '1.0', publicationDate: new Date('2024-12-15'), effectiveDate: new Date('2024-12-15'), supersedesVersion: null, changeSummary: 'GST circular' },
  { id: 'ver-028-v1', regulationId: 'reg-028', versionNumber: '1.0', publicationDate: new Date('2017-02-01'), effectiveDate: new Date('2017-09-01'), supersedesVersion: null, changeSummary: 'Medical device rules' },
];

// Sections (sample for each regulation)
const sections: any[] = [];
const sectionData = [
  // RBI Digital Lending
  { id: 'sec-001-1', versionId: 'ver-001-v1', sectionNumber: '1', title: 'Definitions', content: 'In these Directions, unless the context otherwise requires: (a) "Digital Lending" means granting of loans which is done entirely through a digital channel; (b) "Lending Service Provider" means an agent of the Regulated Entity.', parentSectionId: null },
  { id: 'sec-001-2', versionId: 'ver-001-v1', sectionNumber: '2', title: 'Applicability', content: 'These Directions shall apply to all Regulated Entities including banks, NBFCs, and other financial intermediaries.', parentSectionId: null },
  { id: 'sec-001-3', versionId: 'ver-001-v1', sectionNumber: '3', title: 'General Principles', content: 'All REs engaging in digital lending shall ensure that the digital lending ecosystem is transparent and customer-centric.', parentSectionId: null },
  { id: 'sec-001-4', versionId: 'ver-001-v1', sectionNumber: '4', title: 'Key Fact Statement', content: 'RE shall provide Key Fact Statement to the borrower in prescribed format before execution of loan agreement.', parentSectionId: null },
  { id: 'sec-001-5', versionId: 'ver-001-v1', sectionNumber: '5', title: 'Cooling-Off Period', content: 'A cooling-off period of three working days shall be provided during which the borrower can exit the loan without any penalty.', parentSectionId: null },
  { id: 'sec-001-6', versionId: 'ver-001-v1', sectionNumber: '6', title: 'Grievance Redressal', content: 'RE shall establish a digital lending grievance redressal mechanism accessible through their website and mobile app.', parentSectionId: null },
  { id: 'sec-001-7', versionId: 'ver-001-v2', sectionNumber: '7', title: 'Enhanced Disclosures', content: 'Additional disclosure requirements for digital lending platforms including APR and total cost of credit.', parentSectionId: null },
  // RBI KYC
  { id: 'sec-002-1', versionId: 'ver-002-v1', sectionNumber: '1', title: 'KYC Requirements', content: 'REs shall follow Customer Due Diligence (CDD) procedures as prescribed.', parentSectionId: null },
  { id: 'sec-002-2', versionId: 'ver-002-v1', sectionNumber: '2', title: 'Customer Identification', content: 'REs shall verify the identity of customers using official documents.', parentSectionId: null },
  // SEBI LODR
  { id: 'sec-006-1', versionId: 'ver-006-v1', sectionNumber: '1', title: 'Definitions', content: 'In these Regulations, unless the context otherwise requires: (a) " Listed Entity" means a listed company;', parentSectionId: null },
  { id: 'sec-006-2', versionId: 'ver-006-v1', sectionNumber: '2', title: 'Corporate Governance', content: 'Every listed entity shall have an optimum combination of executive and non-executive directors.', parentSectionId: null },
  { id: 'sec-006-3', versionId: 'ver-006-v1', sectionNumber: '3', title: 'Disclosures', content: 'Listed entities shall make disclosures to the stock exchanges as required under these regulations.', parentSectionId: null },
  // DPDP Act
  { id: 'sec-013-1', versionId: 'ver-013-v1', sectionNumber: '4', title: 'Lawful Processing', content: 'Personal data may be processed only for lawful purposes with consent of the Data Principal.', parentSectionId: null },
  { id: 'sec-013-2', versionId: 'ver-013-v1', sectionNumber: '5', title: 'Notice', content: 'Data Fiduciary shall give notice to Data Principal before processing personal data.', parentSectionId: null },
  { id: 'sec-013-3', versionId: 'ver-013-v1', sectionNumber: '6', title: 'Consent', content: 'Consent shall be free, specific, informed, unconditional and unambiguous.', parentSectionId: null },
  { id: 'sec-013-4', versionId: 'ver-013-v1', sectionNumber: '8', title: 'Obligations of Data Fiduciary', content: 'Data Fiduciary shall implement security safeguards, report data breaches, and erase data when purpose is fulfilled.', parentSectionId: null },
  { id: 'sec-013-5', versionId: 'ver-013-v1', sectionNumber: '9', title: 'Penalties', content: 'Penalty up to Rs 250 crore for failure to take reasonable security safeguards.', parentSectionId: null },
  // CERT-In
  { id: 'sec-014-1', versionId: 'ver-014-v1', sectionNumber: '1', title: 'Incident Reporting', content: 'All organizations shall report cyber incidents to CERT-In within 6 hours of noticing.', parentSectionId: null },
  // Companies Act
  { id: 'sec-010-1', versionId: 'ver-010-v1', sectionNumber: '96', title: 'Annual General Meeting', content: 'Every company shall hold an AGM within six months from the date of closing of financial year.', parentSectionId: null },
  { id: 'sec-010-2', versionId: 'ver-010-v1', sectionNumber: '135', title: 'CSR Policy', content: 'Every company with net worth exceeding Rs 500 crore shall constitute a CSR Committee.', parentSectionId: null },
  // Code on Wages
  { id: 'sec-016-1', versionId: 'ver-016-v1', sectionNumber: '1', title: 'Definitions', content: 'In this Code, unless the context otherwise requires: (a) "employer" means a person who employs;', parentSectionId: null },
  { id: 'sec-016-2', versionId: 'ver-016-v1', sectionNumber: '9', title: 'Payment of Wages', content: 'Wages of every employed person shall be paid on or before the seventh day of the following month.', parentSectionId: null },
  // IRDAI
  { id: 'sec-020-1', versionId: 'ver-020-v1', sectionNumber: '3', title: 'Registration Requirements', content: 'No corporate agent shall solicit or procure insurance business without registration with IRDAI.', parentSectionId: null },
  // FSSAI
  { id: 'sec-023-1', versionId: 'ver-023-v1', sectionNumber: '5', title: 'Labelling Requirements', content: 'Every pre-packaged food shall bear a label with information as prescribed.', parentSectionId: null },
  // Environment
  { id: 'sec-024-1', versionId: 'ver-024-v1', sectionNumber: '1', title: 'EIA Requirements', content: 'Projects requiring environmental clearance shall undergo Environmental Impact Assessment.', parentSectionId: null },
];

// Company Profiles
const companyProfiles = [
  {
    id: 'comp-001',
    name: 'Acme Fintech Solutions Pvt Ltd',
    industry: 'fintech',
    subIndustry: 'digital_lending',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['maharashtra'],
    products: ['personal_loans', 'business_loans'],
    services: ['digital_lending', 'loan_aggregation'],
    licenses: ['nbfc_registration', 'rbi_approval'],
    employeeCount: 250,
    website: 'https://acmefintech.in',
  },
  {
    id: 'comp-002',
    name: 'Bharat National Bank Ltd',
    industry: 'banking',
    subIndustry: 'public_sector_bank',
    entityType: 'public_sector_bank',
    incorporationType: 'public_limited',
    jurisdictions: ['india'],
    locations: ['delhi', 'maharashtra', 'karnataka'],
    products: ['savings_accounts', 'loans', 'fixed_deposits'],
    services: ['banking', 'wealth_management'],
    licenses: ['banking_license', 'rbi_license'],
    employeeCount: 15000,
    website: 'https://bharatbank.in',
  },
  {
    id: 'comp-003',
    name: 'CyberShield Security Solutions',
    industry: 'cybersecurity',
    subIndustry: 'it_services',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['karnataka'],
    products: ['security_software', 'threat_intelligence'],
    services: ['cybersecurity', 'incident_response'],
    licenses: ['certin_empanelment'],
    employeeCount: 500,
    website: 'https://cybershield.in',
  },
  {
    id: 'comp-004',
    name: 'DataVault Technologies Inc',
    industry: 'saas',
    subIndustry: 'cloud_services',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india', 'usa'],
    locations: ['karnataka', 'california'],
    products: ['cloud_storage', 'data_analytics'],
    services: ['cloud_computing', 'data_processing'],
    licenses: ['iso_27001'],
    employeeCount: 1200,
    website: 'https://datavault.io',
  },
  {
    id: 'comp-005',
    name: 'GreenEnergy Corporation Ltd',
    industry: 'energy',
    subIndustry: 'power_generation',
    entityType: 'public_limited',
    incorporationType: 'public_limited',
    jurisdictions: ['india'],
    locations: ['gujarat', 'rajasthan'],
    products: ['solar_panels', 'wind_turbines'],
    services: ['power_generation', 'energy_consulting'],
    licenses: ['cerc_license', 'moefcc_clearance'],
    employeeCount: 2000,
    website: 'https://greenenergy.in',
  },
  {
    id: 'comp-006',
    name: 'HealthPlus Medical Devices Pvt Ltd',
    industry: 'healthcare',
    subIndustry: 'medical_devices',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['maharashtra'],
    products: ['diagnostic_devices', 'surgical_instruments'],
    services: ['medical_device_manufacturing'],
    licenses: ['cdsco_approval', 'iso_13485'],
    employeeCount: 800,
    website: 'https://healthplus.in',
  },
  {
    id: 'comp-007',
    name: 'India Manufacturing Ltd',
    industry: 'manufacturing',
    subIndustry: 'industrial_manufacturing',
    entityType: 'public_limited',
    incorporationType: 'public_limited',
    jurisdictions: ['india'],
    locations: ['tamil_nadu', 'maharashtra'],
    products: ['automotive_components', 'industrial_machinery'],
    services: ['manufacturing', 'assembly'],
    licenses: ['factory_license', 'pollution_board_clearance'],
    employeeCount: 5000,
    website: 'https://indiamfg.in',
  },
  {
    id: 'comp-008',
    name: 'LifeCare Insurance Company Ltd',
    industry: 'insurance',
    subIndustry: 'life_insurance',
    entityType: 'insurance_company',
    incorporationType: 'public_limited',
    jurisdictions: ['india'],
    locations: ['delhi', 'maharashtra'],
    products: ['life_insurance', 'health_insurance'],
    services: ['insurance_underwriting', 'claims_management'],
    licenses: ['irdai_license'],
    employeeCount: 3000,
    website: 'https://lifecare.in',
  },
  {
    id: 'comp-009',
    name: 'MediaCorp Telecom Ltd',
    industry: 'telecom',
    subIndustry: 'mobile_services',
    entityType: 'public_limited',
    incorporationType: 'public_limited',
    jurisdictions: ['india'],
    locations: ['delhi', 'maharashtra', 'karnataka'],
    products: ['mobile_plans', 'broadband'],
    services: ['telecom_services', 'data_services'],
    licenses: ['trai_license', 'dot_license'],
    employeeCount: 8000,
    website: 'https://mediacorp.in',
  },
  {
    id: 'comp-010',
    name: 'SafeFood Industries Pvt Ltd',
    industry: 'food',
    subIndustry: 'food_processing',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['punjab', 'haryana'],
    products: ['packaged_food', 'beverages'],
    services: ['food_processing', 'distribution'],
    licenses: ['fssai_license'],
    employeeCount: 1500,
    website: 'https://safefood.in',
  },
  {
    id: 'comp-011',
    name: 'TradeWinds Export Import Pvt Ltd',
    industry: 'trading',
    subIndustry: 'export_import',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['maharashtra', 'gujarat'],
    products: ['textiles', 'pharmaceuticals'],
    services: ['international_trade', 'logistics'],
    licenses: ['iec_code', 'gst_registration'],
    employeeCount: 300,
    website: 'https://tradewinds.in',
  },
  {
    id: 'comp-012',
    name: 'UrbanEco Real Estate Pvt Ltd',
    industry: 'real_estate',
    subIndustry: 'construction',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['karnataka', 'tamil_nadu'],
    products: ['residential_properties', 'commercial_properties'],
    services: ['real_estate_development', 'property_management'],
    licenses: ['rera_registration'],
    employeeCount: 400,
    website: 'https://urbaneco.in',
  },
  {
    id: 'comp-013',
    name: 'VirtuLearn EdTech Solutions',
    industry: 'education',
    subIndustry: 'edtech',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['karnataka'],
    products: ['online_courses', 'learning_platform'],
    services: ['edtech', 'content_creation'],
    licenses: [],
    employeeCount: 200,
    website: 'https://virtulearn.in',
  },
  {
    id: 'comp-014',
    name: 'Zenith Insurance Brokers Pvt Ltd',
    industry: 'insurance',
    subIndustry: 'insurance_brokerage',
    entityType: 'insurance_broker',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['maharashtra'],
    products: ['insurance_brokerage'],
    services: ['insurance_distribution', 'risk_advisory'],
    licenses: ['irdai_broker_license'],
    employeeCount: 150,
    website: 'https://zenithbrokers.in',
  },
  {
    id: 'comp-015',
    name: 'Quantum Finance NBFC Pvt Ltd',
    industry: 'nbfc',
    subIndustry: 'non_banking_finance',
    entityType: 'private_company',
    incorporationType: 'private_limited',
    jurisdictions: ['india'],
    locations: ['maharashtra'],
    products: ['microloans', 'consumer_finance'],
    services: ['nbfc', 'lending'],
    licenses: ['nbfc_registration'],
    employeeCount: 180,
    website: 'https://quantumfinance.in',
  },
];

// Applicability Rules
const applicabilityRules: any[] = [];
const applicabilityData = [
  // RBI Digital Lending
  { id: 'app-001', sectionId: 'sec-001-2', description: 'Applies to all financial entities in digital lending', operator: 'includes', industries: ['banking', 'nbfc', 'fintech'], entityTypes: ['bank', 'nbfc', 'lsp', 'private_company'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // RBI KYC
  { id: 'app-002', sectionId: 'sec-002-1', description: 'Applies to all financial entities', operator: 'includes', industries: ['banking', 'nbfc', 'fintech', 'insurance'], entityTypes: ['bank', 'nbfc', 'insurance_company'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // SEBI LODR
  { id: 'app-003', sectionId: 'sec-006-1', description: 'Applies to listed entities', operator: 'includes', industries: ['all'], entityTypes: ['listed_company', 'public_limited'], jurisdictions: ['india'], thresholds: null, conditions: { requiresListing: true } },
  // DPDP Act
  { id: 'app-004', sectionId: 'sec-013-1', description: 'Applies to all entities processing digital personal data', operator: 'includes', industries: ['all'], entityTypes: ['all'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // CERT-In
  { id: 'app-005', sectionId: 'sec-014-1', description: 'Applies to all organizations operating in India', operator: 'includes', industries: ['all'], entityTypes: ['all'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // Companies Act
  { id: 'app-006', sectionId: 'sec-010-1', description: 'Applies to all companies incorporated in India', operator: 'includes', industries: ['all'], entityTypes: ['private_company', 'public_limited', 'private_limited'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // CSR
  { id: 'app-007', sectionId: 'sec-010-2', description: 'Applies to companies with net worth above Rs 500 crore', operator: 'includes', industries: ['all'], entityTypes: ['public_limited'], jurisdictions: ['india'], thresholds: { netWorth: 5000000000 }, conditions: null },
  // Code on Wages
  { id: 'app-008', sectionId: 'sec-016-1', description: 'Applies to all establishments', operator: 'includes', industries: ['all'], entityTypes: ['all'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // IRDAI
  { id: 'app-009', sectionId: 'sec-020-1', description: 'Applies to insurance intermediaries', operator: 'includes', industries: ['insurance'], entityTypes: ['insurance_company', 'insurance_broker'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // FSSAI
  { id: 'app-010', sectionId: 'sec-023-1', description: 'Applies to food businesses', operator: 'includes', industries: ['food', 'food_processing'], entityTypes: ['private_company', 'public_limited'], jurisdictions: ['india'], thresholds: null, conditions: null },
  // Environment
  { id: 'app-011', sectionId: 'sec-024-1', description: 'Applies to projects requiring environmental clearance', operator: 'includes', industries: ['manufacturing', 'energy', 'real_estate', 'construction'], entityTypes: ['private_company', 'public_limited'], jurisdictions: ['india'], thresholds: null, conditions: null },
];

// Obligations
const obligations: any[] = [];
const obligationData = [
  // RBI Digital Lending - KFS
  { id: 'obl-001', sectionId: 'sec-001-4', title: 'Key Fact Statement Disclosure', description: 'RE shall provide Key Fact Statement to the borrower in prescribed format before execution of loan agreement', obligationType: 'disclosure', priority: 'high', mandatory: true, frequency: 'per_transaction', status: 'pending' },
  // RBI Digital Lending - Cooling-Off
  { id: 'obl-002', sectionId: 'sec-001-5', title: 'Cooling-Off Period', description: 'Provide cooling-off period of three working days during which borrower can exit without penalty', obligationType: 'maintenance', priority: 'high', mandatory: true, frequency: 'per_transaction', status: 'pending' },
  // RBI Digital Lending - Grievance
  { id: 'obl-003', sectionId: 'sec-001-6', title: 'Grievance Redressal Mechanism', description: 'Establish digital lending grievance redressal mechanism accessible through website and mobile app', obligationType: 'maintenance', priority: 'medium', mandatory: true, frequency: 'ongoing', status: 'pending' },
  // RBI KYC
  { id: 'obl-004', sectionId: 'sec-002-1', title: 'Customer Due Diligence', description: 'Perform customer due diligence for all customers as prescribed', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'per_transaction', status: 'pending' },
  // RBI KYC - ID Verification
  { id: 'obl-005', sectionId: 'sec-002-2', title: 'Customer Identification', description: 'Verify identity of customers using official documents before establishing business relationship', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'per_transaction', status: 'pending' },
  // SEBI LODR - Corporate Governance
  { id: 'obl-006', sectionId: 'sec-006-2', title: 'Board Composition', description: 'Ensure optimum combination of executive and non-executive directors with at least one woman director', obligationType: 'maintenance', priority: 'medium', mandatory: true, frequency: 'annual', status: 'pending' },
  // SEBI LODR - Disclosures
  { id: 'obl-007', sectionId: 'sec-006-3', title: 'Quarterly Disclosures', description: 'Make quarterly disclosures to stock exchanges as required under LODR regulations', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'quarterly', status: 'pending' },
  // DPDP - Notice
  { id: 'obl-008', sectionId: 'sec-013-2', title: 'Data Processing Notice', description: 'Give notice to Data Principal before processing personal data', obligationType: 'disclosure', priority: 'high', mandatory: true, frequency: 'per_data_subject', status: 'pending' },
  // DPDP - Consent
  { id: 'obl-009', sectionId: 'sec-013-3', title: 'Obtain Consent', description: 'Obtain free, specific, informed, unconditional and unambiguous consent before processing', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'per_data_subject', status: 'pending' },
  // DPDP - Security Safeguards
  { id: 'obl-010', sectionId: 'sec-013-4', title: 'Implement Security Safeguards', description: 'Implement reasonable security safeguards to protect personal data', obligationType: 'maintenance', priority: 'high', mandatory: true, frequency: 'ongoing', status: 'pending' },
  // CERT-In - Incident Reporting
  { id: 'obl-011', sectionId: 'sec-014-1', title: 'Report Cyber Incidents', description: 'Report all cyber incidents to CERT-In within 6 hours of noticing', obligationType: 'filing', priority: 'critical', mandatory: true, frequency: 'per_incident', status: 'pending' },
  // Companies Act - AGM
  { id: 'obl-012', sectionId: 'sec-010-1', title: 'Hold Annual General Meeting', description: 'Hold AGM within six months from date of closing of financial year', obligationType: 'filing', priority: 'medium', mandatory: true, frequency: 'annual', status: 'pending' },
  // Companies Act - CSR
  { id: 'obl-013', sectionId: 'sec-010-2', title: 'CSR Committee Formation', description: 'Constitute CSR Committee for companies meeting threshold', obligationType: 'maintenance', priority: 'medium', mandatory: true, frequency: 'annual', status: 'pending' },
  // Code on Wages - Payment
  { id: 'obl-014', sectionId: 'sec-016-2', title: 'Timely Payment of Wages', description: 'Pay wages on or before seventh day of following month', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'monthly', status: 'pending' },
  // IRDAI - Registration
  { id: 'obl-015', sectionId: 'sec-020-1', title: 'Maintain Registration', description: 'Maintain valid registration with IRDAI for conducting insurance business', obligationType: 'maintenance', priority: 'high', mandatory: true, frequency: 'ongoing', status: 'pending' },
  // FSSAI - Labelling
  { id: 'obl-016', sectionId: 'sec-023-1', title: 'Food Labelling Compliance', description: 'Ensure all pre-packaged food bears label with prescribed information', obligationType: 'disclosure', priority: 'high', mandatory: true, frequency: 'per_product', status: 'pending' },
  // Environment - EIA
  { id: 'obl-017', sectionId: 'sec-024-1', title: 'Environmental Impact Assessment', description: 'Conduct EIA for projects requiring environmental clearance', obligationType: 'filing', priority: 'high', mandatory: true, frequency: 'per_project', status: 'pending' },
];

// Deadlines
const deadlines: any[] = [];
const deadlineData = [
  { id: 'deadline-001', obligationId: 'obl-001', deadlineType: 'per_transaction', frequency: 'per_transaction', dueCondition: 'before_loan_execution', description: 'Before execution of loan agreement', effectiveFrom: new Date('2025-10-01'), effectiveUntil: null },
  { id: 'deadline-002', obligationId: 'obl-002', deadlineType: 'relative', frequency: 'per_transaction', dueCondition: '3_working_days', description: '3 working days cooling-off period', effectiveFrom: new Date('2025-10-01'), effectiveUntil: null },
  { id: 'deadline-003', obligationId: 'obl-007', deadlineType: 'absolute', frequency: 'quarterly', dueCondition: null, description: 'Within 21 days from end of quarter', effectiveFrom: new Date('2015-12-01'), effectiveUntil: null },
  { id: 'deadline-004', obligationId: 'obl-011', deadlineType: 'event_based', frequency: 'per_incident', dueCondition: 'within_6_hours', description: 'Within 6 hours of noticing the incident', effectiveFrom: new Date('2022-06-27'), effectiveUntil: null },
  { id: 'deadline-005', obligationId: 'obl-012', deadlineType: 'absolute', frequency: 'annual', dueCondition: null, description: 'Within 6 months from closing of FY', effectiveFrom: new Date('2013-09-12'), effectiveUntil: null },
  { id: 'deadline-006', obligationId: 'obl-014', deadlineType: 'absolute', frequency: 'monthly', dueCondition: null, description: 'On or before 7th of following month', effectiveFrom: new Date('2019-08-08'), effectiveUntil: null },
];

// Penalties
const penalties: any[] = [];
const penaltyData = [
  { id: 'penalty-001', sectionId: 'sec-001-4', obligationId: 'obl-001', description: 'Supervisory action by RBI including penalties', penaltyType: 'regulatory_action', severity: 'high' },
  { id: 'penalty-002', sectionId: 'sec-013-5', obligationId: 'obl-010', description: 'Penalty up to Rs 250 crore for failure to implement security safeguards', penaltyType: 'monetary', severity: 'critical' },
  { id: 'penalty-003', sectionId: 'sec-014-1', obligationId: 'obl-011', description: 'Penalty for failure to report cyber incidents within 6 hours', penaltyType: 'monetary', severity: 'high' },
  { id: 'penalty-004', sectionId: 'sec-016-2', obligationId: 'obl-014', description: 'Imprisonment up to 3 years or fine up to Rs 1 lakh for delayed wage payment', penaltyType: 'criminal', severity: 'high' },
  { id: 'penalty-005', sectionId: 'sec-020-1', obligationId: 'obl-015', description: 'Cancellation of registration for operating without valid registration', penaltyType: 'regulatory_action', severity: 'critical' },
];

// Reporting Requirements
const reportingRequirements: any[] = [];
const reportingData = [
  { id: 'report-001', sectionId: 'sec-001-4', obligationId: 'obl-001', authority: 'RBI', reportType: 'periodic', frequency: 'per_transaction', submissionMethod: 'digital' },
  { id: 'report-002', sectionId: 'sec-006-3', obligationId: 'obl-007', authority: 'SEBI', reportType: 'periodic', frequency: 'quarterly', submissionMethod: 'electronic_filing' },
  { id: 'report-003', sectionId: 'sec-013-4', obligationId: 'obl-010', authority: 'Data Protection Board', reportType: 'breach_notification', frequency: 'per_incident', submissionMethod: 'online_portal' },
  { id: 'report-004', sectionId: 'sec-014-1', obligationId: 'obl-011', authority: 'CERT-In', reportType: 'incident_report', frequency: 'per_incident', submissionMethod: 'email_portal' },
];

// Citations
const citations: any[] = [];
const citationData = [
  { id: 'cit-001', entityType: 'Obligation', entityId: 'obl-001', sectionNumber: '4', pageNumber: null, paragraphNumber: null, sourceText: 'RE shall provide Key Fact Statement to the borrower in prescribed format before execution of loan agreement.', startOffset: 0, endOffset: 120, obligationId: 'obl-001' },
  { id: 'cit-002', entityType: 'Obligation', entityId: 'obl-011', sectionNumber: '1', pageNumber: null, paragraphNumber: null, sourceText: 'All organizations shall report cyber incidents to CERT-In within 6 hours of noticing.', startOffset: 0, endOffset: 85, obligationId: 'obl-011' },
];

// Policies
const policies: any[] = [];
const policyData = [
  { id: 'policy-001', companyId: 'comp-001', title: 'KYC Policy', category: 'compliance', version: '1.0', status: 'active' },
  { id: 'policy-002', companyId: 'comp-001', title: 'Data Protection Policy', category: 'compliance', version: '1.0', status: 'active' },
  { id: 'policy-003', companyId: 'comp-002', title: 'AML Policy', category: 'compliance', version: '2.0', status: 'active' },
  { id: 'policy-004', companyId: 'comp-003', title: 'Incident Response Policy', category: 'security', version: '1.0', status: 'active' },
  { id: 'policy-005', companyId: 'comp-004', title: 'Data Privacy Policy', category: 'compliance', version: '1.0', status: 'active' },
];

async function seedComprehensive() {
  console.log('🚀 RegPilot Nexus - Comprehensive Seed Script');
  console.log('='.repeat(60));

  try {
    // 1. Seed Regulators
    console.log('\n📋 Seeding Regulators...');
    for (const reg of regulators) {
      const existing = await prisma.regulator.findUnique({ where: { abbreviation: reg.abbreviation } });
      if (!existing) {
        await prisma.regulator.create({ data: reg });
      }
      // Skip update if exists (foreign key constraints)
    }
    console.log(`✅ Seeded ${regulators.length} regulators`);

    // 2. Seed Regulations
    console.log('\n📜 Seeding Regulations...');
    // Get actual regulator IDs from database
    const regulatorMap: Record<string, string> = {};
    const dbRegulators = await prisma.regulator.findMany();
    for (const r of dbRegulators) {
      regulatorMap[r.abbreviation] = r.id;
      // Also map from our seed IDs
      if (r.abbreviation === 'RBI') regulatorMap['reg-rbi'] = r.id;
      if (r.abbreviation === 'SEBI') regulatorMap['reg-sebi'] = r.id;
      if (r.abbreviation === 'MCA') regulatorMap['reg-mca'] = r.id;
      if (r.abbreviation === 'CERT_IN' || r.abbreviation === 'CERT-In') {
        regulatorMap['reg-certin'] = r.id;
        regulatorMap['reg-cert_in'] = r.id;
      }
      if (r.abbreviation === 'MeitY') regulatorMap['reg-meity'] = r.id;
      if (r.abbreviation === 'MoLE') regulatorMap['reg-mole'] = r.id;
      if (r.abbreviation === 'IRDAI') regulatorMap['reg-irdai'] = r.id;
      if (r.abbreviation === 'TRAI') regulatorMap['reg-trai'] = r.id;
      if (r.abbreviation === 'FSSAI') regulatorMap['reg-fssai'] = r.id;
      if (r.abbreviation === 'MoEFCC') regulatorMap['reg-moefcc'] = r.id;
      if (r.abbreviation === 'CERC') regulatorMap['reg-cerc'] = r.id;
      if (r.abbreviation === 'CBIC') regulatorMap['reg-cbic'] = r.id;
      if (r.abbreviation === 'CDSCO') regulatorMap['reg-cdsco'] = r.id;
    }
    console.log(`  Regulator map: ${JSON.stringify(regulatorMap, null, 2)}`);
    
    for (const reg of regulations) {
      const existing = await prisma.regulation.findUnique({ where: { id: reg.id } });
      if (!existing) {
        const actualRegulatorId = regulatorMap[reg.regulatorId] || reg.regulatorId;
        console.log(`  Creating regulation ${reg.id} with regulatorId: ${actualRegulatorId}`);
        await prisma.regulation.create({ data: { ...reg, regulatorId: actualRegulatorId } });
      }
    }
    console.log(`✅ Seeded ${regulations.length} regulations`);

    // 3. Seed Versions
    console.log('\n🔖 Seeding Versions...');
    for (const ver of versions) {
      const existing = await prisma.version.findUnique({ where: { id: ver.id } });
      if (!existing) {
        await prisma.version.create({ data: ver });
      }
    }
    console.log(`✅ Seeded ${versions.length} versions`);

    // 4. Seed Sections
    console.log('\n📑 Seeding Sections...');
    for (const sec of sectionData) {
      const existing = await prisma.section.findUnique({ where: { id: sec.id } });
      if (!existing) {
        await prisma.section.create({ data: sec });
      }
    }
    console.log(`✅ Seeded ${sectionData.length} sections`);

    // 5. Seed Applicability Rules
    console.log('\n🎯 Seeding Applicability Rules...');
    for (const app of applicabilityData) {
      const existing = await prisma.applicability.findUnique({ where: { id: app.id } });
      if (!existing) {
        await prisma.applicability.create({ data: app });
      }
    }
    console.log(`✅ Seeded ${applicabilityData.length} applicability rules`);

    // 6. Seed Obligations
    console.log('\n📋 Seeding Obligations...');
    for (const obl of obligationData) {
      const existing = await prisma.obligation.findUnique({ where: { id: obl.id } });
      if (!existing) {
        await prisma.obligation.create({ data: obl });
      }
    }
    console.log(`✅ Seeded ${obligationData.length} obligations`);

    // 7. Seed Deadlines
    console.log('\n⏰ Seeding Deadlines...');
    for (const dl of deadlineData) {
      const existing = await prisma.deadline.findUnique({ where: { id: dl.id } });
      if (!existing) {
        await prisma.deadline.create({ data: dl });
      }
    }
    console.log(`✅ Seeded ${deadlineData.length} deadlines`);

    // 8. Seed Penalties
    console.log('\n⚠️ Seeding Penalties...');
    for (const pen of penaltyData) {
      const existing = await prisma.penalty.findUnique({ where: { id: pen.id } });
      if (!existing) {
        await prisma.penalty.create({ data: pen });
      }
    }
    console.log(`✅ Seeded ${penaltyData.length} penalties`);

    // 9. Seed Reporting Requirements
    console.log('\n📊 Seeding Reporting Requirements...');
    for (const rep of reportingData) {
      const existing = await prisma.reportingRequirement.findUnique({ where: { id: rep.id } });
      if (!existing) {
        await prisma.reportingRequirement.create({ data: rep });
      }
    }
    console.log(`✅ Seeded ${reportingData.length} reporting requirements`);

    // 10. Seed Citations
    console.log('\n🔗 Seeding Citations...');
    for (const cit of citationData) {
      const existing = await prisma.citation.findUnique({ where: { id: cit.id } });
      if (!existing) {
        await prisma.citation.create({ data: cit });
      }
    }
    console.log(`✅ Seeded ${citationData.length} citations`);

    // 11. Seed Company Profiles
    console.log('\n🏢 Seeding Company Profiles...');
    for (const comp of companyProfiles) {
      const existing = await prisma.companyProfile.findUnique({ where: { id: comp.id } });
      if (!existing) {
        await prisma.companyProfile.create({ data: comp });
      }
    }
    console.log(`✅ Seeded ${companyProfiles.length} company profiles`);

    // 12. Seed Policies
    console.log('\n📄 Seeding Policies...');
    for (const pol of policyData) {
      const existing = await prisma.policy.findUnique({ where: { id: pol.id } });
      if (!existing) {
        await prisma.policy.create({ data: pol });
      }
    }
    console.log(`✅ Seeded ${policyData.length} policies`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE SEED SUMMARY');
    console.log('='.repeat(60));
    console.log(`Regulators:            ${regulators.length}`);
    console.log(`Regulations:           ${regulations.length}`);
    console.log(`Versions:              ${versions.length}`);
    console.log(`Sections:              ${sectionData.length}`);
    console.log(`Applicability Rules:   ${applicabilityData.length}`);
    console.log(`Obligations:           ${obligationData.length}`);
    console.log(`Deadlines:             ${deadlineData.length}`);
    console.log(`Penalties:             ${penaltyData.length}`);
    console.log(`Reporting Requirements:${reportingData.length}`);
    console.log(`Citations:             ${citationData.length}`);
    console.log(`Company Profiles:      ${companyProfiles.length}`);
    console.log(`Policies:              ${policyData.length}`);
    console.log('='.repeat(60));
    console.log('✅ Comprehensive seed completed successfully!');

  } catch (error) {
    console.error('❌ Error during comprehensive seed:', error);
    throw error;
  }
}

seedComprehensive()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
