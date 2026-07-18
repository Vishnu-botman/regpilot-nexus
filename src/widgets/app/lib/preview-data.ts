export const actionPlanPreviewData = {
  actionPlan: {
    regulation: 'Digital Lending Directions, 2025',
    grouped: {
      immediate: [
        {
          obligationId: 'obl-001',
          title: 'Provide clear disclosure of loan terms',
          description: 'Disclose all fees, interest calculations, and recovery processes.',
          priority: 'high',
          mandatory: true,
          frequency: 'Immediate',
          regulation: 'Digital Lending Directions, 2025',
          regulator: 'RBI',
          deadlines: [{ description: 'Submit disclosure update', type: 'submission' }],
          reportingRequirements: [{ authority: 'RBI', reportType: 'Disclosure Review', frequency: 'Quarterly' }],
        },
      ],
      scheduled: [
        {
          obligationId: 'obl-002',
          title: 'Submit quarterly compliance report',
          description: 'File the compliance report with the designated regulator.',
          priority: 'medium',
          mandatory: true,
          frequency: 'Quarterly',
          regulation: 'Digital Lending Directions, 2025',
          regulator: 'RBI',
          deadlines: [{ description: 'Quarterly reporting due', type: 'reporting' }],
          reportingRequirements: [{ authority: 'RBI', reportType: 'Compliance Report', frequency: 'Quarterly' }],
        },
      ],
      monitored: [
        {
          obligationId: 'obl-003',
          title: 'Log customer grievance tickets',
          description: 'Maintain a traceable grievance log for all service complaints.',
          priority: 'low',
          mandatory: false,
          frequency: 'Monthly',
          regulation: 'Digital Lending Directions, 2025',
          regulator: 'RBI',
          deadlines: [{ description: 'Monthly review checkpoint', type: 'monitoring' }],
          reportingRequirements: [{ authority: 'RBI', reportType: 'Grievance Log', frequency: 'Monthly' }],
        },
      ],
    },
    summary: {
      total: 3,
      mandatory: 2,
      highPriority: 1,
      immediate: 1,
      scheduled: 1,
      monitored: 1,
    },
  },
};

export const applicabilityPreviewData = {
  applicable: true,
  confidence: 'high',
  reasons: ['Matched Section 4 via industry: fintech, entityType: nbfc'],
  matchingApplicabilities: [
    {
      sectionNumber: '4',
      sectionTitle: 'Applicability',
      description: 'This direction applies to all digital lending entities',
      operator: 'includes',
      matchedFields: ['industry: fintech', 'entityType: nbfc'],
    },
  ],
};

export const compliancePreviewData = {
  company: {
    id: 'comp-001',
    name: 'Acme Fintech Solutions Pvt Ltd',
    industry: 'fintech',
    entityType: 'nbfc',
  },
  summary: {
    total: 2,
    pending: 2,
    mandatory: 2,
    overdue: 0,
    byType: [
      { type: 'disclosure', count: 1 },
      { type: 'reporting', count: 1 },
    ],
    byPriority: [
      { priority: 'high', count: 1 },
      { priority: 'medium', count: 1 },
    ],
  },
  obligations: [
    {
      id: 'obl-001',
      title: 'Provide clear disclosure of loan terms',
      obligationType: 'disclosure',
      priority: 'high',
      mandatory: true,
      status: 'pending',
      regulation: 'Digital Lending Directions, 2025',
      regulator: 'RBI',
      sectionNumber: '4',
      sectionTitle: 'Applicability',
      deadlines: [{ type: 'submission', description: 'Compliance by May 2027' }],
    },
    {
      id: 'obl-002',
      title: 'Submit quarterly compliance report',
      obligationType: 'reporting',
      priority: 'medium',
      mandatory: true,
      status: 'pending',
      regulation: 'Cyber Security Framework',
      regulator: 'CERT_IN',
      sectionNumber: '3',
      sectionTitle: 'Reporting',
      deadlines: [{ type: 'reporting', description: 'Quarterly by Sep 2026' }],
    },
  ],
};

export const regulationPreviewData = {
  regulations: [
    {
      id: 'reg-rbi-001',
      title: 'Digital Lending Directions, 2025',
      regulationNumber: 'RBI/DPSS/2025/01',
      documentType: 'master_direction',
      status: 'active',
      effectiveDate: '2025-01-01',
      regulator: 'RBI',
      latestVersion: 'v1.1',
      sections: [
        {
          sectionNumber: '3.2',
          title: 'Disclosure requirements',
          content: 'Lenders must clearly disclose all fees, charges, and recovery terms before disbursal.',
        },
      ],
      versions: [
        { versionNumber: '1.1', effectiveDate: '2025-01-01', status: 'active' },
      ],
    },
  ],
  total: 1,
};
