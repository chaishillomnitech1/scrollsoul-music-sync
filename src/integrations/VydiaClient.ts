import axios, { AxiosInstance } from 'axios';
import { TrackMetadata, VydiaSyncStatus } from '../types';

/**
 * VydiaClient for integrating with Vydia API for real-time sync
 */
export class VydiaClient {
  private client: AxiosInstance;
  private apiKey: string;
  private syncStatus: Map<string, VydiaSyncStatus> = new Map();

  constructor(apiKey: string, apiUrl: string = 'https://api.vydia.com/v1') {
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
   * Sync track to Vydia
   */
  async syncTrack(track: TrackMetadata): Promise<VydiaSyncStatus> {
    try {
      const payload = this.mapTrackToVydiaFormat(track);
      const response = await this.client.post('/assets', payload);

      const status: VydiaSyncStatus = {
        trackId: track.id,
        vydiaAssetId: response.data.id,
        lastSyncDate: new Date(),
        syncStatus: 'SYNCED',
      };

      this.syncStatus.set(track.id, status);
      return status;
    } catch (error) {
      const status: VydiaSyncStatus = {
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
   * Update track in Vydia
   */
  async updateTrack(track: TrackMetadata, vydiaAssetId: string): Promise<VydiaSyncStatus> {
    try {
      const payload = this.mapTrackToVydiaFormat(track);
      await this.client.put(`/assets/${vydiaAssetId}`, payload);

      const status: VydiaSyncStatus = {
        trackId: track.id,
        vydiaAssetId,
        lastSyncDate: new Date(),
        syncStatus: 'SYNCED',
      };

      this.syncStatus.set(track.id, status);
      return status;
    } catch (error) {
      const status: VydiaSyncStatus = {
        trackId: track.id,
        vydiaAssetId,
        lastSyncDate: new Date(),
        syncStatus: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };

      this.syncStatus.set(track.id, status);
      return status;
    }
  }

  /**
   * Get sync status for a track
   */
  getSyncStatus(trackId: string): VydiaSyncStatus | undefined {
    return this.syncStatus.get(trackId);
  }

  /**
   * Get all sync statuses
   */
  getAllSyncStatuses(): VydiaSyncStatus[] {
    return Array.from(this.syncStatus.values());
  }

  /**
   * Sync multiple tracks
   */
  async syncMultipleTracks(tracks: TrackMetadata[]): Promise<VydiaSyncStatus[]> {
    const results: VydiaSyncStatus[] = [];

    for (const track of tracks) {
      const status = await this.syncTrack(track);
      results.push(status);
    }

    return results;
  }

  /**
   * Get track from Vydia
   */
  async getTrackFromVydia(vydiaAssetId: string): Promise<any> {
    try {
      const response = await this.client.get(`/assets/${vydiaAssetId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch track from Vydia: ${error}`);
    }
  }

  /**
   * Delete track from Vydia
   */
  async deleteTrackFromVydia(vydiaAssetId: string): Promise<boolean> {
    try {
      await this.client.delete(`/assets/${vydiaAssetId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get analytics from Vydia
   */
  async getVydiaAnalytics(vydiaAssetId: string): Promise<any> {
    try {
      const response = await this.client.get(`/assets/${vydiaAssetId}/analytics`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch analytics from Vydia: ${error}`);
    }
  }

  /**
   * Handle Vydia webhook
   */
  handleWebhook(payload: any): void {
    // Process webhook payload from Vydia
    // Update sync status based on webhook data
    if (payload.event === 'asset.updated' && payload.data) {
      const trackId = this.findTrackIdByVydiaAssetId(payload.data.id);
      if (trackId) {
        const status: VydiaSyncStatus = {
          trackId,
          vydiaAssetId: payload.data.id,
          lastSyncDate: new Date(),
          syncStatus: 'SYNCED',
        };
        this.syncStatus.set(trackId, status);
      }
    }
  }

  /**
   * Map track metadata to Vydia format
   */
  private mapTrackToVydiaFormat(track: TrackMetadata): any {
    return {
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      genre: track.genre,
      isrc: track.isrc,
      iswc: track.iswc,
      releaseDate: track.releaseDate,
      metadata: {
        bpm: track.bpm,
        key: track.key,
        mood: track.mood,
        tags: track.tags,
      },
      audioUrl: track.audioFileUrl,
      artworkUrl: track.coverArtUrl,
    };
  }

  /**
   * Find track ID by Vydia asset ID
   */
  private findTrackIdByVydiaAssetId(vydiaAssetId: string): string | undefined {
    for (const [trackId, status] of this.syncStatus.entries()) {
      if (status.vydiaAssetId === vydiaAssetId) {
        return trackId;
      }
    }
    return undefined;
  }
}
