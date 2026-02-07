/**
 * NFT Story Set Management Service
 * Manages NFT collections, narratives, and video generation
 * Rose Gold Encryption Enabled
 */

import { v4 as uuidv4 } from 'uuid';
import {
  NFTStorySet,
  NFTAsset,
  StoryNarrative,
  VisualStyleConfig,
  GeneratedVideo,
  BlockchainAnchor,
  MusicTrack,
} from '../types/nft';

export class NFTStorySetService {
  private storySets: Map<string, NFTStorySet>;

  constructor() {
    this.storySets = new Map();
  }

  /**
   * Create a new NFT story set
   */
  async createStorySet(params: {
    title: string;
    description: string;
    nfts: NFTAsset[];
    createdBy: string;
    visualStyle?: Partial<VisualStyleConfig>;
    musicTrack?: MusicTrack;
  }): Promise<NFTStorySet> {
    const id = uuidv4();
    
    const defaultVisualStyle: VisualStyleConfig = {
      colorPalette: ['#B76E79', '#E6C9A8', '#FFD700'], // Rose gold theme
      cinematicStyle: 'cinematic',
      transitionStyle: 'smooth',
      textOverlayTemplate: {
        fontFamily: 'Cinzel',
        fontSize: 48,
        color: '#FFD700',
        position: 'bottom',
        animation: 'fade',
      },
    };

    const storySet: NFTStorySet = {
      id,
      title: params.title,
      description: params.description,
      nfts: params.nfts,
      narrative: this.generateDefaultNarrative(params.nfts),
      visualStyle: { ...defaultVisualStyle, ...params.visualStyle },
      musicTrack: params.musicTrack,
      generatedVideos: [],
      blockchainAnchors: [],
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
    };

    this.storySets.set(id, storySet);
    return storySet;
  }

  /**
   * Get story set by ID
   */
  async getStorySet(id: string): Promise<NFTStorySet | undefined> {
    return this.storySets.get(id);
  }

  /**
   * Update story set
   */
  async updateStorySet(
    id: string,
    updates: Partial<Omit<NFTStorySet, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<NFTStorySet> {
    const storySet = this.storySets.get(id);
    if (!storySet) {
      throw new Error(`Story set not found: ${id}`);
    }

    const updatedStorySet: NFTStorySet = {
      ...storySet,
      ...updates,
      updatedAt: new Date(),
    };

    this.storySets.set(id, updatedStorySet);
    return updatedStorySet;
  }

  /**
   * Delete story set
   */
  async deleteStorySet(id: string): Promise<boolean> {
    return this.storySets.delete(id);
  }

  /**
   * List all story sets for a user
   */
  async listStorySets(createdBy?: string): Promise<NFTStorySet[]> {
    const sets = Array.from(this.storySets.values());
    
    if (createdBy) {
      return sets.filter(set => set.createdBy === createdBy);
    }
    
    return sets;
  }

  /**
   * Add generated video to story set
   */
  async addGeneratedVideo(
    storySetId: string,
    video: GeneratedVideo
  ): Promise<NFTStorySet> {
    const storySet = this.storySets.get(storySetId);
    if (!storySet) {
      throw new Error(`Story set not found: ${storySetId}`);
    }

    storySet.generatedVideos.push(video);
    storySet.updatedAt = new Date();
    
    this.storySets.set(storySetId, storySet);
    return storySet;
  }

  /**
   * Add blockchain anchor
   */
  async addBlockchainAnchor(
    storySetId: string,
    anchor: BlockchainAnchor
  ): Promise<NFTStorySet> {
    const storySet = this.storySets.get(storySetId);
    if (!storySet) {
      throw new Error(`Story set not found: ${storySetId}`);
    }

    storySet.blockchainAnchors.push(anchor);
    storySet.updatedAt = new Date();
    
    this.storySets.set(storySetId, storySet);
    return storySet;
  }

  /**
   * Update story narrative
   */
  async updateNarrative(
    storySetId: string,
    narrative: Partial<StoryNarrative>
  ): Promise<NFTStorySet> {
    const storySet = this.storySets.get(storySetId);
    if (!storySet) {
      throw new Error(`Story set not found: ${storySetId}`);
    }

    storySet.narrative = {
      ...storySet.narrative,
      ...narrative,
    };
    storySet.updatedAt = new Date();
    
    this.storySets.set(storySetId, storySet);
    return storySet;
  }

  /**
   * Generate AI-powered script from NFT metadata
   */
  async generateScriptFromNFTs(nfts: NFTAsset[]): Promise<string> {
    // Build a narrative script from NFT metadata
    const intro = `Welcome to an exclusive journey through ${nfts.length} extraordinary NFTs.`;
    
    const nftDescriptions = nfts.map((nft, index) => {
      const attributes = nft.metadata.attributes
        .map(attr => `${attr.trait_type}: ${attr.value}`)
        .join(', ');
      
      return `NFT ${index + 1}: ${nft.metadata.name}. ${nft.metadata.description}. Features: ${attributes}.`;
    }).join(' ');
    
    const outro = 'Each piece tells a unique story in the ScrollSoul Empire. Join the sovereign journey.';
    
    return `${intro} ${nftDescriptions} ${outro}`;
  }

  /**
   * Generate default narrative from NFT collection
   */
  private generateDefaultNarrative(nfts: NFTAsset[]): StoryNarrative {
    const chapters = nfts.map((nft, index) => ({
      id: uuidv4(),
      title: nft.metadata.name,
      content: nft.metadata.description,
      nftReferences: [nft.id],
      duration: 5,
      order: index,
    }));

    const synopsis = `A journey through ${nfts.length} unique NFTs from the ScrollSoul collection.`;
    
    const emotionalArc = this.generateEmotionalArc(chapters.length);
    
    const voiceoverScript = nfts.map((nft, i) => 
      `Chapter ${i + 1}: ${nft.metadata.name}. ${nft.metadata.description}`
    ).join('\n\n');

    return {
      synopsis,
      chapters,
      voiceoverScript,
      emotionalArc,
      targetDuration: chapters.length * 5,
    };
  }

  /**
   * Generate emotional arc for story
   */
  private generateEmotionalArc(chapterCount: number): Array<{
    timestamp: number;
    tone: 'joyful' | 'dramatic' | 'mysterious' | 'peaceful' | 'intense' | 'inspirational';
    intensity: number;
  }> {
    const arc = [];
    const totalDuration = chapterCount * 5;
    
    // Introduction - mysterious
    arc.push({
      timestamp: 0,
      tone: 'mysterious' as const,
      intensity: 6,
    });
    
    // Rising action - increasing intensity
    arc.push({
      timestamp: totalDuration * 0.25,
      tone: 'joyful' as const,
      intensity: 7,
    });
    
    // Climax - intense
    arc.push({
      timestamp: totalDuration * 0.7,
      tone: 'intense' as const,
      intensity: 9,
    });
    
    // Resolution - peaceful and inspirational
    arc.push({
      timestamp: totalDuration * 0.95,
      tone: 'inspirational' as const,
      intensity: 8,
    });
    
    return arc;
  }

  /**
   * Update story set status
   */
  async updateStatus(
    storySetId: string,
    status: 'draft' | 'processing' | 'published' | 'archived'
  ): Promise<NFTStorySet> {
    return this.updateStorySet(storySetId, { status });
  }

  /**
   * Get story sets by status
   */
  async getStorySetsByStatus(
    status: 'draft' | 'processing' | 'published' | 'archived'
  ): Promise<NFTStorySet[]> {
    return Array.from(this.storySets.values()).filter(
      set => set.status === status
    );
  }
}
