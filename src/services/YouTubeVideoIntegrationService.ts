import { v4 as uuidv4 } from 'uuid';
import { YouTubeClient } from '../integrations/YouTubeClient';

/**
 * YouTube video integration for storytelling and NFT initiatives
 */
export interface IntegratedVideo {
  id: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  publishedAt: Date;
  tags: string[];
  viewCount: number;
  likeCount: number;
  metadata: {
    extractedAt: Date;
    purpose: 'storytelling' | 'nft-showcase' | 'promotional';
    nftSetId?: string;
  };
}

/**
 * Service for integrating YouTube videos with ScrollSoul for NFT storytelling
 */
export class YouTubeVideoIntegrationService {
  private youtubeClient: YouTubeClient;
  private integratedVideos: Map<string, IntegratedVideo> = new Map();

  constructor(apiKey: string) {
    this.youtubeClient = new YouTubeClient(apiKey);
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/\s]+)/,
      /youtube\.com\/watch\?.*v=([^&\?\/\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Integrate a YouTube video by URL for storytelling purposes
   */
  async integrateVideo(
    youtubeUrl: string,
    purpose: 'storytelling' | 'nft-showcase' | 'promotional' = 'storytelling',
    nftSetId?: string
  ): Promise<IntegratedVideo> {
    const videoId = this.extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Fetch video metadata from YouTube
    const videoData = await this.youtubeClient.getVideoMetadata(videoId);
    if (!videoData) {
      throw new Error(`Could not fetch metadata for video: ${videoId}`);
    }

    const integrated: IntegratedVideo = {
      id: uuidv4(),
      youtubeVideoId: videoId,
      youtubeUrl: youtubeUrl,
      title: videoData.title,
      description: videoData.description,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: videoData.duration,
      publishedAt: videoData.publishedAt,
      tags: videoData.tags,
      viewCount: videoData.viewCount,
      likeCount: videoData.likeCount,
      metadata: {
        extractedAt: new Date(),
        purpose,
        nftSetId,
      },
    };

    this.integratedVideos.set(integrated.id, integrated);
    return integrated;
  }

  /**
   * Get integrated video by ID
   */
  getIntegratedVideo(id: string): IntegratedVideo | undefined {
    return this.integratedVideos.get(id);
  }

  /**
   * Get all integrated videos
   */
  getAllIntegratedVideos(): IntegratedVideo[] {
    return Array.from(this.integratedVideos.values());
  }

  /**
   * Get videos by purpose
   */
  getVideosByPurpose(purpose: 'storytelling' | 'nft-showcase' | 'promotional'): IntegratedVideo[] {
    return this.getAllIntegratedVideos().filter(v => v.metadata.purpose === purpose);
  }

  /**
   * Get videos by NFT set
   */
  getVideosByNFTSet(nftSetId: string): IntegratedVideo[] {
    return this.getAllIntegratedVideos().filter(v => v.metadata.nftSetId === nftSetId);
  }

  /**
   * Update video metadata (refresh from YouTube)
   */
  async refreshVideoMetadata(integratedVideoId: string): Promise<IntegratedVideo> {
    const video = this.integratedVideos.get(integratedVideoId);
    if (!video) {
      throw new Error(`Integrated video not found: ${integratedVideoId}`);
    }

    const videoData = await this.youtubeClient.getVideoMetadata(video.youtubeVideoId);
    if (!videoData) {
      throw new Error(`Could not refresh metadata for video: ${video.youtubeVideoId}`);
    }

    video.title = videoData.title;
    video.description = videoData.description;
    video.thumbnail = `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`;
    video.tags = videoData.tags;
    video.viewCount = videoData.viewCount;
    video.likeCount = videoData.likeCount;
    video.metadata.extractedAt = new Date();

    this.integratedVideos.set(integratedVideoId, video);
    return video;
  }

  /**
   * Generate storytelling content from video
   */
  generateStorytellingContent(integratedVideoId: string): {
    title: string;
    description: string;
    visualCues: string[];
    nftSuggestions: string[];
  } {
    const video = this.integratedVideos.get(integratedVideoId);
    if (!video) {
      throw new Error(`Integrated video not found: ${integratedVideoId}`);
    }

    // Extract key themes and visual elements for NFT storytelling
    const visualCues = this.extractVisualCues(video);
    const nftSuggestions = this.generateNFTSuggestions(video);

    return {
      title: `${video.title} - NFT Storytelling`,
      description: `
🎵 ScrollSoul Music Sync - NFT Storytelling Initiative

Based on: ${video.title}
YouTube: ${video.youtubeUrl}

${video.description}

✨ Powered by Rose Gold Encryption
🌌 Aligned with ScrollSoul Sovereign Empire
📡 Automated NFT storytelling synchronization
      `.trim(),
      visualCues,
      nftSuggestions,
    };
  }

  /**
   * Extract visual cues from video metadata
   */
  private extractVisualCues(video: IntegratedVideo): string[] {
    const cues: string[] = [];
    
    // Use tags as visual cues
    if (video.tags && video.tags.length > 0) {
      cues.push(...video.tags.slice(0, 5).map(tag => `Visual theme: ${tag}`));
    }

    // Duration-based cues
    const minutes = Math.floor(video.duration / 60);
    cues.push(`Duration: ${minutes} minutes - suitable for ${minutes > 5 ? 'long-form' : 'short-form'} NFT content`);

    // Engagement cues
    if (video.viewCount > 1000) {
      cues.push('High engagement potential for NFT showcase');
    }

    return cues;
  }

  /**
   * Generate NFT suggestions based on video
   */
  private generateNFTSuggestions(video: IntegratedVideo): string[] {
    const suggestions: string[] = [];

    suggestions.push('Create timestamped NFT moments from key scenes');
    suggestions.push('Generate visual art collection based on video themes');
    suggestions.push('Mint exclusive behind-the-scenes content as NFTs');
    
    if (video.tags.includes('music')) {
      suggestions.push('Audio clips as musical NFTs with royalty automation');
    }

    suggestions.push('Limited edition video-backed NFT collection');
    suggestions.push('Interactive NFT experience with video integration');

    return suggestions;
  }
}
