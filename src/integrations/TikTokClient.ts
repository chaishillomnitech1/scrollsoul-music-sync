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

      return response.data.sounds.map((sound: Record<string, unknown>) => ({
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

      return response.data.videos.map((video: Record<string, unknown>) => ({
        videoId: video.video_id,
        soundId: soundId,
        authorId: video.author_id,
        authorName: video.author_name,
        viewCount: video.view_count || 0,
        likeCount: video.like_count || 0,
        shareCount: video.share_count || 0,
        commentCount: video.comment_count || 0,
        createdAt: new Date(video.created_at as string),
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

      return response.data.sounds.map((sound: Record<string, unknown>, index: number) => ({
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

/**
 * TikTok API Integration Client
 * Handles video uploads, metadata sync, and analytics for TikTok
 */

export interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  coverImageUrl: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export interface TikTokUploadOptions {
  videoUrl: string;
  title: string;
  description: string;
  privacyLevel: 'PUBLIC' | 'FRIENDS' | 'SELF';
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
}

export interface TikTokAnalytics {
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  playDuration: number;
  averageWatchTime: number;
  reachRate: number;
  engagementRate: number;
}

export interface TikTokMusicInfo {
  musicId: string;
  musicTitle: string;
  musicAuthor: string;
  musicUrl: string;
  duration: number;
}

export class TikTokClient {
  private accessToken: string;
  private clientKey: string;
  private clientSecret: string;
  private client: AxiosInstance;
  private baseUrl: string = 'https://open.tiktokapis.com/v2';

  constructor(config: {
    accessToken: string;
    clientKey: string;
    clientSecret: string;
  }) {
    this.accessToken = config.accessToken;
    this.clientKey = config.clientKey;
    this.clientSecret = config.clientSecret;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  /**
   * Set new access token
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Upload video to TikTok
   */
  async uploadVideo(options: TikTokUploadOptions): Promise<string> {
    try {
      const uploadData = {
        post_info: {
          title: options.title,
          description: options.description,
          privacy_level: options.privacyLevel,
          disable_comment: options.disableComment ?? false,
          disable_duet: options.disableDuet ?? false,
          disable_stitch: options.disableStitch ?? false,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_url: options.videoUrl,
        },
      };

      const response = await this.client.post('/post/publish/video/init/', uploadData);

      if (response.data.data && response.data.data.publish_id) {
        return response.data.data.publish_id;
      }

      throw new Error('Failed to get publish ID from TikTok');
    } catch (error) {
      console.error('Error uploading TikTok video:', error);
      throw error;
    }
  }

  /**
   * Get video details by ID
   */
  async getVideo(videoId: string): Promise<TikTokVideo | null> {
    try {
      const response = await this.client.post('/video/query/', {
        filters: {
          video_ids: [videoId],
        },
      });

      if (response.data.data && response.data.data.videos && response.data.data.videos.length > 0) {
        const video = response.data.data.videos[0];
        return {
          id: video.id,
          title: video.title || '',
          description: video.video_description || '',
          videoUrl: video.share_url || '',
          coverImageUrl: video.cover_image_url || '',
          duration: video.duration || 0,
          views: video.view_count || 0,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          createdAt: video.create_time ? new Date(video.create_time * 1000).toISOString() : '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching TikTok video:', error);
      throw error;
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<TikTokAnalytics | null> {
    try {
      const response = await this.client.post('/video/query/', {
        filters: {
          video_ids: [videoId],
        },
        fields: [
          'id',
          'view_count',
          'like_count',
          'comment_count',
          'share_count',
          'duration',
        ],
      });

      if (response.data.data && response.data.data.videos && response.data.data.videos.length > 0) {
        const video = response.data.data.videos[0];
        const views = video.view_count || 0;
        const engagement = (video.like_count || 0) + (video.comment_count || 0) + (video.share_count || 0);

        return {
          videoId: video.id,
          views: views,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          playDuration: video.duration || 0,
          averageWatchTime: views > 0 ? (video.duration || 0) * 0.6 : 0, // Estimated
          reachRate: 0, // Not available in basic API
          engagementRate: views > 0 ? (engagement / views) * 100 : 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching TikTok analytics:', error);
      throw error;
    }
  }

  /**
   * Search videos by keyword
   */
  async searchVideos(keyword: string, count: number = 20): Promise<TikTokVideo[]> {
    try {
      const response = await this.client.post('/video/search/', {
        query: {
          keyword: keyword,
          count: count,
        },
      });

      if (response.data.data && response.data.data.videos) {
        return response.data.data.videos.map((video: any) => ({
          id: video.id,
          title: video.title || '',
          description: video.video_description || '',
          videoUrl: video.share_url || '',
          coverImageUrl: video.cover_image_url || '',
          duration: video.duration || 0,
          views: video.view_count || 0,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          createdAt: video.create_time ? new Date(video.create_time * 1000).toISOString() : '',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching TikTok videos:', error);
      throw error;
    }
  }

  /**
   * Get user's videos
   */
  async getUserVideos(maxCount: number = 20): Promise<TikTokVideo[]> {
    try {
      const response = await this.client.post('/video/list/', {
        max_count: maxCount,
      });

      if (response.data.data && response.data.data.videos) {
        return response.data.data.videos.map((video: any) => ({
          id: video.id,
          title: video.title || '',
          description: video.video_description || '',
          videoUrl: video.share_url || '',
          coverImageUrl: video.cover_image_url || '',
          duration: video.duration || 0,
          views: video.view_count || 0,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          createdAt: video.create_time ? new Date(video.create_time * 1000).toISOString() : '',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching user TikTok videos:', error);
      throw error;
    }
  }

  /**
   * Sync track metadata to TikTok video
   */
  async syncTrackToVideo(
    videoUrl: string,
    trackData: {
      title: string;
      artist: string;
      album?: string;
      genre?: string;
      duration?: number;
      isrc?: string;
    }
  ): Promise<string> {
    const title = `${trackData.artist} - ${trackData.title}`;
    const description = this.generateMusicDescription(trackData);

    const uploadOptions: TikTokUploadOptions = {
      videoUrl,
      title: title.substring(0, 150), // TikTok title limit
      description: description.substring(0, 2200), // TikTok description limit
      privacyLevel: 'PUBLIC',
      disableComment: false,
      disableDuet: false,
      disableStitch: false,
    };

    return this.uploadVideo(uploadOptions);
  }

  /**
   * Generate music video description
   */
  private generateMusicDescription(trackData: {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    isrc?: string;
  }): string {
    let description = `🎵 ${trackData.artist} - ${trackData.title}\n\n`;

    if (trackData.album) {
      description += `💿 Album: ${trackData.album}\n`;
    }
    if (trackData.genre) {
      description += `🎸 Genre: ${trackData.genre}\n`;
    }

    description += '\n✨ Powered by ScrollSoul Music Sync\n';
    description += '📡 Automated music distribution\n';
    description += '\n#music #scrollsoul';

    if (trackData.genre) {
      description += ` #${trackData.genre.toLowerCase().replace(/\s+/g, '')}`;
    }

    return description;
  }

  /**
   * Get music info from video
   */
  async getMusicInfo(videoId: string): Promise<TikTokMusicInfo | null> {
    try {
      const response = await this.client.post('/video/query/', {
        filters: {
          video_ids: [videoId],
        },
        fields: ['music_info'],
      });

      if (response.data.data && response.data.data.videos && response.data.data.videos.length > 0) {
        const music = response.data.data.videos[0].music_info;
        if (music) {
          return {
            musicId: music.id,
            musicTitle: music.title,
            musicAuthor: music.author,
            musicUrl: music.play_url,
            duration: music.duration,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching TikTok music info:', error);
      throw error;
    }
  }

  /**
   * Check video publish status
   */
  async checkPublishStatus(publishId: string): Promise<{
    status: string;
    videoId?: string;
    failReason?: string;
  }> {
    try {
      const response = await this.client.post('/post/publish/status/fetch/', {
        publish_id: publishId,
      });

      if (response.data.data) {
        return {
          status: response.data.data.status,
          videoId: response.data.data.video_id,
          failReason: response.data.data.fail_reason,
        };
      }

      return { status: 'UNKNOWN' };
    } catch (error) {
      console.error('Error checking TikTok publish status:', error);
      throw error;
    }
  }
}
