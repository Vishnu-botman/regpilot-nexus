import { Module } from '@nitrostack/core';
import { MonitorTools } from './monitor.tools.js';
import { MonitorService } from './monitor.service.js';

@Module({
  name: 'monitor',
  description: 'Regulatory source monitoring and document discovery',
  imports: [],
  controllers: [MonitorTools],
  providers: [
    MonitorService,
  ],
  exports: [
    MonitorService,
  ]
})
export class MonitorModule {}
