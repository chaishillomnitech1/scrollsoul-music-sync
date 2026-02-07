import { v4 as uuidv4 } from 'uuid';
import { TrackMetadata } from '../types';

/**
 * Track class for comprehensive track metadata management
 */
export class Track implements TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre: string;
  isrc?: string;
  iswc?: string;
  releaseDate?: Date;
  bpm?: number;
  key?: string;
  mood?: string[];
  tags?: string[];
  audioFileUrl?: string;
  coverArtUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<TrackMetadata, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = uuidv4();
    this.title = data.title;
    this.artist = data.artist;
    this.album = data.album;
    this.duration = data.duration;
    this.genre = data.genre;
    this.isrc = data.isrc;
    this.iswc = data.iswc;
    this.releaseDate = data.releaseDate;
    this.bpm = data.bpm;
    this.key = data.key;
    this.mood = data.mood || [];
    this.tags = data.tags || [];
    this.audioFileUrl = data.audioFileUrl;
    this.coverArtUrl = data.coverArtUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update track metadata
   */
  update(data: Partial<Omit<TrackMetadata, 'id' | 'createdAt'>>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  /**
   * Validate track metadata
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!this.artist || this.artist.trim().length === 0) {
      errors.push('Artist is required');
    }

    if (this.duration <= 0) {
      errors.push('Duration must be greater than 0');
    }

    if (!this.genre || this.genre.trim().length === 0) {
      errors.push('Genre is required');
    }

    if (this.isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(this.isrc)) {
      errors.push('Invalid ISRC format');
    }

    if (this.bpm && (this.bpm < 20 || this.bpm > 300)) {
      errors.push('BPM must be between 20 and 300');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert to JSON
   */
  toJSON(): TrackMetadata {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      album: this.album,
      duration: this.duration,
      genre: this.genre,
      isrc: this.isrc,
      iswc: this.iswc,
      releaseDate: this.releaseDate,
      bpm: this.bpm,
      key: this.key,
      mood: this.mood,
      tags: this.tags,
      audioFileUrl: this.audioFileUrl,
      coverArtUrl: this.coverArtUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
