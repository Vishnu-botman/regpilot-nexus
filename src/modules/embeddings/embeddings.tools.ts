import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { EmbeddingsService } from './embeddings.service.js';

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

  @Tool({
    name: 'get_regulation_embeddings',
    description: 'Get stored embeddings for a regulation',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
    })
  })
  async getRegulationEmbeddings(input: { regulationId: string }) {
    const chunks = await this.embeddingsService.getChunksByRegulation(input.regulationId);
    return {
      regulationId: input.regulationId,
      chunks: chunks.map(c => ({
        id: c.id,
        chunkIndex: c.chunkIndex,
        content: c.content.substring(0, 200) + '...',
        hasEmbedding: true,
      })),
      total: chunks.length,
    };
  }

  @Tool({
    name: 'delete_regulation_embeddings',
    description: 'Delete all embeddings for a regulation',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
    })
  })
  async deleteRegulationEmbeddings(input: { regulationId: string }) {
    const result = await this.embeddingsService.deleteChunksByRegulation(input.regulationId);
    return {
      regulationId: input.regulationId,
      deleted: result.count,
    };
  }
}
