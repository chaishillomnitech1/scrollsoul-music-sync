import axios, { AxiosInstance } from 'axios';

/**
 * YouTube API Integration Client
 * Handles video uploads, metadata sync, and analytics
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  privacyStatus: 'public' | 'private' | 'unlisted';
  thumbnailUrl?: string;
  publishedAt?: string;
}

export interface YouTubeMetadata {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  defaultLanguage?: string;
  defaultAudioLanguage?: string;
}

export interface YouTubeAnalytics {
  videoId: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  watchTimeMinutes: number;
  averageViewDuration: number;
  subscribersGained: number;
}

export interface YouTubeUploadOptions {
  file: Buffer | string;
  metadata: YouTubeMetadata;
  privacyStatus: 'public' | 'private' | 'unlisted';
  notifySubscribers?: boolean;
}

export class YouTubeClient {
  private apiKey: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private refreshToken?: string;
  private client: AxiosInstance;
  private baseUrl: string = 'https://www.googleapis.com/youtube/v3';
  private uploadUrl: string = 'https://www.googleapis.com/upload/youtube/v3';

  constructor(config: {
    apiKey: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
  }) {
    this.apiKey = config.apiKey;
    this.clientId = config.clientId || '';
    this.clientSecret = config.clientSecret || '';
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Set OAuth access token
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Get video details by ID
   */
  async getVideo(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await this.client.get('/videos', {
        params: {
          part: 'snippet,status',
          id: videoId,
          key: this.apiKey,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          categoryId: item.snippet.categoryId,
          tags: item.snippet.tags || [],
          privacyStatus: item.status.privacyStatus,
          thumbnailUrl: item.snippet.thumbnails?.high?.url,
          publishedAt: item.snippet.publishedAt,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      throw error;
    }
  }

  /**
   * Upload video to YouTube
   */
  async uploadVideo(options: YouTubeUploadOptions): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Access token required for video upload');
    }

    try {
      const metadata = {
        snippet: {
          title: options.metadata.title,
          description: options.metadata.description,
          tags: options.metadata.tags,
          categoryId: options.metadata.categoryId,
          defaultLanguage: options.metadata.defaultLanguage || 'en',
          defaultAudioLanguage: options.metadata.defaultAudioLanguage || 'en',
        },
        status: {
          privacyStatus: options.privacyStatus,
          selfDeclaredMadeForKids: false,
          notifySubscribers: options.notifySubscribers ?? true,
        },
      };

      const response = await axios.post(
        `${this.uploadUrl}/videos?uploadType=resumable&part=snippet,status`,
        metadata,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('Error uploading YouTube video:', error);
      throw error;
    }
  }

  /**
   * Update video metadata
   */
  async updateVideoMetadata(
    videoId: string,
    metadata: Partial<YouTubeMetadata>
  ): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error('Access token required for updating video metadata');
    }

    try {
      const updateData = {
        id: videoId,
        snippet: metadata,
      };

      await axios.put(`${this.baseUrl}/videos?part=snippet`, updateData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating YouTube video metadata:', error);
      throw error;
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<YouTubeAnalytics | null> {
    if (!this.accessToken) {
      throw new Error('Access token required for analytics');
    }

    try {
      // Using YouTube Analytics API
      const response = await axios.get(
        'https://youtubeanalytics.googleapis.com/v2/reports',
        {
          params: {
            ids: 'channel==MINE',
            startDate: '2020-01-01',
            endDate: new Date().toISOString().split('T')[0],
            metrics: 'views,likes,dislikes,comments,shares,estimatedMinutesWatched,averageViewDuration,subscribersGained',
            dimensions: 'video',
            filters: `video==${videoId}`,
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (response.data.rows && response.data.rows.length > 0) {
        const row = response.data.rows[0];
        return {
          videoId,
          views: row[1] || 0,
          likes: row[2] || 0,
          dislikes: row[3] || 0,
          comments: row[4] || 0,
          shares: row[5] || 0,
          watchTimeMinutes: row[6] || 0,
          averageViewDuration: row[7] || 0,
          subscribersGained: row[8] || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching YouTube analytics:', error);
      throw error;
    }
  }

  /**
   * Search videos by query
   */
  async searchVideos(
    query: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    try {
      const response = await this.client.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          key: this.apiKey,
        },
      });

      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        categoryId: item.snippet.categoryId || '10', // Default to Music category
        tags: [],
        privacyStatus: 'public',
        thumbnailUrl: item.snippet.thumbnails?.high?.url,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  /**
   * Sync track metadata to YouTube video
   */
  async syncTrackToVideo(
    videoId: string,
    trackData: {
      title: string;
      artist: string;
      album?: string;
      genre?: string;
      releaseDate?: string;
      isrc?: string;
    }
  ): Promise<boolean> {
    const description = this.generateMusicDescription(trackData);
    const tags = this.generateMusicTags(trackData);

    return this.updateVideoMetadata(videoId, {
      title: `${trackData.artist} - ${trackData.title}`,
      description,
      tags,
      categoryId: '10', // Music category
    });
  }

  /**
   * Generate music video description
   */
  private generateMusicDescription(trackData: {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    releaseDate?: string;
    isrc?: string;
  }): string {
    let description = `${trackData.artist} - ${trackData.title}\n\n`;

    if (trackData.album) {
      description += `Album: ${trackData.album}\n`;
    }
    if (trackData.genre) {
      description += `Genre: ${trackData.genre}\n`;
    }
    if (trackData.releaseDate) {
      description += `Release Date: ${trackData.releaseDate}\n`;
    }
    if (trackData.isrc) {
      description += `ISRC: ${trackData.isrc}\n`;
    }

    description += '\n🎵 Powered by ScrollSoul Music Sync\n';
    description += '📡 Automated metadata synchronization\n';

    return description;
  }

  /**
   * Generate music tags
   */
  private generateMusicTags(trackData: {
    artist: string;
    genre?: string;
    album?: string;
  }): string[] {
    const tags = [trackData.artist, 'music'];

    if (trackData.genre) {
      tags.push(trackData.genre.toLowerCase());
    }
    if (trackData.album) {
      tags.push(trackData.album);
    }

    tags.push('scrollsoul', 'music sync');

    return tags;
  }
}
