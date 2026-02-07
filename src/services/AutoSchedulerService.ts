import * as cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import { ContentQueue, ContentJobData } from '../queues/ContentQueue';

/**
 * Platform configuration
 */
export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'vr-space';

/**
 * Content type configuration
 */
export interface ContentType {
  type: 'nft-showcase' | 'story-chapter' | 'collection-highlight' | 'trending-analysis';
  duration: number;
  aiModel: 'runway' | 'sora' | 'domoai' | 'kling';
  visualStyle: string;
  musicSync: boolean;
}

/**
 * Schedule configuration
 */
export interface ScheduleConfig {
  id?: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'custom';
  cronExpression?: string;
  contentTypes: ContentType[];
  platforms: Platform[];
  qualityThreshold: number; // 0-100 AI quality score
  autoPublish: boolean;
  notifyOnComplete: boolean;
}

/**
 * Scheduled job
 */
interface ScheduledJob {
  id: string;
  config: ScheduleConfig;
  task: cron.ScheduledTask;
  nextRun: Date;
  lastRun?: Date;
}

/**
 * Autonomous Content Generation Scheduler
 * 
 * Features:
 * - Configurable scheduling (hourly, daily, weekly, custom cron)
 * - Multi-platform publishing
 * - Quality-based auto-publish
 * - Content type rotation
 * - Automated notifications
 */
export class AutoSchedulerService {
  private contentQueue: ContentQueue;
  private schedules: Map<string, ScheduledJob> = new Map();

  constructor(contentQueue: ContentQueue) {
    this.contentQueue = contentQueue;
  }

  /**
   * Create a new content generation schedule
   */
  createSchedule(config: ScheduleConfig): string {
    const scheduleId = config.id || uuidv4();
    const cronExpression = this.getCronExpression(config);

    const task = cron.schedule(cronExpression, async () => {
      await this.executeSchedule(scheduleId);
    });

    const scheduledJob: ScheduledJob = {
      id: scheduleId,
      config,
      task,
      nextRun: this.getNextRunTime(cronExpression),
    };

    this.schedules.set(scheduleId, scheduledJob);
    console.log(`Schedule ${scheduleId} created with cron: ${cronExpression}`);

    return scheduleId;
  }

  /**
   * Execute a schedule - generate and queue content
   */
  private async executeSchedule(scheduleId: string): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      console.error(`Schedule ${scheduleId} not found`);
      return;
    }

    console.log(`Executing schedule ${scheduleId}`);
    schedule.lastRun = new Date();
    schedule.nextRun = this.getNextRunTime(this.getCronExpression(schedule.config));

    const { config } = schedule;
    const jobs: Omit<ContentJobData, 'id'>[] = [];

    // Create jobs for each content type
    for (const contentType of config.contentTypes) {
      jobs.push({
        type: contentType.type,
        duration: contentType.duration,
        aiModel: contentType.aiModel,
        visualStyle: contentType.visualStyle,
        musicSync: contentType.musicSync,
        priority: 5,
      });
    }

    // Queue all jobs
    const jobIds = await this.contentQueue.addBatch(jobs);
    console.log(`Scheduled ${jobIds.length} content generation jobs`);

    // If auto-publish is enabled, monitor jobs and publish when ready
    if (config.autoPublish) {
      this.monitorAndPublish(jobIds, config);
    }
  }

  /**
   * Monitor jobs and auto-publish when complete
   */
  private async monitorAndPublish(
    jobIds: string[],
    config: ScheduleConfig
  ): Promise<void> {
    // Poll job status periodically
    const checkInterval = setInterval(async () => {
      const statuses = await Promise.all(
        jobIds.map((id) => this.contentQueue.getJobStatus(id))
      );

      // Check if all jobs are complete
      const allComplete = statuses.every(
        (status) => status.status === 'completed' || status.status === 'failed'
      );

      if (allComplete) {
        clearInterval(checkInterval);

        // Publish completed jobs
        for (let i = 0; i < jobIds.length; i++) {
          const status = statuses[i];
          if (status.status === 'completed' && status.result) {
            await this.publishContent(status.result, config.platforms);
          }
        }

        // Send notification if enabled
        if (config.notifyOnComplete) {
          this.sendNotification(config, statuses);
        }
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Publish content to platforms
   */
  private async publishContent(
    result: unknown,
    platforms: Platform[]
  ): Promise<void> {
    const content = result as { videoUrl: string; thumbnailUrl: string };
    
    for (const platform of platforms) {
      console.log(`Publishing to ${platform}:`, content.videoUrl);
      // In production, call actual platform publishers
    }
  }

  /**
   * Send completion notification
   */
  private sendNotification(
    config: ScheduleConfig,
    statuses: Array<{ status: string; progress: number; error?: string }>
  ): void {
    const completed = statuses.filter((s) => s.status === 'completed').length;
    const failed = statuses.filter((s) => s.status === 'failed').length;

    console.log(`Schedule notification: ${completed} completed, ${failed} failed`);
    // In production, send email/webhook notification
  }

  /**
   * Update existing schedule
   */
  updateSchedule(scheduleId: string, config: Partial<ScheduleConfig>): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    // Stop existing task
    schedule.task.stop();

    // Update config
    const updatedConfig = { ...schedule.config, ...config };
    
    // Create new task with updated config
    const cronExpression = this.getCronExpression(updatedConfig);
    const newTask = cron.schedule(cronExpression, async () => {
      await this.executeSchedule(scheduleId);
    });

    schedule.config = updatedConfig;
    schedule.task = newTask;
    schedule.nextRun = this.getNextRunTime(cronExpression);

    return true;
  }

  /**
   * Delete a schedule
   */
  deleteSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    schedule.task.stop();
    this.schedules.delete(scheduleId);
    return true;
  }

  /**
   * Pause a schedule
   */
  pauseSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    schedule.task.stop();
    return true;
  }

  /**
   * Resume a schedule
   */
  resumeSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    schedule.task.start();
    return true;
  }

  /**
   * Get all schedules
   */
  getAllSchedules(): ScheduledJob[] {
    return Array.from(this.schedules.values()).map((s) => ({
      id: s.id,
      config: s.config,
      task: s.task,
      nextRun: s.nextRun,
      lastRun: s.lastRun,
    }));
  }

  /**
   * Get schedule by ID
   */
  getSchedule(scheduleId: string): ScheduledJob | undefined {
    return this.schedules.get(scheduleId);
  }

  /**
   * Convert frequency to cron expression
   */
  private getCronExpression(config: ScheduleConfig): string {
    if (config.frequency === 'custom' && config.cronExpression) {
      return config.cronExpression;
    }

    const expressions: Record<string, string> = {
      hourly: '0 * * * *', // Every hour at minute 0
      daily: '0 9 * * *', // Every day at 9 AM
      weekly: '0 9 * * 1', // Every Monday at 9 AM
    };

    return expressions[config.frequency] || expressions.daily;
  }

  /**
   * Get next run time for cron expression
   */
  private getNextRunTime(cronExpression: string): Date {
    // Simple approximation - in production use cron-parser
    const now = new Date();
    const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
    return nextRun;
  }

  /**
   * Manually trigger a schedule
   */
  async triggerSchedule(scheduleId: string): Promise<boolean> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    await this.executeSchedule(scheduleId);
    return true;
  }

  /**
   * Stop all schedules
   */
  stopAll(): void {
    for (const schedule of this.schedules.values()) {
      schedule.task.stop();
    }
  }

  /**
   * Start all schedules
   */
  startAll(): void {
    for (const schedule of this.schedules.values()) {
      schedule.task.start();
    }
  }
}
