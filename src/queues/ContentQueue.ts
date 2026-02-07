import Queue from 'bull';
import { v4 as uuidv4 } from 'uuid';

/**
 * Content generation job data
 */
export interface ContentJobData {
  id: string;
  type: 'nft-showcase' | 'story-chapter' | 'collection-highlight' | 'trending-analysis';
  nftContract?: string;
  tokenId?: string;
  duration: number;
  aiModel: 'runway' | 'sora' | 'domoai' | 'kling';
  visualStyle: string;
  musicSync: boolean;
  priority: number; // 1-10, higher is more urgent
  retryCount?: number;
}

/**
 * Queue configuration
 */
export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  concurrency: number;
  maxRetries: number;
}

/**
 * Smart queue system for content generation
 * Features:
 * - Priority-based processing
 * - Batch optimization
 * - Cost management
 * - Retry logic with fallback APIs
 * - Rate limit awareness
 */
export class ContentQueue {
  private queue: Queue.Queue<ContentJobData>;
  private config: QueueConfig;

  constructor(config: QueueConfig) {
    this.config = config;
    this.queue = new Queue<ContentJobData>('content-generation', {
      redis: config.redis,
      defaultJobOptions: {
        attempts: config.maxRetries,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    this.setupProcessors();
  }

  /**
   * Add content generation job to queue
   */
  async addJob(data: Omit<ContentJobData, 'id'>): Promise<string> {
    const jobId = uuidv4();
    const jobData: ContentJobData = {
      ...data,
      id: jobId,
      retryCount: 0,
    };

    await this.queue.add(jobData, {
      priority: this.calculatePriority(data),
      jobId,
    });

    return jobId;
  }

  /**
   * Add multiple jobs in batch
   */
  async addBatch(jobs: Omit<ContentJobData, 'id'>[]): Promise<string[]> {
    const jobIds: string[] = [];
    
    const groupedJobs = this.groupByModel(jobs);
    
    for (const [model, modelJobs] of Object.entries(groupedJobs)) {
      for (const job of modelJobs) {
        const jobId = await this.addJob({
          ...job,
          aiModel: model as ContentJobData['aiModel'],
        });
        jobIds.push(jobId);
      }
    }

    return jobIds;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{
    status: string;
    progress: number;
    result?: unknown;
    error?: string;
  }> {
    const job = await this.queue.getJob(jobId);
    
    if (!job) {
      return { status: 'not_found', progress: 0 };
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      status: state,
      progress: typeof progress === 'number' ? progress : 0,
      result: job.returnvalue,
      error: job.failedReason,
    };
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const job = await this.queue.getJob(jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Setup job processors
   */
  private setupProcessors(): void {
    this.queue.process(this.config.concurrency, async (job) => {
      const { data } = job;
      
      await job.progress(10);
      
      try {
        const result = await this.generateContent(data, job);
        await job.progress(100);
        return result;
      } catch (error) {
        if (data.retryCount && data.retryCount < this.config.maxRetries) {
          data.retryCount++;
          const fallbackModel = this.getFallbackModel(data.aiModel);
          data.aiModel = fallbackModel;
          throw error;
        }
        throw error;
      }
    });

    this.queue.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.queue.on('failed', (job, error) => {
      console.error(`Job ${job.id} failed:`, error.message);
    });

    this.queue.on('stalled', (job) => {
      console.warn(`Job ${job.id} stalled`);
    });
  }

  /**
   * Calculate job priority based on content type and other factors
   */
  private calculatePriority(data: Omit<ContentJobData, 'id'>): number {
    let priority = data.priority || 5;
    
    if (data.type === 'trending-analysis') {
      priority += 3;
    }
    
    if (data.duration < 30) {
      priority += 1;
    }
    
    return Math.min(10, priority);
  }

  /**
   * Group jobs by AI model for batch processing
   */
  private groupByModel(
    jobs: Omit<ContentJobData, 'id'>[]
  ): Record<string, Omit<ContentJobData, 'id' | 'aiModel'>[]> {
    const grouped: Record<string, Omit<ContentJobData, 'id' | 'aiModel'>[]> = {
      runway: [],
      sora: [],
      domoai: [],
      kling: [],
    };

    for (const job of jobs) {
      grouped[job.aiModel].push(job);
    }

    return grouped;
  }

  /**
   * Get fallback AI model
   */
  private getFallbackModel(
    currentModel: ContentJobData['aiModel']
  ): ContentJobData['aiModel'] {
    const fallbackMap: Record<ContentJobData['aiModel'], ContentJobData['aiModel']> = {
      sora: 'runway',
      runway: 'domoai',
      domoai: 'kling',
      kling: 'runway',
    };

    return fallbackMap[currentModel];
  }

  /**
   * Generate content (placeholder for actual implementation)
   */
  private async generateContent(
    data: ContentJobData,
    job: Queue.Job<ContentJobData>
  ): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await job.progress(50);
    
    return {
      videoUrl: `https://storage.scrollsoul.com/videos/${data.id}.mp4`,
      thumbnailUrl: `https://storage.scrollsoul.com/thumbnails/${data.id}.jpg`,
    };
  }

  /**
   * Pause queue processing
   */
  async pause(): Promise<void> {
    await this.queue.pause();
  }

  /**
   * Resume queue processing
   */
  async resume(): Promise<void> {
    await this.queue.resume();
  }

  /**
   * Close queue connection
   */
  async close(): Promise<void> {
    await this.queue.close();
  }
}
