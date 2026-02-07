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
 * Publisher information for license tracking
 */
export interface PublisherInfo {
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  taxId?: string;
}

/**
 * PRO (Performance Rights Organization) identifiers
 */
export interface PROIdentifiers {
  bmi?: string; // BMI identifier
  ascap?: string; // ASCAP identifier
  sesac?: string; // SESAC identifier
  other?: { [key: string]: string }; // Other PRO identifiers
}

/**
 * Crypto wallet information for payments
 */
export interface CryptoWalletInfo {
  address: string;
  network: string; // e.g., 'Ethereum', 'Polygon', 'BSC'
  currency: string; // e.g., 'ETH', 'USDC', 'BTC'
  verified: boolean;
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
  // Enhanced publisher tracking
  publisher?: PublisherInfo;
  proIdentifiers?: PROIdentifiers;
  // Crypto payment support
  cryptoWallet?: CryptoWalletInfo;
  cryptoFee?: number;
  cryptoCurrency?: string;
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

/**
 * Brand performance report interface
 */
export interface BrandPerformanceReport {
  count: number;
  views: number;
  impressions: number;
  campaigns: number;
  revenue: number;
  reach: number;
}

/**
 * Brand placement stats interface
 */
export interface BrandPlacementStats {
  count: number;
  views: number;
  impressions: number;
}

/**
 * Brand analytics stats interface
 */
export interface BrandAnalyticsStats {
  campaigns: number;
  revenue: number;
  reach: number;
  impressions: number;
}

/**
 * Sort by metric type for analytics
 */
export type SortByMetric = 'revenue' | 'reach' | 'impressions';
