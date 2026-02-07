/**
 * Public API v1 Router
 * REST API endpoints for video generation and templates
 */

import { Request, Response, Router } from 'express';

export interface VideoGenerationRequest {
  nftContract: string;
  tokenId: string;
  template: string;
  duration: number;
  music?: string;
}

export interface VideoJob {
  id: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  videoUrl?: string;
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export class APIRouter {
  private router: Router;
  private jobs: Map<string, VideoJob> = new Map();

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/videos/generate', async (req: Request, res: Response) => {
      try {
        const data: VideoGenerationRequest = req.body;
        if (!data.nftContract || !data.tokenId || !data.template) {
          res.status(400).json({
            error: 'Missing required fields: nftContract, tokenId, template',
          });
          return;
        }

        const job: VideoJob = {
          id: this.generateJobId(),
          status: 'QUEUED',
          progress: 0,
          createdAt: new Date(),
        };

        this.jobs.set(job.id, job);
        this.processVideoJob(job.id);

        res.status(202).json({
          jobId: job.id,
          status: job.status,
          message: 'Video generation started',
        });
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    this.router.get('/videos/:jobId', async (req: Request, res: Response) => {
      try {
        const jobId = req.params.jobId as string;
        const job = this.jobs.get(jobId);

        if (!job) {
          res.status(404).json({ error: 'Job not found' });
          return;
        }

        res.json(job);
      } catch (error) {
        res.status(500).json({
          error: 'Internal server error',
        });
      }
    });
  }

  private async processVideoJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';

    const interval = setInterval(() => {
      if (!job) {
        clearInterval(interval);
        return;
      }

      job.progress += 10;

      if (job.progress >= 100) {
        job.progress = 100;
        job.status = 'COMPLETED';
        job.completedAt = new Date();
        job.videoUrl = `https://videos.scrollsoul.app/${jobId}.mp4`;
        clearInterval(interval);
      }

      this.jobs.set(jobId, job);
    }, 1000);
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getRouter(): Router {
    return this.router;
  }
}
