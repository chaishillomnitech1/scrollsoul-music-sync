/**
 * DomoAI Creative Suite Integration
 * Frames-to-video animation and style transfer
 * Rose Gold Encryption Enabled
 */

import axios, { AxiosInstance } from 'axios';
import { VideoGenerationResponse } from '../../types/nft';

export interface DomoConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface StyleTransferOptions {
  sourceImageUrl: string;
  styleReference: string;
  intensity?: number; // 0-10
  preserveDetails?: boolean;
}

export interface FrameToVideoOptions {
  frameUrls: string[];
  fps?: number;
  transitionType?: 'morph' | 'fade' | 'slide' | 'dissolve';
  duration?: number;
  resolution?: '720p' | '1080p' | '4k';
  upscale?: boolean;
}

export class DomoClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: DomoConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.domoai.app/v1',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 90000,
    });
  }

  /**
   * Convert NFT art frames to animated video
   */
  async framesToVideo(options: FrameToVideoOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/animate', {
        frames: options.frameUrls,
        fps: options.fps || 24,
        transition_type: options.transitionType || 'morph',
        duration: options.duration || (options.frameUrls.length * 2),
        resolution: options.resolution || '1080p',
        upscale: options.upscale !== false,
      });

      return {
        videoId: response.data.task_id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 120,
      };
    } catch (error) {
      console.error('DomoAI frames-to-video error:', error);
      throw new Error(`Failed to animate frames: ${error}`);
    }
  }

  /**
   * Apply style transfer to create consistent visual branding
   */
  async applyStyleTransfer(options: StyleTransferOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/style-transfer', {
        source_image: options.sourceImageUrl,
        style_reference: options.styleReference,
        intensity: options.intensity || 7,
        preserve_details: options.preserveDetails !== false,
      });

      return {
        videoId: response.data.task_id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 60,
      };
    } catch (error) {
      console.error('DomoAI style transfer error:', error);
      throw new Error(`Failed to apply style transfer: ${error}`);
    }
  }

  /**
   * Upscale NFT assets to 4K
   */
  async upscaleTo4K(imageUrl: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/upscale', {
        image_url: imageUrl,
        target_resolution: '4k',
        enhance_details: true,
        denoise: true,
      });

      return {
        videoId: response.data.task_id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 30,
      };
    } catch (error) {
      console.error('DomoAI upscale error:', error);
      throw new Error(`Failed to upscale image: ${error}`);
    }
  }

  /**
   * Batch upscale multiple NFT assets
   */
  async batchUpscale(imageUrls: string[]): Promise<VideoGenerationResponse[]> {
    const results: VideoGenerationResponse[] = [];

    for (const imageUrl of imageUrls) {
      const result = await this.upscaleTo4K(imageUrl);
      results.push(result);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  /**
   * Generate viral-optimized video template
   */
  async generateViralTemplate(
    imageUrl: string,
    platform: 'tiktok' | 'instagram' | 'youtube-shorts' | 'twitter'
  ): Promise<VideoGenerationResponse> {
    const platformConfigs = {
      tiktok: {
        aspect_ratio: '9:16',
        duration: 15,
        effects: ['trending', 'fast-paced', 'text-overlay'],
      },
      instagram: {
        aspect_ratio: '9:16',
        duration: 30,
        effects: ['aesthetic', 'smooth-transitions'],
      },
      'youtube-shorts': {
        aspect_ratio: '9:16',
        duration: 60,
        effects: ['engaging', 'hook-first'],
      },
      twitter: {
        aspect_ratio: '16:9',
        duration: 45,
        effects: ['attention-grabbing', 'concise'],
      },
    };

    const config = platformConfigs[platform];

    try {
      const response = await this.client.post('/viral-template', {
        image_url: imageUrl,
        platform,
        aspect_ratio: config.aspect_ratio,
        duration: config.duration,
        effects: config.effects,
        optimize_engagement: true,
      });

      return {
        videoId: response.data.task_id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 90,
      };
    } catch (error) {
      console.error('DomoAI viral template error:', error);
      throw new Error(`Failed to generate viral template: ${error}`);
    }
  }

  /**
   * Check task status
   */
  async checkStatus(taskId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.get(`/tasks/${taskId}`);
      
      return {
        videoId: response.data.task_id,
        status: this.mapStatus(response.data.status),
        url: response.data.result_url,
        thumbnailUrl: response.data.thumbnail_url,
        error: response.data.error,
      };
    } catch (error) {
      console.error('DomoAI status check error:', error);
      throw new Error(`Failed to check task status: ${error}`);
    }
  }

  /**
   * Convert NFT collection to animated story
   */
  async createNFTAnimatedStory(
    nftImageUrls: string[],
    styleReference: string,
    duration: number = 30
  ): Promise<VideoGenerationResponse> {
    // First apply consistent style to all NFT images
    const styledImages: string[] = [];
    
    for (const imageUrl of nftImageUrls) {
      const styleResult = await this.applyStyleTransfer({
        sourceImageUrl: imageUrl,
        styleReference,
        intensity: 8,
      });
      
      // Wait for style transfer to complete
      let status = await this.checkStatus(styleResult.videoId);
      while (status.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 5000));
        status = await this.checkStatus(styleResult.videoId);
      }
      
      if (status.url) {
        styledImages.push(status.url);
      }
    }

    // Then animate the styled images
    return this.framesToVideo({
      frameUrls: styledImages,
      duration,
      transitionType: 'morph',
      resolution: '4k',
      upscale: true,
    });
  }

  /**
   * Map DomoAI status to our standard status
   */
  private mapStatus(status: string): 'queued' | 'processing' | 'completed' | 'failed' {
    const statusMap: { [key: string]: 'queued' | 'processing' | 'completed' | 'failed' } = {
      'queued': 'queued',
      'processing': 'processing',
      'completed': 'completed',
      'failed': 'failed',
      'error': 'failed',
    };
    
    return statusMap[status] || 'processing';
  }
}
