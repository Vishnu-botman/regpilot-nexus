import { Injectable } from '@nitrostack/core';
import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import {
  SchedulerJobConfig,
  SchedulerJobStatus,
  SchedulerConfig,
  DEFAULT_SCHEDULER_CONFIG,
  RegulatorySource,
} from './scheduler.types.js';

export type JobHandler = (source: RegulatorySource) => Promise<{
  success: boolean;
  documentsFound: number;
  error?: string;
}>;

@Injectable()
export class SchedulerService {
  private jobs: Map<string, ScheduledTask> = new Map();
  private jobStatus: Map<string, SchedulerJobStatus> = new Map();
  private handlers: Map< RegulatorySource, JobHandler> = new Map();
  private config: SchedulerConfig;

  constructor(config?: Partial<SchedulerConfig>) {
    this.config = config?.jobs
      ? { jobs: config.jobs }
      : DEFAULT_SCHEDULER_CONFIG;

    for (const job of this.config.jobs) {
      this.jobStatus.set(job.id, {
        id: job.id,
        name: job.name,
        source: job.source,
        cronExpression: job.cronExpression,
        enabled: job.enabled,
        running: false,
        runCount: 0,
      });
    }
  }

  registerHandler(source: RegulatorySource, handler: JobHandler) {
    this.handlers.set(source, handler);
  }

  start() {
    for (const job of this.config.jobs) {
      if (!job.enabled) continue;
      this.startJob(job);
    }
  }

  stop() {
    for (const [id, task] of this.jobs) {
      task.stop();
      this.jobs.delete(id);
    }
  }

  startJob(job: SchedulerJobConfig) {
    if (this.jobs.has(job.id)) {
      this.stopJob(job.id);
    }

    if (!cron.validate(job.cronExpression)) {
      console.error(`[Scheduler] Invalid cron expression for ${job.id}: ${job.cronExpression}`);
      return;
    }

    const task = cron.schedule(job.cronExpression, async () => {
      await this.executeJob(job);
    }, {
      timezone: 'Asia/Kolkata',
    });

    this.jobs.set(job.id, task);

    const status = this.jobStatus.get(job.id);
    if (status) {
      status.enabled = true;
    }

    console.log(`[Scheduler] Started job ${job.id} (${job.name}) - ${job.cronExpression}`);
  }

  stopJob(jobId: string) {
    const task = this.jobs.get(jobId);
    if (task) {
      task.stop();
      this.jobs.delete(jobId);
    }

    const status = this.jobStatus.get(jobId);
    if (status) {
      status.enabled = false;
    }
  }

  async executeJob(job: SchedulerJobConfig): Promise<{
    success: boolean;
    documentsFound: number;
    error?: string;
  }> {
    const status = this.jobStatus.get(job.id);
    if (!status) {
      return { success: false, documentsFound: 0, error: 'Job not found' };
    }

    if (status.running) {
      console.log(`[Scheduler] Job ${job.id} already running, skipping`);
      return { success: false, documentsFound: 0, error: 'Already running' };
    }

    const handler = this.handlers.get(job.source);
    if (!handler) {
      console.log(`[Scheduler] No handler registered for source: ${job.source}`);
      return { success: false, documentsFound: 0, error: 'No handler registered' };
    }

    status.running = true;
    status.lastRun = new Date();
    const startTime = Date.now();

    console.log(`[Scheduler] Executing job ${job.id} (${job.name})`);

    try {
      const result = await handler(job.source);
      status.lastDuration = Date.now() - startTime;
      status.runCount++;

      if (result.success) {
        console.log(`[Scheduler] Job ${job.id} completed - ${result.documentsFound} documents found`);
      } else {
        status.lastError = result.error;
        console.error(`[Scheduler] Job ${job.id} failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      status.lastDuration = Date.now() - startTime;
      status.lastError = error instanceof Error ? error.message : String(error);
      status.runCount++;

      console.error(`[Scheduler] Job ${job.id} error:`, error);
      return {
        success: false,
        documentsFound: 0,
        error: status.lastError,
      };
    } finally {
      status.running = false;
    }
  }

  getStatus(): SchedulerJobStatus[] {
    return Array.from(this.jobStatus.values());
  }

  getJobStatus(jobId: string): SchedulerJobStatus | undefined {
    return this.jobStatus.get(jobId);
  }

  async triggerJob(jobId: string) {
    const job = this.config.jobs.find(j => j.id === jobId);
    if (!job) {
      return { success: false, error: `Job not found: ${jobId}` };
    }
    return this.executeJob(job);
  }

  updateJobSchedule(jobId: string, cronExpression: string) {
    if (!cron.validate(cronExpression)) {
      return { success: false, error: 'Invalid cron expression' };
    }

    const job = this.config.jobs.find(j => j.id === jobId);
    if (!job) {
      return { success: false, error: `Job not found: ${jobId}` };
    }

    job.cronExpression = cronExpression;

    const status = this.jobStatus.get(jobId);
    if (status) {
      status.cronExpression = cronExpression;
    }

    if (this.jobs.has(jobId)) {
      this.stopJob(jobId);
      this.startJob(job);
    }

    return { success: true };
  }
}
