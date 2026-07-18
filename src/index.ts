import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Dual transport: MCP HTTP server on port 3000 (or override with PORT env var)
  // NitroStudio connects via: http://localhost:3000/sse (legacy) or /mcp (streamable)
  process.env.MCP_TRANSPORT_TYPE = 'stdio';
  process.env.PORT = process.env.PORT || '3000';
  process.env.MCP_SERVER_HOST = process.env.MCP_SERVER_HOST || '0.0.0.0';
  process.env.MCP_BASE_PATH = process.env.MCP_BASE_PATH || '/mcp';

  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

bootstrap().catch((error) => {
  console.error('Failed to start RegPilot Nexus:', error);
  process.exit(1);
});
