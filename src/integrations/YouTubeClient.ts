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

      const videoIds = response.data.items.map((item: any) => item.id.videoId);
      
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
  private mapYouTubeVideoToMetadata(video: any): YouTubeVideoMetadata {
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      tags: video.snippet.tags || [],
      category: video.snippet.categoryId,
      duration: this.parseDuration(video.contentDetails.duration),
      viewCount: parseInt(video.statistics.viewCount || '0'),
      likeCount: parseInt(video.statistics.likeCount || '0'),
      commentCount: parseInt(video.statistics.commentCount || '0'),
      publishedAt: new Date(video.snippet.publishedAt),
    };
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }
}
