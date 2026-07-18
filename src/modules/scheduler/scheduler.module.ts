import { Module } from '@nitrostack/core';
import { SchedulerTools } from './scheduler.tools.js';
import { SchedulerService } from './scheduler.service.js';

@Module({
  name: 'scheduler',
  description: 'Cron-based regulatory source monitoring scheduler',
  imports: [],
  controllers: [SchedulerTools],
  providers: [
    SchedulerService,
  ],
  exports: [
    SchedulerService,
  ]
})
export class SchedulerModule {}
