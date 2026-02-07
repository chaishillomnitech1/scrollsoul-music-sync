import { v4 as uuidv4 } from 'uuid';
import { Placement as IPlacement } from '../types';

/**
 * Placement class for tracking where music is used
 */
export class Placement implements IPlacement {
  id: string;
  trackId: string;
  licenseId: string;
  campaign: string;
  brand: string;
  mediaType: 'TV' | 'FILM' | 'STREAMING' | 'SPORTS' | 'ADVERTISING' | 'GAME' | 'OTHER';
  airDate?: Date;
  territory: string[];
  viewCount?: number;
  impressions?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<IPlacement, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = uuidv4();
    this.trackId = data.trackId;
    this.licenseId = data.licenseId;
    this.campaign = data.campaign;
    this.brand = data.brand;
    this.mediaType = data.mediaType;
    this.airDate = data.airDate;
    this.territory = data.territory;
    this.viewCount = data.viewCount || 0;
    this.impressions = data.impressions || 0;
    this.notes = data.notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update placement data
   */
  update(data: Partial<Omit<IPlacement, 'id' | 'createdAt'>>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  /**
   * Update view count
   */
  incrementViews(count: number = 1): void {
    this.viewCount = (this.viewCount || 0) + count;
    this.updatedAt = new Date();
  }

  /**
   * Update impressions
   */
  incrementImpressions(count: number): void {
    this.impressions = (this.impressions || 0) + count;
    this.updatedAt = new Date();
  }

  /**
   * Convert to JSON
   */
  toJSON(): IPlacement {
    return {
      id: this.id,
      trackId: this.trackId,
      licenseId: this.licenseId,
      campaign: this.campaign,
      brand: this.brand,
      mediaType: this.mediaType,
      airDate: this.airDate,
      territory: this.territory,
      viewCount: this.viewCount,
      impressions: this.impressions,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
