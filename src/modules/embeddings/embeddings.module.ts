import { Module } from '@nitrostack/core';
import { EmbeddingsTools } from './embeddings.tools.js';
import { EmbeddingsService } from './embeddings.service.js';

@Module({
  name: 'embeddings',
  description: 'Text chunking and embedding generation for semantic search',
  imports: [],
  controllers: [EmbeddingsTools],
  providers: [
    EmbeddingsService,
  ],
  exports: [
    EmbeddingsService,
  ]
})
export class EmbeddingsModule {}
