export interface EmbeddingChunk {
  content: string;
  metadata: Record<string, any>;
  chunkIndex: number;
}

export interface EmbeddingResult {
  chunkId: string;
  embedding: number[];
  content: string;
}

export interface EmbeddingConfig {
  model: string;
  dimensions: number;
  chunkSize: number;
  chunkOverlap: number;
}

export const DEFAULT_EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'text-embedding-3-small',
  dimensions: 1536,
  chunkSize: 1000,
  chunkOverlap: 200,
};

export interface PipelineResult {
  regulationId: string;
  chunksCreated: number;
  embeddingsGenerated: number;
  success: boolean;
  error?: string;
}
