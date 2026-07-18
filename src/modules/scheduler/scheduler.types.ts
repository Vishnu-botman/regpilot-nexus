export type RegulatorySource = 'rbi' | 'sebi' | 'mca' | 'cert_in';

export interface SchedulerJobConfig {
  id: string;
  name: string;
  source: RegulatorySource;
  cronExpression: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface SchedulerJobStatus {
  id: string;
  name: string;
  source: RegulatorySource;
  cronExpression: string;
  enabled: boolean;
  running: boolean;
  lastRun?: Date;
  lastDuration?: number;
  lastError?: string;
  runCount: number;
}

export interface SchedulerConfig {
  jobs: SchedulerJobConfig[];
}

export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  jobs: [
    {
      id: 'monitor-rbi',
      name: 'RBI Regulatory Monitor',
      source: 'rbi',
      cronExpression: '0 6 * * *', // Daily at 6 AM IST
      enabled: true,
    },
    {
      id: 'monitor-sebi',
      name: 'SEBI Regulatory Monitor',
      source: 'sebi',
      cronExpression: '0 7 * * *', // Daily at 7 AM IST
      enabled: true,
    },
    {
      id: 'monitor-mca',
      name: 'MCA Regulatory Monitor',
      source: 'mca',
      cronExpression: '0 8 * * 1-5', // Weekdays at 8 AM IST
      enabled: true,
    },
    {
      id: 'monitor-cert-in',
      name: 'CERT-In Advisory Monitor',
      source: 'cert_in',
      cronExpression: '0 9 * * *', // Daily at 9 AM IST
      enabled: true,
    },
  ],
};
