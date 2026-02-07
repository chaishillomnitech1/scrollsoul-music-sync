import { Placement } from '../models/Placement';
import { Placement as IPlacement } from '../types';

/**
 * PlacementService handles tracking where music is used
 */
export class PlacementService {
  private placements: Map<string, Placement> = new Map();

  /**
   * Create a new placement
   */
  createPlacement(data: Omit<IPlacement, 'id' | 'createdAt' | 'updatedAt'>): Placement {
    const placement = new Placement(data);
    this.placements.set(placement.id, placement);
    return placement;
  }

  /**
   * Get placement by ID
   */
  getPlacement(id: string): Placement | undefined {
    return this.placements.get(id);
  }

  /**
   * Get all placements
   */
  getAllPlacements(): Placement[] {
    return Array.from(this.placements.values());
  }

  /**
   * Get placements by track
   */
  getPlacementsByTrack(trackId: string): Placement[] {
    return Array.from(this.placements.values()).filter(
      (placement) => placement.trackId === trackId
    );
  }

  /**
   * Get placements by brand
   */
  getPlacementsByBrand(brand: string): Placement[] {
    return Array.from(this.placements.values()).filter(
      (placement) => placement.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }

  /**
   * Get placements by campaign
   */
  getPlacementsByCampaign(campaign: string): Placement[] {
    return Array.from(this.placements.values()).filter(
      (placement) => placement.campaign.toLowerCase().includes(campaign.toLowerCase())
    );
  }

  /**
   * Get placements by media type
   */
  getPlacementsByMediaType(
    mediaType: 'TV' | 'FILM' | 'STREAMING' | 'SPORTS' | 'ADVERTISING' | 'GAME' | 'OTHER'
  ): Placement[] {
    return Array.from(this.placements.values()).filter(
      (placement) => placement.mediaType === mediaType
    );
  }

  /**
   * Update placement
   */
  updatePlacement(id: string, data: Partial<Omit<IPlacement, 'id' | 'createdAt'>>): Placement {
    const placement = this.placements.get(id);
    if (!placement) {
      throw new Error(`Placement not found: ${id}`);
    }

    placement.update(data);
    return placement;
  }

  /**
   * Delete placement
   */
  deletePlacement(id: string): boolean {
    return this.placements.delete(id);
  }

  /**
   * Get total views
   */
  getTotalViews(): number {
    return Array.from(this.placements.values()).reduce(
      (total, placement) => total + (placement.viewCount || 0),
      0
    );
  }

  /**
   * Get total impressions
   */
  getTotalImpressions(): number {
    return Array.from(this.placements.values()).reduce(
      (total, placement) => total + (placement.impressions || 0),
      0
    );
  }

  /**
   * Get placement stats by brand
   */
  getStatsByBrand(): Map<string, { count: number; views: number; impressions: number }> {
    const stats = new Map<string, { count: number; views: number; impressions: number }>();

    Array.from(this.placements.values()).forEach((placement) => {
      const current = stats.get(placement.brand) || { count: 0, views: 0, impressions: 0 };
      stats.set(placement.brand, {
        count: current.count + 1,
        views: current.views + (placement.viewCount || 0),
        impressions: current.impressions + (placement.impressions || 0),
      });
    });

    return stats;
  }
}
