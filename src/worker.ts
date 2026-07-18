import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { SchedulerService } from './modules/scheduler/scheduler.service.js';
import { MonitorService } from './modules/monitor/monitor.service.js';
import { ParserService } from './modules/parser/parser.service.js';
import { ExtractorService } from './modules/extractor/extractor.service.js';
import { EmbeddingsService } from './modules/embeddings/embeddings.service.js';

async function startWorker() {
  console.log('🚀 Starting RegPilot Ingestion Worker...');

  const prisma = new PrismaClient();
  const embeddingsService = new EmbeddingsService();
  const parserService = new ParserService();
  const extractorService = new ExtractorService();
  const monitorService = new MonitorService();

  // Instantiate scheduler service
  const schedulerService = new SchedulerService();

  // Wire up the monitor check handler for the worker
  schedulerService.registerHandler('rbi', async (source) => {
    return runIngestionPipeline(source, monitorService, parserService, extractorService, embeddingsService, prisma);
  });
  schedulerService.registerHandler('sebi', async (source) => {
    return runIngestionPipeline(source, monitorService, parserService, extractorService, embeddingsService, prisma);
  });
  schedulerService.registerHandler('mca', async (source) => {
    return runIngestionPipeline(source, monitorService, parserService, extractorService, embeddingsService, prisma);
  });
  schedulerService.registerHandler('cert_in', async (source) => {
    return runIngestionPipeline(source, monitorService, parserService, extractorService, embeddingsService, prisma);
  });

  // Start the scheduler
  schedulerService.start();

  console.log('✅ RegPilot Ingestion Worker started and scheduler jobs activated.');

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('Stopping worker...');
    schedulerService.stop();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    console.log('Stopping worker...');
    schedulerService.stop();
    process.exit(0);
  });
}

// Full background Ingestion Pipeline:
// Monitor -> Parse -> Extract -> Save to DB -> Chunk & Embed -> Save Chunks
async function runIngestionPipeline(
  source: any,
  monitorService: MonitorService,
  parserService: ParserService,
  extractorService: ExtractorService,
  embeddingsService: EmbeddingsService,
  prisma: PrismaClient
) {
  console.log(`[Worker Pipeline] Checking source: ${source}`);
  const monitorResult = await monitorService.checkSource(source);

  if (!monitorResult.success) {
    console.error(`[Worker Pipeline] Monitor failed for ${source}:`, monitorResult.error);
    return { success: false, documentsFound: 0, error: monitorResult.error };
  }

  const allDocs = [...monitorResult.newDocuments, ...monitorResult.updatedDocuments];
  console.log(`[Worker Pipeline] Found ${allDocs.length} new/updated documents for ${source}`);

  let processedCount = 0;

  for (const doc of allDocs) {
    try {
      console.log(`[Worker Pipeline] Ingesting document: ${doc.title} (${doc.url})`);

      // 1. Fetch full content
      let docContent = '';
      try {
        const response = await fetch(doc.url);
        if (response.ok) {
          docContent = await response.text();
        } else {
          docContent = doc.title;
        }
      } catch (err) {
        docContent = doc.title;
      }

      // 2. Parse document
      const parsedDoc = await parserService.parseDocument(docContent, doc.documentType === 'circular' ? 'html' : 'text', {
        title: doc.title,
        sourceUrl: doc.url,
        documentType: doc.documentType,
      });

      // 3. Extract compliance objects
      const extracted = extractorService.extractFromSections(parsedDoc.sections);

      // Find or create Regulator
      const regulatorAbbr = source.toUpperCase().replace('_', '-');
      let regulator = await prisma.regulator.findUnique({
        where: { abbreviation: regulatorAbbr },
      });
      if (!regulator) {
        regulator = await prisma.regulator.create({
          data: {
            name: `${regulatorAbbr} Authority`,
            abbreviation: regulatorAbbr,
          },
        });
      }

      // 4. Save/Update Regulation & Version to DB
      const dbRegulation = await prisma.regulation.create({
        data: {
          title: parsedDoc.title,
          documentType: parsedDoc.documentType,
          regulationNumber: parsedDoc.regulationNumber,
          sourceUrl: parsedDoc.sourceUrl,
          regulatorId: regulator.id,
          status: 'active',
        },
      });

      const dbVersion = await prisma.version.create({
        data: {
          regulationId: dbRegulation.id,
          versionNumber: '1.0',
          publicationDate: new Date(),
          effectiveDate: new Date(),
          changeSummary: 'Ingested via automated pipeline',
        },
      });

      // Save Sections and extracted compliance objects
      for (const sect of parsedDoc.sections) {
        const dbSection = await prisma.section.create({
          data: {
            versionId: dbVersion.id,
            sectionNumber: sect.sectionNumber,
            title: sect.title,
            content: sect.content,
          },
        });

        // Filter extracted objects for this section
        const sectionObligations = extracted.obligations.filter(o => o.sectionNumber === sect.sectionNumber);
        for (const obl of sectionObligations) {
          const dbObl = await prisma.obligation.create({
            data: {
              sectionId: dbSection.id,
              title: obl.title,
              description: obl.description,
              obligationType: obl.obligationType,
              priority: obl.priority,
              mandatory: obl.mandatory,
              frequency: obl.frequency,
              status: 'pending',
            },
          });

          // Create deadlines
          const oblDeadlines = extracted.deadlines.filter(d => d.obligationTitle === obl.title);
          for (const dl of oblDeadlines) {
            await prisma.deadline.create({
              data: {
                obligationId: dbObl.id,
                deadlineType: dl.deadlineType,
                description: dl.description,
              },
            });
          }

          // Create penalties
          const oblPenalties = extracted.penalties.filter(p => p.sectionNumber === sect.sectionNumber);
          for (const pen of oblPenalties) {
            await prisma.penalty.create({
              data: {
                sectionId: dbSection.id,
                obligationId: dbObl.id,
                description: pen.description,
                penaltyType: pen.penaltyType,
                severity: pen.severity,
              },
            });
          }
        }
      }

      // 5. Chunk and Embed for Semantic Search
      await embeddingsService.processRegulation(dbRegulation.id, docContent, {
        source,
        url: doc.url,
      });

      // Mark as processed in Monitor
      await monitorService.markDocumentProcessed(doc);
      processedCount++;
    } catch (err) {
      console.error(`[Worker Pipeline] Error processing document ${doc.title}:`, err);
    }
  }

  return { success: true, documentsFound: processedCount };
}

startWorker().catch(err => {
  console.error('Fatal error starting RegPilot Ingestion Worker:', err);
  process.exit(1);
});
