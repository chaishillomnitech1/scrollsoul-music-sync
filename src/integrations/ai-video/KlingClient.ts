/**
 * Kling 2.0 Long-Form Video Integration
 * 2-minute explainer videos and broadcast-quality output
 * Rose Gold Encryption Enabled
 */

import axios, { AxiosInstance } from 'axios';
import { VideoGenerationResponse } from '../../types/nft';

export interface KlingConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface LongFormVideoOptions {
  script: string;
  scenes: Scene[];
  duration: number; // seconds, up to 120
  quality: 'standard' | 'high' | 'broadcast';
  resolution?: '720p' | '1080p' | '4k';
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface Scene {
  id: string;
  prompt: string;
  duration: number;
  visualStyle?: string;
  transition?: 'cut' | 'fade' | 'dissolve' | 'wipe';
}

export interface StoryArcConfig {
  introduction: string;
  risingAction: string;
  climax: string;
  resolution: string;
  visualTheme: string;
}

export class KlingClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: KlingConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.klingai.com/v2',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    });
  }

  /**
   * Generate long-form explainer video from NFT collection
   */
  async generateExplainerVideo(options: LongFormVideoOptions): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.post('/long-form/create', {
        script: options.script,
        scenes: options.scenes.map(scene => ({
          id: scene.id,
          prompt: scene.prompt,
          duration: scene.duration,
          visual_style: scene.visualStyle || 'cinematic',
          transition: scene.transition || 'fade',
        })),
        duration: options.duration,
        quality: options.quality || 'high',
        resolution: options.resolution || '1080p',
        aspect_ratio: options.aspectRatio || '16:9',
      });

      return {
        videoId: response.data.video_id,
        status: 'processing',
        estimatedCompletionTime: response.data.estimated_time || 600, // 10 minutes
      };
    } catch (error) {
      console.error('Kling long-form generation error:', error);
      throw new Error(`Failed to generate long-form video: ${error}`);
    }
  }

  /**
   * Generate story arc video across multiple NFTs
   */
  async generateStoryArc(
    nftCollection: Array<{
      id: string;
      name: string;
      description: string;
      imageUrl: string;
    }>,
    storyArc: StoryArcConfig,
    duration: number = 120
  ): Promise<VideoGenerationResponse> {
    // Build scenes from story arc and NFT collection
    const sceneDuration = duration / (nftCollection.length + 3); // +3 for intro/climax/resolution
    
    const scenes: Scene[] = [
      {
        id: 'intro',
        prompt: `${storyArc.introduction} - ${storyArc.visualTheme}`,
        duration: sceneDuration,
        transition: 'fade',
      },
    ];

    // Add NFT-specific scenes
    nftCollection.forEach((nft, index) => {
      scenes.push({
        id: `nft-${nft.id}`,
        prompt: `${nft.name}: ${nft.description} - ${storyArc.visualTheme} style`,
        duration: sceneDuration,
        transition: 'dissolve',
      });
    });

    // Add climax and resolution
    scenes.push(
      {
        id: 'climax',
        prompt: `${storyArc.climax} - dramatic ${storyArc.visualTheme}`,
        duration: sceneDuration,
        transition: 'wipe',
      },
      {
        id: 'resolution',
        prompt: `${storyArc.resolution} - peaceful ${storyArc.visualTheme}`,
        duration: sceneDuration,
        transition: 'fade',
      }
    );

    const script = this.buildScriptFromStoryArc(storyArc, nftCollection);

    return this.generateExplainerVideo({
      script,
      scenes,
      duration,
      quality: 'broadcast',
      resolution: '4k',
      aspectRatio: '16:9',
    });
  }

  /**
   * Generate premium NFT showcase
   */
  async generatePremiumShowcase(
    nfts: Array<{
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      rarity?: string;
    }>,
    title: string,
    duration: number = 60
  ): Promise<VideoGenerationResponse> {
    const sceneDuration = duration / nfts.length;
    
    const scenes: Scene[] = nfts.map((nft, index) => ({
      id: `showcase-${nft.id}`,
      prompt: `Premium showcase: ${nft.name} - ${nft.description}. ${nft.rarity ? `Rarity: ${nft.rarity}.` : ''} Cinematic lighting, elegant presentation, rose gold accents`,
      duration: sceneDuration,
      visualStyle: 'luxury-cinematic',
      transition: index === 0 ? 'fade' : 'dissolve',
    }));

    return this.generateExplainerVideo({
      script: `Premium NFT Collection: ${title}`,
      scenes,
      duration,
      quality: 'broadcast',
      resolution: '4k',
      aspectRatio: '16:9',
    });
  }

  /**
   * Check video generation status
   */
  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await this.client.get(`/long-form/status/${videoId}`);
      
      return {
        videoId: response.data.video_id,
        status: this.mapStatus(response.data.status),
        url: response.data.download_url,
        thumbnailUrl: response.data.thumbnail_url,
        error: response.data.error_message,
      };
    } catch (error) {
      console.error('Kling status check error:', error);
      throw new Error(`Failed to check video status: ${error}`);
    }
  }

  /**
   * Generate chapter-based video series
   */
  async generateChapterSeries(
    chapters: Array<{
      title: string;
      content: string;
      visualTheme: string;
      duration: number;
    }>
  ): Promise<VideoGenerationResponse[]> {
    const results: VideoGenerationResponse[] = [];

    for (const chapter of chapters) {
      const scenes: Scene[] = [
        {
          id: `chapter-${chapter.title}`,
          prompt: `${chapter.title}: ${chapter.content} - ${chapter.visualTheme}`,
          duration: chapter.duration,
          transition: 'fade',
        },
      ];

      const result = await this.generateExplainerVideo({
        script: chapter.content,
        scenes,
        duration: chapter.duration,
        quality: 'high',
        resolution: '1080p',
      });

      results.push(result);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  }

  /**
   * Helper: Build script from story arc
   */
  private buildScriptFromStoryArc(
    storyArc: StoryArcConfig,
    nfts: Array<{ name: string; description: string }>
  ): string {
    const nftDescriptions = nfts
      .map((nft, i) => `Chapter ${i + 1}: ${nft.name} - ${nft.description}`)
      .join(' ');

    return `
      ${storyArc.introduction}
      
      ${nftDescriptions}
      
      ${storyArc.risingAction}
      
      ${storyArc.climax}
      
      ${storyArc.resolution}
    `.trim();
  }

  /**
   * Map Kling status to our standard status
   */
  private mapStatus(status: string): 'queued' | 'processing' | 'completed' | 'failed' {
    const statusMap: { [key: string]: 'queued' | 'processing' | 'completed' | 'failed' } = {
      'pending': 'queued',
      'in_queue': 'queued',
      'processing': 'processing',
      'rendering': 'processing',
      'completed': 'completed',
      'done': 'completed',
      'failed': 'failed',
      'error': 'failed',
    };
    
    return statusMap[status] || 'processing';
  }
}
