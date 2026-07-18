import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { KnowledgeRepository } from './knowledge.repository.js';
import { EmbeddingsService } from '../embeddings/embeddings.service.js';

export class KnowledgeTools {
  constructor(
    private readonly repo: KnowledgeRepository,
    private readonly embeddingsService: EmbeddingsService
  ) {}

  @Tool({
    name: 'search_knowledge',
    description: 'Search regulation content using semantic vector similarity (pgvector)',
    inputSchema: z.object({
      query: z.string().describe('Natural language search query'),
      regulationId: z.string().optional().describe('Limit search to specific regulation'),
      limit: z.number().optional().default(5).describe('Max results to return'),
    })
  })
  async searchKnowledge(input: { query: string; regulationId?: string; limit?: number }) {
    const stats = await this.repo.getChunkStats();

    if (stats.withEmbeddings === 0) {
      return {
        results: [],
        notice: 'No embeddings available. Run the embedding pipeline to enable semantic search.',
        stats: {
          totalChunks: stats.total,
          withEmbeddings: stats.withEmbeddings,
        },
      };
    }

    const queryEmbedding = await this.embeddingsService.generateEmbedding(input.query);

    const results = await this.repo.searchSimilar(queryEmbedding, {
      regulationId: input.regulationId,
      limit: input.limit || 5,
    });

    return {
      results: results.map((r: any) => ({
        id: r.id,
        regulationId: r.regulation_id,
        regulationTitle: r.regulation_title,
        chunkIndex: r.chunk_index,
        content: r.content,
        metadata: r.metadata,
        distance: r.distance,
      })),
      total: results.length,
    };
  }

  @Tool({
    name: 'semantic_search',
    description: 'Search regulation content using semantic vector similarity (pgvector)',
    inputSchema: z.object({
      query: z.string().describe('Natural language search query'),
      regulationId: z.string().optional().describe('Limit search to specific regulation'),
      limit: z.number().optional().default(5).describe('Max results to return'),
    })
  })
  async semanticSearch(input: { query: string; regulationId?: string; limit?: number }) {
    return this.searchKnowledge(input);
  }

  @Tool({
    name: 'get_regulation_chunks',
    description: 'Get text chunks from a regulation for detailed review',
    inputSchema: z.object({
      regulationId: z.string().describe('Regulation ID'),
      sectionNumber: z.string().optional().describe('Filter by section number'),
    })
  })
  async getRegulationChunks(input: { regulationId: string; sectionNumber?: string }) {
    const chunks = input.sectionNumber
      ? await this.repo.getChunksBySection(input.regulationId, input.sectionNumber)
      : await this.repo.getChunksByRegulation(input.regulationId);

    return {
      chunks: chunks.map(c => ({
        id: c.id,
        chunkIndex: c.chunkIndex,
        content: c.content,
        metadata: c.metadata,
      })),
      total: chunks.length,
    };
  }
}
