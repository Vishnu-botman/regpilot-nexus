export type RegulatorySource = 'rbi' | 'sebi' | 'mca' | 'cert_in';

export interface DiscoveredDocument {
  source: RegulatorySource;
  title: string;
  url: string;
  publishedDate: Date;
  documentType: string;
  regulationNumber?: string;
  summary?: string;
  sourceHash: string;
}

export interface MonitorResult {
  source: RegulatorySource;
  success: boolean;
  documentsFound: number;
  newDocuments: DiscoveredDocument[];
  updatedDocuments: DiscoveredDocument[];
  error?: string;
  checkedAt: Date;
}

export interface SourceConfig {
  name: string;
  baseUrl: string;
  feedUrl: string;
  documentType: string;
  enabled: boolean;
}

export const SOURCE_CONFIGS: Record<RegulatorySource, SourceConfig> = {
  rbi: {
    name: 'Reserve Bank of India',
    baseUrl: 'https://www.rbi.org.in',
    feedUrl: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
    documentType: 'master_direction',
    enabled: true,
  },
  sebi: {
    name: 'Securities and Exchange Board of India',
    baseUrl: 'https://www.sebi.gov.in',
    feedUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doRecognisedFpi=yes&intmId=33',
    documentType: 'notification',
    enabled: true,
  },
  mca: {
    name: 'Ministry of Corporate Affairs',
    baseUrl: 'https://www.mca.gov.in',
    feedUrl: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks.html',
    documentType: 'notification',
    enabled: true,
  },
  cert_in: {
    name: 'Indian Computer Emergency Response Team',
    baseUrl: 'https://www.cert-in.org.in',
    feedUrl: 'https://www.cert-in.org.in/site/page/2f5fd5fa-e078-4fa2-a79d-2df9d70fd99b',
    documentType: 'advisory',
    enabled: true,
  },
};
