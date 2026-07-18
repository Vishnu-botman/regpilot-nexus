import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { SchedulerService } from './scheduler.service.js';

@Injectable({ deps: [SchedulerService] })
export class SchedulerTools {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Tool({
    name: 'get_scheduler_status',
    description: 'Get the status of all scheduled monitoring jobs',
    inputSchema: z.object({})
  })
  async getSchedulerStatus() {
    return { jobs: this.schedulerService.getStatus() };
  }

  @Tool({
    name: 'trigger_monitoring_job',
    description: 'Manually trigger a regulatory monitoring job',
    inputSchema: z.object({
      jobId: z.string().describe('Job ID (e.g., monitor-rbi, monitor-sebi)'),
    })
  })
  async triggerMonitoringJob(input: { jobId: string }) {
    return this.schedulerService.triggerJob(input.jobId);
  }

  @Tool({
    name: 'update_job_schedule',
    description: 'Update the cron schedule for a monitoring job',
    inputSchema: z.object({
      jobId: z.string().describe('Job ID'),
      cronExpression: z.string().describe('New cron expression (e.g., "0 6 * * *")'),
    })
  })
  async updateJobSchedule(input: { jobId: string; cronExpression: string }) {
    return this.schedulerService.updateJobSchedule(input.jobId, input.cronExpression);
  }

  @Tool({
    name: 'start_scheduler',
    description: 'Start all enabled monitoring jobs',
    inputSchema: z.object({})
  })
  async startScheduler() {
    this.schedulerService.start();
    return { success: true, jobs: this.schedulerService.getStatus() };
  }

  @Tool({
    name: 'stop_scheduler',
    description: 'Stop all monitoring jobs',
    inputSchema: z.object({})
  })
  async stopScheduler() {
    this.schedulerService.stop();
    return { success: true };
  }
}
