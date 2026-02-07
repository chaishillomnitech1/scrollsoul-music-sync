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
