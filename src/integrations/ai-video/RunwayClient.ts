/**
 * Runway Gen-4 Integration Client
 * 4K video generation from text/image prompts
 * Rose Gold Encryption Enabled
 */

import axios, { AxiosInstance } from 'axios';
import { VideoGenerationRequest, VideoGenerationResponse } from '../../types/nft';

export interface RunwayConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RunwayGenerationOptions extends VideoGenerationRequest {
  imageUrl?: string;
  model?: 'gen3' | 'gen4';
  watermark?: boolean;
  motionIntensity?: number; // 0-10
  cameraControl?: {
    pan?: 'left' | 'right' | 'none';
    tilt?: 'up' | 'down' | 'none';
    zoom?: 'in' | 'out' | 'none';
  };
}

export class RunwayClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: RunwayConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.runwayml.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
  }

  /**
   * Generate 4K video from text prompt
   */
  async generateFromText(options: RunwayGenerationOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/generations', {
        prompt: options.prompt,
        model: options.model || 'gen4',
        duration: options.duration || 5,
        resolution: options.resolution || '4k',
        aspectRatio: options.aspectRatio || '16:9',
        watermark: options.watermark !== false,
        motionIntensity: options.motionIntensity || 5,
        seed: options.seed,
      });

      return {
        videoId: response.data.id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimatedTime || 120,
      };
    } catch (error) {
      console.error('Runway generation error:', error);
      throw new Error(`Failed to generate video with Runway: ${error}`);
    }
  }

  /**
   * Generate video from image + text prompt
   */
  async generateFromImage(
    imageUrl: string,
    options: RunwayGenerationOptions
  ): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/generations', {
        prompt: options.prompt,
        imageUrl,
        model: options.model || 'gen4',
        duration: options.duration || 5,
        resolution: options.resolution || '4k',
        aspectRatio: options.aspectRatio || '16:9',
        cameraControl: options.cameraControl,
        motionIntensity: options.motionIntensity || 5,
        seed: options.seed,
      });

      return {
        videoId: response.data.id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimatedTime || 120,
      };
    } catch (error) {
      console.error('Runway image-to-video error:', error);
      throw new Error(`Failed to generate video from image: ${error}`);
    }
  }

  /**
   * Check generation status
   */
  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.get(`/generations/${videoId}`);
      
      return {
        videoId: response.data.id,
        status: response.data.status,
        url: response.data.url,
        thumbnailUrl: response.data.thumbnailUrl,
        error: response.data.error,
      };
    } catch (error) {
      console.error('Runway status check error:', error);
      throw new Error(`Failed to check video status: ${error}`);
    }
  }

  /**
   * Synchronize video generation with music track
   */
  async syncWithMusic(
    options: RunwayGenerationOptions,
    musicUrl: string,
    tempo?: number
  ): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/generations/music-sync', {
        prompt: options.prompt,
        musicUrl,
        tempo: tempo || 120,
        duration: options.duration,
        resolution: options.resolution || '4k',
        aspectRatio: options.aspectRatio || '16:9',
        model: options.model || 'gen4',
      });

      return {
        videoId: response.data.id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimatedTime || 180,
      };
    } catch (error) {
      console.error('Runway music sync error:', error);
      throw new Error(`Failed to sync video with music: ${error}`);
    }
  }

  /**
   * Generate B-roll footage for NFT story sets
   */
  async generateBRoll(
    theme: string,
    count: number = 5,
    duration: number = 3
  ): Promise<VideoGenerationResponse[]> {
    const results: VideoGenerationResponse[] = [];
    
    for (let i = 0; i < count; i++) {
      const options: RunwayGenerationOptions = {
        prompt: `${theme} - cinematic B-roll shot ${i + 1}`,
        duration,
        resolution: '4k',
        aspectRatio: '16:9',
      };
      
      const result = await this.generateFromText(options);
      results.push(result);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}
