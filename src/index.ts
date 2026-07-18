import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  process.env.MCP_TRANSPORT_TYPE = process.env.MCP_TRANSPORT_TYPE || 'dual';
  process.env.PORT = process.env.PORT || '3002';

  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

bootstrap().catch((error) => {
  console.error('Failed to start RegPilot Nexus:', error);
  process.exit(1);
});
