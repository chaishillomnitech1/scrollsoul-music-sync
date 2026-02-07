import axios, { AxiosInstance } from 'axios';
import { TrackMetadata } from '../types';

/**
 * TikTok sync status interface
 */
export interface TikTokSyncStatus {
  trackId: string;
  tiktokSoundId?: string;
  lastSyncDate: Date;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED' | 'NOT_SYNCED';
  errorMessage?: string;
}

/**
 * TikTok music analytics interface
 */
export interface TikTokMusicAnalytics {
  soundId: string;
  title: string;
  artist: string;
  videoCount: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  trending: boolean;
  trendingRank?: number;
  lastUpdated: Date;
}

/**
 * TikTok video usage interface
 */
export interface TikTokVideoUsage {
  videoId: string;
  soundId: string;
  authorId: string;
  authorName: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  createdAt: Date;
}

/**
 * TikTokClient for integrating with TikTok API
 * Manages music analytics for short-form video synchronizations
 */
export class TikTokClient {
  private client: AxiosInstance;
  private apiKey: string;
  private syncStatus: Map<string, TikTokSyncStatus> = new Map();

  constructor(apiKey: string, apiUrl: string = 'https://open-api.tiktok.com/v1') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Sync track to TikTok sound library
   */
  async syncTrack(track: TrackMetadata): Promise<TikTokSyncStatus> {
    try {
      const payload = this.mapTrackToTikTokFormat(track);
      const response = await this.client.post('/sounds', payload);

      const status: TikTokSyncStatus = {
        trackId: track.id,
        tiktokSoundId: response.data.sound_id,
        lastSyncDate: new Date(),
        syncStatus: 'SYNCED',
      };

      this.syncStatus.set(track.id, status);
      return status;
    } catch (error) {
      const status: TikTokSyncStatus = {
        trackId: track.id,
        lastSyncDate: new Date(),
        syncStatus: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };

      this.syncStatus.set(track.id, status);
      return status;
    }
  }

  /**
   * Get music analytics from TikTok
   */
  async getMusicAnalytics(soundId: string): Promise<TikTokMusicAnalytics> {
    try {
      const response = await this.client.get(`/sounds/${soundId}/analytics`);
      const data = response.data;

      return {
        soundId: data.sound_id,
        title: data.title,
        artist: data.artist,
        videoCount: data.video_count || 0,
        viewCount: data.total_views || 0,
        likeCount: data.total_likes || 0,
        shareCount: data.total_shares || 0,
        trending: data.is_trending || false,
        trendingRank: data.trending_rank,
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch TikTok analytics: ${error}`);
    }
  }

  /**
   * Search for sounds by track metadata
   */
  async searchSounds(track: TrackMetadata): Promise<TikTokMusicAnalytics[]> {
    try {
      const query = `${track.artist} ${track.title}`;
      const response = await this.client.get('/sounds/search', {
        params: {
          q: query,
          limit: 20,
        },
      });

      return response.data.sounds.map((sound: any) => ({
        soundId: sound.sound_id,
        title: sound.title,
        artist: sound.artist,
        videoCount: sound.video_count || 0,
        viewCount: sound.total_views || 0,
        likeCount: sound.total_likes || 0,
        shareCount: sound.total_shares || 0,
        trending: sound.is_trending || false,
        trendingRank: sound.trending_rank,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      throw new Error(`Failed to search TikTok sounds: ${error}`);
    }
  }

  /**
   * Get videos using a specific sound
   */
  async getVideosBySoundId(soundId: string, limit: number = 20): Promise<TikTokVideoUsage[]> {
    try {
      const response = await this.client.get(`/sounds/${soundId}/videos`, {
        params: {
          limit,
        },
      });

      return response.data.videos.map((video: any) => ({
        videoId: video.video_id,
        soundId: soundId,
        authorId: video.author_id,
        authorName: video.author_name,
        viewCount: video.view_count || 0,
        likeCount: video.like_count || 0,
        shareCount: video.share_count || 0,
        commentCount: video.comment_count || 0,
        createdAt: new Date(video.created_at),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch videos by sound: ${error}`);
    }
  }

  /**
   * Get trending sounds
   */
  async getTrendingSounds(limit: number = 50): Promise<TikTokMusicAnalytics[]> {
    try {
      const response = await this.client.get('/sounds/trending', {
        params: {
          limit,
        },
      });

      return response.data.sounds.map((sound: any, index: number) => ({
        soundId: sound.sound_id,
        title: sound.title,
        artist: sound.artist,
        videoCount: sound.video_count || 0,
        viewCount: sound.total_views || 0,
        likeCount: sound.total_likes || 0,
        shareCount: sound.total_shares || 0,
        trending: true,
        trendingRank: index + 1,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch trending sounds: ${error}`);
    }
  }

  /**
   * Get comprehensive analytics for track
   */
  async getTrackAnalytics(trackId: string): Promise<Record<string, unknown>> {
    const syncStatus = this.syncStatus.get(trackId);
    if (!syncStatus || !syncStatus.tiktokSoundId) {
      throw new Error('Track not synced to TikTok');
    }

    const analytics = await this.getMusicAnalytics(syncStatus.tiktokSoundId);
    const videos = await this.getVideosBySoundId(syncStatus.tiktokSoundId);

    return {
      analytics,
      videoUsage: videos,
      totalEngagement: analytics.likeCount + analytics.shareCount + analytics.viewCount,
      averageViewsPerVideo: videos.length > 0 ? analytics.viewCount / videos.length : 0,
    };
  }

  /**
   * Get sync status for a track
   */
  getSyncStatus(trackId: string): TikTokSyncStatus | undefined {
    return this.syncStatus.get(trackId);
  }

  /**
   * Get all sync statuses
   */
  getAllSyncStatuses(): TikTokSyncStatus[] {
    return Array.from(this.syncStatus.values());
  }

  /**
   * Map track metadata to TikTok format
   */
  private mapTrackToTikTokFormat(track: TrackMetadata): Record<string, unknown> {
    return {
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      genre: track.genre,
      audio_url: track.audioFileUrl,
      cover_url: track.coverArtUrl,
      metadata: {
        isrc: track.isrc,
        bpm: track.bpm,
        key: track.key,
        mood: track.mood,
        tags: track.tags,
      },
    };
  }
}
