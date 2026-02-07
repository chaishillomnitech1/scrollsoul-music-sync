/**
 * OpenAI Sora 2 Integration Client
 * Cinematic-quality video generation with complex narrative understanding
 * Rose Gold Encryption Enabled
 */

import axios, { AxiosInstance } from 'axios';
import { VideoGenerationRequest, VideoGenerationResponse } from '../../types/nft';

export interface SoraConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface SoraGenerationOptions extends VideoGenerationRequest {
  narrativeContext?: string;
  cameraAngle?: 'wide' | 'medium' | 'close-up' | 'aerial' | 'pov';
  cameraMovement?: 'static' | 'pan' | 'dolly' | 'crane' | 'handheld';
  lightingStyle?: 'natural' | 'dramatic' | 'soft' | 'studio' | 'neon';
  colorGrading?: 'cinematic' | 'vibrant' | 'desaturated' | 'warm' | 'cool';
  physicsRealism?: number; // 0-10
}

export class SoraClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: SoraConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 90000,
    });
  }

  /**
   * Generate cinematic video from narrative prompt
   */
  async generateCinematic(options: SoraGenerationOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/sora/generations', {
        prompt: options.prompt,
        narrative_context: options.narrativeContext,
        camera_angle: options.cameraAngle || 'medium',
        camera_movement: options.cameraMovement || 'static',
        lighting_style: options.lightingStyle || 'natural',
        color_grading: options.colorGrading || 'cinematic',
        physics_realism: options.physicsRealism || 8,
        duration: options.duration || 10,
        resolution: options.resolution || '1080p',
        aspect_ratio: options.aspectRatio || '16:9',
        seed: options.seed,
      });

      return {
        videoId: response.data.id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 300,
      };
    } catch (error) {
      console.error('Sora generation error:', error);
      throw new Error(`Failed to generate video with Sora: ${error}`);
    }
  }

  /**
   * Generate video from NFT metadata narrative
   */
  async generateFromNFTMetadata(
    nftMetadata: {
      name: string;
      description: string;
      attributes: Array<{ trait_type: string; value: string | number }>;
    },
    options?: Partial<SoraGenerationOptions>
  ): Promise<VideoGenerationResponse> {
    // Build narrative context from NFT metadata
    const narrativeContext = this.buildNarrativeFromMetadata(nftMetadata);
    
    const prompt = `${nftMetadata.name}: ${nftMetadata.description}`;
    
    return this.generateCinematic({
      prompt,
      narrativeContext,
      ...options,
    });
  }

  /**
   * Generate multi-scene story video
   */
  async generateStorySequence(
    scenes: Array<{
      prompt: string;
      duration: number;
      cameraAngle?: string;
      transition?: string;
    }>,
    options?: Partial<SoraGenerationOptions>
  ): Promise<VideoGenerationResponse[]> {
    const results: VideoGenerationResponse[] = [];
    
    for (const scene of scenes) {
      const result = await this.generateCinematic({
        prompt: scene.prompt,
        duration: scene.duration,
        cameraAngle: scene.cameraAngle as any,
        ...options,
      });
      
      results.push(result);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }

  /**
   * Check generation status
   */
  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.get(`/sora/generations/${videoId}`);
      
      return {
        videoId: response.data.id,
        status: response.data.status,
        url: response.data.url,
        thumbnailUrl: response.data.thumbnail_url,
        error: response.data.error,
      };
    } catch (error) {
      console.error('Sora status check error:', error);
      throw new Error(`Failed to check video status: ${error}`);
    }
  }

  /**
   * Apply dramatic camera control
   */
  async generateWithDramaticEffect(
    prompt: string,
    effect: 'reveal' | 'chase' | 'contemplation' | 'action' | 'romance'
  ): Promise<VideoGenerationResponse> {
    const effectConfigs = {
      reveal: {
        cameraMovement: 'crane' as const,
        cameraAngle: 'wide' as const,
        lightingStyle: 'dramatic' as const,
      },
      chase: {
        cameraMovement: 'handheld' as const,
        cameraAngle: 'pov' as const,
        lightingStyle: 'natural' as const,
      },
      contemplation: {
        cameraMovement: 'static' as const,
        cameraAngle: 'close-up' as const,
        lightingStyle: 'soft' as const,
      },
      action: {
        cameraMovement: 'dolly' as const,
        cameraAngle: 'medium' as const,
        lightingStyle: 'dramatic' as const,
      },
      romance: {
        cameraMovement: 'pan' as const,
        cameraAngle: 'medium' as const,
        lightingStyle: 'soft' as const,
        colorGrading: 'warm' as const,
      },
    };

    return this.generateCinematic({
      prompt,
      ...effectConfigs[effect],
    });
  }

  /**
   * Helper: Build narrative context from NFT metadata
   */
  private buildNarrativeFromMetadata(metadata: {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
  }): string {
    const attributes = metadata.attributes
      .map(attr => `${attr.trait_type}: ${attr.value}`)
      .join(', ');
    
    return `NFT: ${metadata.name}. ${metadata.description}. Attributes: ${attributes}`;
  }
}
