import { Injectable } from '@nitrostack/core';
import { PrismaClient } from '@prisma/client';
import {
  EmbeddingChunk,
  EmbeddingResult,
  EmbeddingConfig,
  DEFAULT_EMBEDDING_CONFIG,
  PipelineResult,
} from './embeddings.types.js';

const prisma = new PrismaClient();

@Injectable()
export class EmbeddingsService {
  private config: EmbeddingConfig;
  private apiKey: string;

  constructor(config?: Partial<EmbeddingConfig>) {
    this.config = { ...DEFAULT_EMBEDDING_CONFIG, ...config };
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  chunkText(text: string, metadata: Record<string, any> = {}): EmbeddingChunk[] {
    const chunks: EmbeddingChunk[] = [];
    const words = text.split(' ');
    let currentChunk: string[] = [];
    let chunkIndex = 0;

    for (const word of words) {
      currentChunk.push(word);

      if (currentChunk.join(' ').length >= this.config.chunkSize) {
        chunks.push({
          content: currentChunk.join(' '),
          metadata: { ...metadata, chunkIndex },
          chunkIndex,
        });
        chunkIndex++;

        // Overlap: keep last N words
        const overlapWords = Math.floor(this.config.chunkOverlap / 5);
        currentChunk = currentChunk.slice(-overlapWords);
      }
    }

    // Remaining content
    if (currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join(' '),
        metadata: { ...metadata, chunkIndex },
        chunkIndex,
      });
    }

    return chunks;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      console.error(`[Embeddings] No OpenAI API key configured, using mock embedding`);
      return new Array(this.config.dimensions).fill(0).map(() => Math.random());
    }

    try {
      return await this.generateOpenAIEmbedding(text);
    } catch (error) {
      console.error(`[Embeddings] Error generating embedding:`, error);
      // Fallback to mock embedding on error
      return new Array(this.config.dimensions).fill(0).map(() => Math.random());
    }
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: this.config.dimensions,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data: any = await response.json();
    return data.data[0].embedding;
  }

  async storeChunks(
    regulationId: string,
    chunks: EmbeddingChunk[]
  ): Promise<PipelineResult> {
    let chunksCreated = 0;
    let embeddingsGenerated = 0;

    try {
      for (const chunk of chunks) {
        const embedding = await this.generateEmbedding(chunk.content);
        
        // Use raw SQL because Prisma doesn't support the vector type directly
        await prisma.$executeRaw`
          INSERT INTO vector_chunks (id, regulation_id, chunk_index, content, embedding, metadata, created_at)
          VALUES (gen_random_uuid(), ${regulationId}, ${chunk.chunkIndex}, ${chunk.content}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify(chunk.metadata)}::jsonb, NOW())
        `;

        chunksCreated++;
        embeddingsGenerated++;
      }

      return {
        regulationId,
        chunksCreated,
        embeddingsGenerated,
        success: true,
      };
    } catch (error) {
      return {
        regulationId,
        chunksCreated,
        embeddingsGenerated,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async processRegulation(
    regulationId: string,
    text: string,
    metadata: Record<string, any> = {}
  ): Promise<PipelineResult> {
    console.error(`[Embeddings] Processing regulation ${regulationId}`);

    // Chunk the text
    const chunks = this.chunkText(text, {
      ...metadata,
      regulationId,
    });

    console.error(`[Embeddings] Created ${chunks.length} chunks`);

    // Store chunks with embeddings
    const result = await this.storeChunks(regulationId, chunks);

    console.error(`[Embeddings] Stored ${result.chunksCreated} chunks, generated ${result.embeddingsGenerated} embeddings`);

    return result;
  }

  async getChunksByRegulation(regulationId: string) {
    return prisma.vectorChunk.findMany({
      where: { regulationId },
      orderBy: { chunkIndex: 'asc' },
    });
  }

  async deleteChunksByRegulation(regulationId: string) {
    return prisma.vectorChunk.deleteMany({
      where: { regulationId },
    });
  }
}
