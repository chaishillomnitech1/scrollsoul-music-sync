/**
 * Track metadata interface for comprehensive music management
 */
export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  genre: string;
  isrc?: string; // International Standard Recording Code
  iswc?: string; // International Standard Musical Work Code
  releaseDate?: Date;
  bpm?: number;
  key?: string;
  mood?: string[];
  tags?: string[];
  audioFileUrl?: string;
  coverArtUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * License types for music sync
 */
export enum LicenseType {
  SYNC = 'SYNC',
  MASTER = 'MASTER',
  MECHANICAL = 'MECHANICAL',
  PERFORMANCE = 'PERFORMANCE',
  PRINT = 'PRINT',
}

/**
 * License interface for tracking music licensing
 */
export interface License {
  id: string;
  trackId: string;
  licenseType: LicenseType;
  licensee: string; // Company/entity that licensed the music
  territory: string[]; // Geographic territories covered
  startDate: Date;
  endDate?: Date;
  fee: number;
  currency: string;
  terms?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'TERMINATED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Placement interface for tracking where music is used
 */
export interface Placement {
  id: string;
  trackId: string;
  licenseId: string;
  campaign: string; // e.g., "Nike Air Max 2024", "NCAA March Madness"
  brand: string; // e.g., "Nike", "NCAA"
  mediaType: 'TV' | 'FILM' | 'STREAMING' | 'SPORTS' | 'ADVERTISING' | 'GAME' | 'OTHER';
  airDate?: Date;
  territory: string[];
  viewCount?: number;
  impressions?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Royalty interface for tracking and automating royalty payments
 */
export interface Royalty {
  id: string;
  trackId: string;
  placementId?: string;
  amount: number;
  currency: string;
  payee: string; // Artist, writer, publisher, etc.
  payeeType: 'ARTIST' | 'WRITER' | 'PUBLISHER' | 'LABEL' | 'OTHER';
  percentage?: number; // Percentage split if applicable
  periodStart: Date;
  periodEnd: Date;
  status: 'PENDING' | 'CALCULATED' | 'PAID' | 'DISPUTED';
  paidDate?: Date;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Campaign analytics interface
 */
export interface CampaignAnalytics {
  id: string;
  placementId: string;
  campaign: string;
  brand: string;
  totalReach: number;
  totalImpressions: number;
  engagementRate?: number;
  totalRevenue: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  metrics: {
    [key: string]: number | string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vydia sync status interface
 */
export interface VydiaSyncStatus {
  trackId: string;
  vydiaAssetId?: string;
  lastSyncDate: Date;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED' | 'NOT_SYNCED';
  errorMessage?: string;
}
