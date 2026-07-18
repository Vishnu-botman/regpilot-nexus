import { Module } from '@nitrostack/core';
import { KnowledgeTools } from './knowledge.tools.js';
import { KnowledgeRepository } from './knowledge.repository.js';
import { EmbeddingsModule } from '../embeddings/embeddings.module.js';

@Module({
  name: 'knowledge',
  description: 'Vector search and semantic retrieval over regulation chunks',
  imports: [
    EmbeddingsModule,
  ],
  controllers: [
    KnowledgeTools,
  ],
  providers: [
    KnowledgeRepository,
  ],
  exports: [
    KnowledgeRepository,
  ]
})
export class KnowledgeModule {}
