/**
 * Synthesia Avatar System Integration
 * AI avatars for faceless NFT narration with multilingual support
 * Rose Gold Encryption Enabled
 */

import axios, { AxiosInstance } from 'axios';
import { VideoGenerationResponse } from '../../types/nft';

export interface SynthesiaConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface AvatarConfig {
  avatarId: string;
  voice?: string;
  language?: string;
  backgroundColor?: string;
  scale?: number;
}

export interface SynthesiaVideoOptions {
  script: string;
  avatar: AvatarConfig;
  title?: string;
  description?: string;
  resolution?: '720p' | '1080p' | '4k';
  backgroundMusic?: string;
  subtitles?: boolean;
}

export class SynthesiaClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: SynthesiaConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.synthesia.io/v2',
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
  }

  /**
   * Generate avatar narration video
   */
  async generateNarration(options: SynthesiaVideoOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/videos', {
        title: options.title || 'NFT Story Narration',
        description: options.description,
        input: [
          {
            avatarSettings: {
              avatarId: options.avatar.avatarId,
              voice: options.avatar.voice || 'en-US-Neural2-A',
              scale: options.avatar.scale || 1,
              backgroundColor: options.avatar.backgroundColor || '#000000',
            },
            scriptText: options.script,
            background: {
              type: 'color',
              value: options.avatar.backgroundColor || '#000000',
            },
          },
        ],
        soundtrack: options.backgroundMusic
          ? { url: options.backgroundMusic }
          : undefined,
        resolution: options.resolution || '1080p',
        subtitles: options.subtitles || false,
      });

      return {
        videoId: response.data.id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimatedTime || 180,
      };
    } catch (error) {
      console.error('Synthesia generation error:', error);
      throw new Error(`Failed to generate avatar video: ${error}`);
    }
  }

  /**
   * Generate multilingual narration
   */
  async generateMultilingualNarration(
    script: string,
    languages: Array<{
      code: string;
      voice: string;
      script: string;
    }>,
    avatarId: string
  ): Promise<VideoGenerationResponse[]> {
    const results: VideoGenerationResponse[] = [];

    for (const lang of languages) {
      const result = await this.generateNarration({
        script: lang.script,
        avatar: {
          avatarId,
          voice: lang.voice,
          language: lang.code,
        },
      });
      
      results.push(result);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Generate NFT story narration from metadata
   */
  async narrateNFTStory(
    storyScript: string,
    avatarId: string = 'anna',
    options?: Partial<SynthesiaVideoOptions>
  ): Promise<VideoGenerationResponse> {
    return this.generateNarration({
      script: storyScript,
      avatar: {
        avatarId,
        voice: options?.avatar?.voice || 'en-US-Neural2-F',
      },
      title: options?.title || 'NFT Story',
      description: options?.description,
      resolution: options?.resolution || '1080p',
      backgroundMusic: options?.backgroundMusic,
      subtitles: options?.subtitles !== false,
    });
  }

  /**
   * Check video generation status
   */
  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.get(`/videos/${videoId}`);
      
      return {
        videoId: response.data.id,
        status: this.mapStatus(response.data.status),
        url: response.data.download,
        thumbnailUrl: response.data.thumbnail,
        error: response.data.error,
      };
    } catch (error) {
      console.error('Synthesia status check error:', error);
      throw new Error(`Failed to check video status: ${error}`);
    }
  }

  /**
   * List available avatars
   */
  async listAvatars(): Promise<Array<{
    id: string;
    name: string;
    gender: string;
    age: string;
    ethnicity: string;
  }>> {
    try {
      const response = await this.client.get('/avatars');
      return response.data.avatars;
    } catch (error) {
      console.error('Synthesia avatar list error:', error);
      throw new Error(`Failed to fetch avatars: ${error}`);
    }
  }

  /**
   * Create custom avatar (requires custom avatar plan)
   */
  async createCustomAvatar(
    name: string,
    videoUrl: string,
    consentFormUrl: string
  ): Promise<{ avatarId: string; status: string }> {
    try {
      const response = await this.client.post('/avatars/custom', {
        name,
        video_url: videoUrl,
        consent_form_url: consentFormUrl,
      });

      return {
        avatarId: response.data.id,
        status: response.data.status,
      };
    } catch (error) {
      console.error('Synthesia custom avatar error:', error);
      throw new Error(`Failed to create custom avatar: ${error}`);
    }
  }

  /**
   * Map Synthesia status to our standard status
   */
  private mapStatus(status: string): 'queued' | 'processing' | 'completed' | 'failed' {
    const statusMap: { [key: string]: 'queued' | 'processing' | 'completed' | 'failed' } = {
      'pending': 'queued',
      'in_progress': 'processing',
      'complete': 'completed',
      'failed': 'failed',
    };
    
    return statusMap[status] || 'processing';
  }
}
