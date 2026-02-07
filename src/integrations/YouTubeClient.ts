import axios, { AxiosInstance } from 'axios';
import { TrackMetadata } from '../types';

/**
 * YouTube sync status interface
 */
export interface YouTubeSyncStatus {
  trackId: string;
  youtubeVideoId?: string;
  lastSyncDate: Date;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED' | 'NOT_SYNCED';
  errorMessage?: string;
}

/**
 * YouTube video metadata interface
 */
export interface YouTubeVideoMetadata {
  videoId: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: Date;
}

/**
 * YouTubeClient for integrating with YouTube Data API v3
 * Manages and syncs video metadata for music content
 */
export class YouTubeClient {
  private client: AxiosInstance;
  private apiKey: string;
  private syncStatus: Map<string, YouTubeSyncStatus> = new Map();

  constructor(apiKey: string, apiUrl: string = 'https://www.googleapis.com/youtube/v3') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: apiUrl,
      params: {
        key: apiKey,
      },
      timeout: 30000,
    });
  }

  /**
   * Sync track metadata to YouTube video
   */
  async syncTrackToVideo(track: TrackMetadata, videoId: string): Promise<YouTubeSyncStatus> {
    try {
      const payload = this.mapTrackToYouTubeFormat(track);
      
      // Update video metadata via YouTube API
      await this.client.put('/videos', {
        ...payload,
        id: videoId,
      });

      const status: YouTubeSyncStatus = {
        trackId: track.id,
        youtubeVideoId: videoId,
        lastSyncDate: new Date(),
        syncStatus: 'SYNCED',
      };

      this.syncStatus.set(track.id, status);
      return status;
    } catch (error) {
      const status: YouTubeSyncStatus = {
        trackId: track.id,
        youtubeVideoId: videoId,
        lastSyncDate: new Date(),
        syncStatus: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };

      this.syncStatus.set(track.id, status);
      return status;
    }
  }

  /**
   * Get video metadata from YouTube
   */
  async getVideoMetadata(videoId: string): Promise<YouTubeVideoMetadata> {
    try {
      const response = await this.client.get('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
        },
      });

      const video = response.data.items[0];
      return this.mapYouTubeVideoToMetadata(video);
    } catch (error) {
      throw new Error(`Failed to fetch video metadata: ${error}`);
    }
  }

  /**
   * Search for videos by track metadata
   */
  async searchVideosByTrack(track: TrackMetadata): Promise<YouTubeVideoMetadata[]> {
    try {
      const query = `${track.artist} ${track.title}`;
      const response = await this.client.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 10,
        },
      });

      const videoIds = response.data.items.map((item: Record<string, unknown>) => (item.id as Record<string, unknown>).videoId as string);
      
      // Fetch detailed metadata for found videos
      const videos: YouTubeVideoMetadata[] = [];
      for (const videoId of videoIds) {
        try {
          const metadata = await this.getVideoMetadata(videoId);
          videos.push(metadata);
        } catch (error) {
          // Skip videos that fail to fetch
          continue;
        }
      }

      return videos;
    } catch (error) {
      throw new Error(`Failed to search videos: ${error}`);
    }
  }

  /**
   * Get analytics for a YouTube video
   */
  async getVideoAnalytics(videoId: string): Promise<Record<string, unknown>> {
    try {
      const response = await this.client.get('/videos', {
        params: {
          part: 'statistics',
          id: videoId,
        },
      });

      return response.data.items[0].statistics;
    } catch (error) {
      throw new Error(`Failed to fetch video analytics: ${error}`);
    }
  }

  /**
   * Get sync status for a track
   */
  getSyncStatus(trackId: string): YouTubeSyncStatus | undefined {
    return this.syncStatus.get(trackId);
  }

  /**
   * Get all sync statuses
   */
  getAllSyncStatuses(): YouTubeSyncStatus[] {
    return Array.from(this.syncStatus.values());
  }

  /**
   * Map track metadata to YouTube format
   */
  private mapTrackToYouTubeFormat(track: TrackMetadata): Record<string, unknown> {
    return {
      snippet: {
        title: `${track.artist} - ${track.title}`,
        description: `${track.title} by ${track.artist}\nAlbum: ${track.album || 'Single'}\nGenre: ${track.genre}`,
        tags: [
          track.artist,
          track.title,
          track.genre,
          ...(track.tags || []),
        ],
        categoryId: '10', // Music category
      },
    };
  }

  /**
   * Map YouTube video data to metadata interface
   */
  private mapYouTubeVideoToMetadata(video: Record<string, unknown>): YouTubeVideoMetadata {
    const snippet = video.snippet as Record<string, unknown>;
    const contentDetails = video.contentDetails as Record<string, unknown>;
    const statistics = video.statistics as Record<string, unknown>;
    
    return {
      videoId: video.id as string,
      title: snippet.title as string,
      description: snippet.description as string,
      tags: (snippet.tags as string[]) || [],
      category: snippet.categoryId as string,
      duration: this.parseDuration(contentDetails.duration as string),
      viewCount: parseInt((statistics.viewCount as string) || '0'),
      likeCount: parseInt((statistics.likeCount as string) || '0'),
      commentCount: parseInt((statistics.commentCount as string) || '0'),
      publishedAt: new Date(snippet.publishedAt as string),
    };
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;

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
