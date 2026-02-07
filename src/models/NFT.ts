import { v4 as uuidv4 } from 'uuid';

/**
 * NFT standard types
 */
export enum NFTStandard {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  SPL = 'SPL', // Solana
}

/**
 * Blockchain platforms
 */
export enum Blockchain {
  ETHEREUM = 'ETHEREUM',
  POLYGON = 'POLYGON',
  SOLANA = 'SOLANA',
  BINANCE_SMART_CHAIN = 'BSC',
}

/**
 * NFT marketplace platforms
 */
export enum NFTMarketplace {
  OPENSEA = 'OPENSEA',
  RARIBLE = 'RARIBLE',
  MAGIC_EDEN = 'MAGIC_EDEN',
  FOUNDATION = 'FOUNDATION',
}

/**
 * NFT status
 */
export enum NFTStatus {
  DRAFT = 'DRAFT',
  MINTED = 'MINTED',
  LISTED = 'LISTED',
  SOLD = 'SOLD',
  TRANSFERRED = 'TRANSFERRED',
}

/**
 * NFT metadata
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  externalUrl?: string;
  attributes: {
    traitType: string;
    value: string | number;
  }[];
  animationUrl?: string;
  backgroundColor?: string;
}

/**
 * NFT model
 */
export interface NFT {
  id: string;
  tokenId?: string;
  contractAddress?: string;
  standard: NFTStandard;
  blockchain: Blockchain;
  metadata: NFTMetadata;
  status: NFTStatus;
  creatorId: string;
  ownerId: string;
  mintedAt?: Date;
  royaltyPercentage: number; // e.g., 10 for 10%
  encryptionLevel: 'standard' | 'rose-gold-quantum';
  marketplaceListings: {
    marketplace: NFTMarketplace;
    listingUrl: string;
    price?: {
      amount: number;
      currency: string;
    };
    listedAt: Date;
  }[];
  blockchainAnchors: {
    transactionHash: string;
    blockNumber: number;
    timestamp: Date;
  }[];
  associatedContentIds: string[]; // YouTube videos, tracks, etc.
  createdAt: Date;
  updatedAt: Date;
}

/**
 * NFT Set for storytelling collections
 */
export interface NFTSet {
  id: string;
  name: string;
  description: string;
  theme: string;
  coverImage: string;
  nftIds: string[];
  creatorId: string;
  totalSupply: number;
  mintedCount: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  storytellingElements: {
    narrativeArc: string;
    keyMoments: {
      timestamp: number;
      description: string;
      nftId?: string;
    }[];
    visualThemes: string[];
  };
  youtubeVideoIds: string[]; // Associated YouTube videos
  blockchain: Blockchain;
  encryptionLevel: 'standard' | 'rose-gold-quantum';
  royaltyDistribution: {
    creatorPercentage: number;
    platformPercentage: number;
    collaboratorPercentages: {
      userId: string;
      percentage: number;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * NFT Royalty Transaction
 */
export interface NFTRoyaltyTransaction {
  id: string;
  nftId: string;
  nftSetId?: string;
  transactionType: 'sale' | 'resale' | 'transfer';
  salePrice: {
    amount: number;
    currency: string;
    usdEquivalent: number;
  };
  royaltyAmount: {
    amount: number;
    currency: string;
    usdEquivalent: number;
  };
  distributions: {
    recipientId: string;
    recipientAddress: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processed' | 'failed';
    transactionHash?: string;
  }[];
  marketplace: NFTMarketplace;
  blockchain: Blockchain;
  blockchainAnchor: {
    transactionHash: string;
    blockNumber: number;
    timestamp: Date;
  };
  encryptionApplied: boolean;
  createdAt: Date;
  processedAt?: Date;
}

/**
 * Marketplace Integration Status
 */
export interface MarketplaceIntegration {
  marketplace: NFTMarketplace;
  enabled: boolean;
  apiKey?: string;
  walletAddress?: string;
  collectionAddress?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: Date;
  autoList: boolean;
  defaultRoyaltyPercentage: number;
}

/**
 * Visual Content for NFT
 */
export interface NFTVisualContent {
  id: string;
  nftId: string;
  nftSetId?: string;
  contentType: 'image' | 'video' | 'animation' | '3d-model' | 'audio';
  url: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    fileSize: number;
    mimeType: string;
  };
  generatedBy: 'manual' | 'ai-automated' | 'youtube-extracted';
  sourceReference?: string; // e.g., YouTube video ID
  encryptionApplied: boolean;
  createdAt: Date;
}
