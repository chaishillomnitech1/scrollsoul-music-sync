import { YouTubeClient, YouTubeMetadata, YouTubeUploadOptions } from '../integrations/YouTubeClient';

/**
 * YouTube publish options
 */
export interface YouTubePublishOptions {
  videoFile: Buffer | string;
  title: string;
  description: string;
  tags: string[];
  categoryId?: string;
  privacyStatus?: 'public' | 'private' | 'unlisted';
  playlistId?: string;
  scheduledPublishTime?: Date;
  notifySubscribers?: boolean;
}

/**
 * YouTube Publisher
 * 
 * Features:
 * - Auto-upload with optimized metadata
 * - Playlist management
 * - End screen templates
 * - Community posts
 * - Premiere scheduling
 */
export class YouTubePublisher {
  private client: YouTubeClient;

  constructor(apiKey: string, clientId?: string, clientSecret?: string, accessToken?: string) {
    this.client = new YouTubeClient({
      apiKey,
      clientId,
      clientSecret,
      accessToken,
    });
  }

  /**
   * Publish video to YouTube
   */
  async publish(options: YouTubePublishOptions): Promise<{ videoId: string; url: string }> {
    const metadata: YouTubeMetadata = {
      title: options.title,
      description: this.enhanceDescription(options.description),
      tags: this.optimizeTags(options.tags),
      categoryId: options.categoryId || '10', // Music category
    };

    const uploadOptions: YouTubeUploadOptions = {
      file: options.videoFile,
      metadata,
      privacyStatus: options.privacyStatus || 'public',
      notifySubscribers: options.notifySubscribers,
    };

    // Upload video
    const videoId = await this.client.uploadVideo(uploadOptions);

    // Add to playlist if specified
    if (options.playlistId) {
      await this.addToPlaylist(videoId, options.playlistId);
    }

    // Set premiere time if specified
    if (options.scheduledPublishTime) {
      await this.schedulePremiere(videoId, options.scheduledPublishTime);
    }

    return {
      videoId,
      url: `https://youtube.com/watch?v=${videoId}`,
    };
  }

  /**
   * Enhance description with calls-to-action and links
   */
  private enhanceDescription(baseDescription: string): string {
    return `${baseDescription}

🎨 Explore NFT Collection: [Collection Link]
🎵 Music by ScrollSoul
✨ Powered by Rose Gold Encryption

👍 Like this video if you enjoyed!
🔔 Subscribe for daily NFT content
💬 Comment your favorite NFT below

#NFT #DigitalArt #ScrollSoul #CryptoArt

⚡ ScrollSoul Empire - Where Music Meets NFTs
`;
  }

  /**
   * Optimize tags for discovery
   */
  private optimizeTags(baseTags: string[]): string[] {
    const scrollSoulTags = [
      'scrollsoul',
      'nft content',
      'digital art',
      'crypto art',
      'nft collection',
    ];

    return [...new Set([...baseTags, ...scrollSoulTags])].slice(0, 30);
  }

  /**
   * Add video to playlist
   */
  private async addToPlaylist(videoId: string, playlistId: string): Promise<void> {
    // In production: Call YouTube API to add to playlist
    console.log(`Adding video ${videoId} to playlist ${playlistId}`);
  }

  /**
   * Schedule video premiere
   */
  private async schedulePremiere(videoId: string, time: Date): Promise<void> {
    // In production: Set premiere time via YouTube API
    console.log(`Scheduling premiere for video ${videoId} at ${time}`);
  }

  /**
   * Create community post announcement
   */
  async createCommunityPost(message: string, videoId?: string): Promise<void> {
    // In production: Use YouTube Community API
    console.log(`Creating community post: ${message}`);
  }

  /**
   * Auto-organize videos by NFT collection
   */
  async organizeIntoPlaylist(videoId: string, nftCollection: string): Promise<void> {
    // Find or create playlist for collection
    const playlistId = await this.findOrCreatePlaylist(nftCollection);
    await this.addToPlaylist(videoId, playlistId);
  }

  /**
   * Find or create playlist for NFT collection
   */
  private async findOrCreatePlaylist(collectionName: string): Promise<string> {
    // In production: Search for existing playlist or create new one
    return `playlist-${collectionName.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
