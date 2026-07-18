import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { EmbeddingsService } from './embeddings.service.js';

@Injectable({ deps: [EmbeddingsService] })
export class EmbeddingsTools {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Tool({
    name: 'chunk_and_embed',
    description: 'Chunk regulation text and generate embeddings for semantic search',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
      text: z.string().describe('Regulation text to process'),
      metadata: z.record(z.any()).optional().describe('Additional metadata'),
    })
  })
  async chunkAndEmbed(input: { regulationId: string; text: string; metadata?: Record<string, any> }) {
    const result = await this.embeddingsService.processRegulation(
      input.regulationId,
      input.text,
      input.metadata || {}
    );
    return result;
  }
}
