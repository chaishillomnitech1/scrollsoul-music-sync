import { Track } from '../models/Track';
import { TrackMetadata } from '../types';

/**
 * TrackService handles all track-related operations
 */
export class TrackService {
  private tracks: Map<string, Track> = new Map();

  /**
   * Create a new track
   */
  createTrack(data: Omit<TrackMetadata, 'id' | 'createdAt' | 'updatedAt'>): Track {
    const track = new Track(data);
    const validation = track.validate();

    if (!validation.valid) {
      throw new Error(`Invalid track data: ${validation.errors.join(', ')}`);
    }

    this.tracks.set(track.id, track);
    return track;
  }

  /**
   * Get track by ID
   */
  getTrack(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  /**
   * Get all tracks
   */
  getAllTracks(): Track[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Update track
   */
  updateTrack(id: string, data: Partial<Omit<TrackMetadata, 'id' | 'createdAt'>>): Track {
    const track = this.tracks.get(id);
    if (!track) {
      throw new Error(`Track not found: ${id}`);
    }

    track.update(data);
    const validation = track.validate();

    if (!validation.valid) {
      throw new Error(`Invalid track data: ${validation.errors.join(', ')}`);
    }

    return track;
  }

  /**
   * Delete track
   */
  deleteTrack(id: string): boolean {
    return this.tracks.delete(id);
  }

  /**
   * Search tracks by criteria
   */
  searchTracks(criteria: {
    artist?: string;
    genre?: string;
    mood?: string;
    tag?: string;
  }): Track[] {
    return Array.from(this.tracks.values()).filter((track) => {
      if (criteria.artist && !track.artist.toLowerCase().includes(criteria.artist.toLowerCase())) {
        return false;
      }
      if (criteria.genre && !track.genre.toLowerCase().includes(criteria.genre.toLowerCase())) {
        return false;
      }
      if (criteria.mood && !track.mood?.some((m) => m.toLowerCase().includes(criteria.mood!.toLowerCase()))) {
        return false;
      }
      if (criteria.tag && !track.tags?.some((t) => t.toLowerCase().includes(criteria.tag!.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get tracks by ISRC
   */
  getTrackByISRC(isrc: string): Track | undefined {
    return Array.from(this.tracks.values()).find((track) => track.isrc === isrc);
  }

  /**
   * Get track count
   */
  getTrackCount(): number {
    return this.tracks.size;
  }
}
