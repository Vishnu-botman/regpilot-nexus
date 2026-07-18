import { Injectable } from '@nitrostack/core';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class KnowledgeRepository {
  async searchSimilar(queryEmbedding: number[], options: {
    regulationId?: string;
    limit?: number;
  } = {}) {
    const { regulationId, limit = 5 } = options;

    let sql = `
      SELECT
        vc.id,
        vc.regulation_id,
        vc.chunk_index,
        vc.content,
        vc.metadata,
        r.title as regulation_title,
        rv.version_number,
        (vc.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as distance
      FROM vector_chunks vc
      JOIN regulations r ON r.id = vc.regulation_id
      JOIN versions rv ON rv.id = (
        SELECT id FROM versions
        WHERE regulation_id = vc.regulation_id
        ORDER BY publication_date DESC
        LIMIT 1
      )
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (regulationId) {
      conditions.push(`vc.regulation_id = $${paramIndex}`);
      params.push(regulationId);
      paramIndex++;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY vc.embedding <=> ${JSON.stringify(queryEmbedding)}::vector ASC LIMIT $${paramIndex}`;
    params.push(limit);

    const results = await prisma.$queryRawUnsafe(sql, ...params) as any[];
    return results;
  }

  async getChunksByRegulation(regulationId: string) {
    return prisma.vectorChunk.findMany({
      where: { regulationId },
      orderBy: { chunkIndex: 'asc' },
      select: {
        id: true,
        chunkIndex: true,
        content: true,
        metadata: true,
      },
    });
  }

  async getChunksBySection(regulationId: string, sectionNumber: string) {
    return prisma.vectorChunk.findMany({
      where: {
        regulationId,
        metadata: {
          path: ['sectionNumber'],
          equals: sectionNumber,
        },
      },
      orderBy: { chunkIndex: 'asc' },
      select: {
        id: true,
        chunkIndex: true,
        content: true,
        metadata: true,
      },
    });
  }

  async getChunkStats() {
    const total = await prisma.vectorChunk.count();
    const withEmbeddingsResult = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*) as count FROM vector_chunks WHERE embedding IS NOT NULL`
    );
    const withEmbeddings = Number(withEmbeddingsResult[0].count);

    const byRegulation = await prisma.vectorChunk.groupBy({
      by: ['regulationId'],
      _count: { id: true },
    });

    return {
      total,
      withEmbeddings,
      withoutEmbeddings: total - withEmbeddings,
      byRegulation: byRegulation.map(r => ({
        regulationId: r.regulationId,
        chunkCount: r._count.id,
      })),
    };
  }
}
