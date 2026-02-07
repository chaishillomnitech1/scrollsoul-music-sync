import axios, { AxiosInstance } from 'axios';
import { TrackMetadata } from '../types';

/**
 * VR sync status interface
 */
export interface VRSyncStatus {
  trackId: string;
  vrAssetId?: string;
  lastSyncDate: Date;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED' | 'NOT_SYNCED';
  errorMessage?: string;
}

/**
 * VR platform types
 */
export enum VRPlatform {
  META_QUEST = 'META_QUEST',
  OCULUS = 'OCULUS',
  STEAMVR = 'STEAMVR',
  PSVR = 'PSVR',
  VIVEPORT = 'VIVEPORT',
  WEBXR = 'WEBXR',
}

/**
 * VR spatial audio configuration
 */
export interface VRSpatialAudioConfig {
  spatializationEnabled: boolean;
  minDistance: number;
  maxDistance: number;
  rolloffFactor: number;
  dopplerLevel: number;
  reverbZone?: string;
}

/**
 * VR music experience metadata
 */
export interface VRMusicExperience {
  id: string;
  trackId: string;
  title: string;
  description: string;
  platform: VRPlatform[];
  spatialAudio: VRSpatialAudioConfig;
  environmentType: 'CONCERT' | 'STUDIO' | 'AMBIENT' | 'INTERACTIVE' | 'CUSTOM';
  interactiveElements: boolean;
  maxUsers: number;
  viewCount: number;
  sessionDuration: number; // average in seconds
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * VR session analytics
 */
export interface VRSessionAnalytics {
  experienceId: string;
  totalSessions: number;
  uniqueUsers: number;
  averageDuration: number;
  completionRate: number;
  interactionCount: number;
  platformDistribution: Record<VRPlatform, number>;
  peakConcurrentUsers: number;
  lastUpdated: Date;
}

/**
 * VRSpaceClient for integrating with VR platforms
 * Manages immersive music syncing for virtual reality experiences
 */
export class VRSpaceClient {
  private client: AxiosInstance;
  private apiKey: string;
  private syncStatus: Map<string, VRSyncStatus> = new Map();

  constructor(apiKey: string, apiUrl: string = 'https://api.vrspace.io/v1') {
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
   * Sync track to VR space
   */
  async syncTrack(track: TrackMetadata, config: Partial<VRMusicExperience>): Promise<VRSyncStatus> {
    try {
      const payload = this.mapTrackToVRFormat(track, config);
      const response = await this.client.post('/experiences', payload);

      const status: VRSyncStatus = {
        trackId: track.id,
        vrAssetId: response.data.id,
        lastSyncDate: new Date(),
        syncStatus: 'SYNCED',
      };

      this.syncStatus.set(track.id, status);
      return status;
    } catch (error) {
      const status: VRSyncStatus = {
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
   * Update VR experience
   */
  async updateExperience(experienceId: string, updates: Partial<VRMusicExperience>): Promise<VRMusicExperience> {
    try {
      const response = await this.client.put(`/experiences/${experienceId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update VR experience: ${error}`);
    }
  }

  /**
   * Get VR experience details
   */
  async getExperience(experienceId: string): Promise<VRMusicExperience> {
    try {
      const response = await this.client.get(`/experiences/${experienceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch VR experience: ${error}`);
    }
  }

  /**
   * Get VR session analytics
   */
  async getSessionAnalytics(experienceId: string): Promise<VRSessionAnalytics> {
    try {
      const response = await this.client.get(`/experiences/${experienceId}/analytics`);
      return {
        experienceId: response.data.experience_id,
        totalSessions: response.data.total_sessions || 0,
        uniqueUsers: response.data.unique_users || 0,
        averageDuration: response.data.average_duration || 0,
        completionRate: response.data.completion_rate || 0,
        interactionCount: response.data.interaction_count || 0,
        platformDistribution: response.data.platform_distribution || {},
        peakConcurrentUsers: response.data.peak_concurrent_users || 0,
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch VR analytics: ${error}`);
    }
  }

  /**
   * Search VR experiences by track
   */
  async searchExperiences(query: string, platform?: VRPlatform): Promise<VRMusicExperience[]> {
    try {
      const params: Record<string, unknown> = { q: query };
      if (platform) {
        params.platform = platform;
      }

      const response = await this.client.get('/experiences/search', { params });
      return response.data.experiences;
    } catch (error) {
      throw new Error(`Failed to search VR experiences: ${error}`);
    }
  }

  /**
   * Deploy experience to specific VR platform
   */
  async deployToPlatform(experienceId: string, platform: VRPlatform): Promise<boolean> {
    try {
      await this.client.post(`/experiences/${experienceId}/deploy`, {
        platform,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Configure spatial audio for experience
   */
  async configureSpatialAudio(
    experienceId: string,
    config: VRSpatialAudioConfig
  ): Promise<VRMusicExperience> {
    try {
      const response = await this.client.put(`/experiences/${experienceId}/audio`, {
        spatial_audio: config,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to configure spatial audio: ${error}`);
    }
  }

  /**
   * Get trending VR music experiences
   */
  async getTrendingExperiences(limit: number = 20): Promise<VRMusicExperience[]> {
    try {
      const response = await this.client.get('/experiences/trending', {
        params: { limit },
      });
      return response.data.experiences;
    } catch (error) {
      throw new Error(`Failed to fetch trending experiences: ${error}`);
    }
  }

  /**
   * Get sync status for a track
   */
  getSyncStatus(trackId: string): VRSyncStatus | undefined {
    return this.syncStatus.get(trackId);
  }

  /**
   * Get all sync statuses
   */
  getAllSyncStatuses(): VRSyncStatus[] {
    return Array.from(this.syncStatus.values());
  }

  /**
   * Map track metadata to VR format
   */
  private mapTrackToVRFormat(
    track: TrackMetadata,
    config: Partial<VRMusicExperience>
  ): Record<string, unknown> {
    const defaultSpatialAudio: VRSpatialAudioConfig = {
      spatializationEnabled: true,
      minDistance: 1,
      maxDistance: 500,
      rolloffFactor: 1,
      dopplerLevel: 1,
    };

    return {
      track_id: track.id,
      title: config.title || `${track.artist} - ${track.title}`,
      description: config.description || `Immersive VR experience for ${track.title}`,
      platform: config.platform || [VRPlatform.WEBXR],
      spatial_audio: config.spatialAudio || defaultSpatialAudio,
      environment_type: config.environmentType || 'AMBIENT',
      interactive_elements: config.interactiveElements || false,
      max_users: config.maxUsers || 100,
      audio_url: track.audioFileUrl,
      cover_url: track.coverArtUrl,
      metadata: {
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        genre: track.genre,
        bpm: track.bpm,
        key: track.key,
        mood: track.mood,
      },
    };
  }
}
