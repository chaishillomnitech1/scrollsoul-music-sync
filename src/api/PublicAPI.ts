import express from 'express';
import { ContentQueue, ContentJobData } from '../queues/ContentQueue';
import { AutoSchedulerService, ScheduleConfig } from '../services/AutoSchedulerService';

/**
 * Public API for third-party developers
 * 
 * Endpoints:
 * - POST /api/v1/generate-video - Generate NFT video
 * - GET /api/v1/job/:jobId - Get job status
 * - POST /api/v1/publish - Publish video to platforms
 * - POST /api/v1/schedule - Create content schedule
 * - GET /api/v1/schedules - List all schedules
 */
export class PublicAPI {
  private app: express.Application;
  private contentQueue: ContentQueue;
  private scheduler: AutoSchedulerService;

  constructor(contentQueue: ContentQueue, scheduler: AutoSchedulerService) {
    this.app = express();
    this.contentQueue = contentQueue;
    this.scheduler = scheduler;

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    this.app.use(express.json());
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });

    // API key authentication
    this.app.use('/api/v1', (req, res, next) => {
      const apiKey = req.headers.authorization?.replace('Bearer ', '');
      
      if (!apiKey || !this.validateApiKey(apiKey)) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Generate video
    this.app.post('/api/v1/generate-video', async (req, res) => {
      try {
        const { nftContract, tokenId, style, duration, music } = req.body;

        if (!nftContract || !tokenId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const jobData: Omit<ContentJobData, 'id'> = {
          type: 'nft-showcase',
          nftContract,
          tokenId,
          duration: duration || 60,
          aiModel: 'sora',
          visualStyle: style || 'cinematic',
          musicSync: !!music,
          priority: 5,
        };

        const jobId = await this.contentQueue.addJob(jobData);

        res.json({
          jobId,
          status: 'queued',
          estimatedTime: this.estimateCompletionTime(duration || 60),
        });
      } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
      }
    });

    // Get job status
    this.app.get('/api/v1/job/:jobId', async (req, res) => {
      try {
        const { jobId } = req.params;
        const status = await this.contentQueue.getJobStatus(jobId);

        res.json(status);
      } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Failed to fetch job status' });
      }
    });

    // Publish video
    this.app.post('/api/v1/publish', async (req, res) => {
      try {
        const { videoUrl, platforms } = req.body;

        if (!videoUrl || !platforms || !Array.isArray(platforms)) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production: Call platform publishers
        const results = platforms.map((platform) => ({
          platform,
          status: 'published',
          url: `https://${platform}.com/...`,
        }));

        res.json({ results });
      } catch (error) {
        console.error('Error publishing:', error);
        res.status(500).json({ error: 'Failed to publish video' });
      }
    });

    // Create schedule
    this.app.post('/api/v1/schedule', async (req, res) => {
      try {
        const config: ScheduleConfig = req.body;

        if (!config.frequency || !config.contentTypes || !config.platforms) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const scheduleId = this.scheduler.createSchedule(config);

        res.json({
          scheduleId,
          status: 'created',
          nextRun: new Date(),
        });
      } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
      }
    });

    // List schedules
    this.app.get('/api/v1/schedules', async (req, res) => {
      try {
        const schedules = this.scheduler.getAllSchedules();
        res.json({ schedules });
      } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Failed to fetch schedules' });
      }
    });

    // Get queue statistics
    this.app.get('/api/v1/stats', async (req, res) => {
      try {
        const stats = await this.contentQueue.getStats();
        res.json(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
      }
    });
  }

  /**
   * Validate API key
   */
  private validateApiKey(apiKey: string): boolean {
    // In production: Check against database
    return apiKey.startsWith('sk_scrollsoul_');
  }

  /**
   * Estimate job completion time
   */
  private estimateCompletionTime(duration: number): number {
    // Rough estimate: 2 minutes per second of video
    return duration * 120; // seconds
  }

  /**
   * Get Express app
   */
  getApp(): express.Application {
    return this.app;
  }

  /**
   * Start API server
   */
  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`ScrollSoul Public API listening on port ${port}`);
    });
  }
}
