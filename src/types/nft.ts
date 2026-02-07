/**
 * NFT and Story Set Type Definitions
 * Rose Gold Encryption Enabled
 */

export interface NFTAsset {
  id: string;
  tokenId: string;
  contractAddress: string;
  chain: 'ethereum' | 'polygon' | 'solana';
  owner: string;
  metadata: NFTMetadata;
  imageUrl: string;
  animationUrl?: string;
  createdAt: Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  externalUrl?: string;
  backgroundColor?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  nftReferences: string[]; // NFT IDs featured in this chapter
  duration?: number; // seconds
  order: number;
}

export interface EmotionalTone {
  timestamp: number; // seconds
  tone: 'joyful' | 'dramatic' | 'mysterious' | 'peaceful' | 'intense' | 'inspirational';
  intensity: number; // 0-10
}

export interface StoryNarrative {
  synopsis: string;
  chapters: Chapter[];
  voiceoverScript: string;
  emotionalArc: EmotionalTone[];
  targetDuration: number; // seconds
}

export interface TextOverlayConfig {
  fontFamily: string;
  fontSize: number;
  color: string;
  position: 'top' | 'center' | 'bottom';
  animation?: 'fade' | 'slide' | 'zoom';
}

export interface VisualStyleConfig {
  colorPalette: string[];
  cinematicStyle: 'cinematic' | 'anime' | 'realistic' | 'abstract';
  transitionStyle: 'smooth' | 'dynamic' | 'glitch' | 'fade';
  textOverlayTemplate: TextOverlayConfig;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  fileUrl: string;
  tempo?: number;
  mood?: string;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  resolution: '720p' | '1080p' | '4k';
  format: 'mp4' | 'webm' | 'mov';
  generatedBy: 'runway' | 'sora' | 'synthesia' | 'domoai' | 'kling';
  generatedAt: Date;
  fileSize: number; // bytes
  status: 'processing' | 'completed' | 'failed';
}

export interface BlockchainAnchor {
  transactionHash: string;
  blockNumber: number;
  chain: 'ethereum' | 'polygon' | 'solana';
  timestamp: Date;
  metadataIpfsHash?: string;
}

export interface NFTStorySet {
  id: string;
  title: string;
  description: string;
  nfts: NFTAsset[];
  narrative: StoryNarrative;
  visualStyle: VisualStyleConfig;
  musicTrack?: MusicTrack;
  generatedVideos: GeneratedVideo[];
  blockchainAnchors: BlockchainAnchor[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'processing' | 'published' | 'archived';
}

export interface VideoGenerationRequest {
  prompt: string;
  style?: string;
  duration?: number;
  resolution?: '720p' | '1080p' | '4k';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  seed?: number;
}

export interface VideoGenerationResponse {
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  url?: string;
  thumbnailUrl?: string;
  estimatedCompletionTime?: number; // seconds
  error?: string;
}
