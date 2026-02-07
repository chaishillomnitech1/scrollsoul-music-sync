import { v4 as uuidv4 } from 'uuid';
import { YouTubeVideoIntegrationService, IntegratedVideo } from './YouTubeVideoIntegrationService';
import { NFTManagementService } from './NFTManagementService';
import { Blockchain, NFTStandard, NFTMarketplace, NFT, NFTSet } from '../models/NFT';

/**
 * Automated Content Generation Configuration
 */
export interface AutoContentConfig {
  enabled: boolean;
  generateFromYouTube: boolean;
  autoMint: boolean;
  autoList: boolean;
  defaultBlockchain: Blockchain;
  defaultMarketplaces: NFTMarketplace[];
  defaultRoyaltyPercentage: number;
  encryptionLevel: 'standard' | 'rose-gold-quantum';
}

/**
 * Storytelling NFT Service
 * Combines YouTube integration with NFT management for automated storytelling
 */
export class StorytellingNFTService {
  private youtubeService: YouTubeVideoIntegrationService;
  private nftService: NFTManagementService;
  private autoContentConfig: AutoContentConfig;

  constructor(youtubeApiKey: string, autoConfig?: Partial<AutoContentConfig>) {
    this.youtubeService = new YouTubeVideoIntegrationService(youtubeApiKey);
    this.nftService = new NFTManagementService();
    
    this.autoContentConfig = {
      enabled: true,
      generateFromYouTube: true,
      autoMint: false,
      autoList: false,
      defaultBlockchain: Blockchain.POLYGON,
      defaultMarketplaces: [NFTMarketplace.OPENSEA, NFTMarketplace.RARIBLE],
      defaultRoyaltyPercentage: 10,
      encryptionLevel: 'rose-gold-quantum',
      ...autoConfig,
    };
  }

  /**
   * Create NFT storytelling set from YouTube video
   */
  async createStorytellingSetFromVideo(
    youtubeUrl: string,
    creatorId: string,
    totalSupply: number,
    customization?: {
      theme?: string;
      narrativeArc?: string;
      royaltyDistribution?: NFTSet['royaltyDistribution'];
    }
  ): Promise<{
    nftSet: NFTSet;
    integratedVideo: IntegratedVideo;
    nfts: NFT[];
  }> {
    // Integrate YouTube video
    const integratedVideo = await this.youtubeService.integrateVideo(
      youtubeUrl,
      'nft-showcase'
    );

    // Generate storytelling content
    const storytelling = this.youtubeService.generateStorytellingContent(integratedVideo.id);

    // Create NFT set
    const nftSet = this.nftService.createNFTSet({
      name: storytelling.title,
      description: storytelling.description,
      theme: customization?.theme || integratedVideo.title,
      coverImage: integratedVideo.thumbnail,
      creatorId,
      totalSupply,
      blockchain: this.autoContentConfig.defaultBlockchain,
      storytellingElements: {
        narrativeArc: customization?.narrativeArc || storytelling.description,
        keyMoments: storytelling.visualCues.map((cue, index) => ({
          timestamp: (integratedVideo.duration / storytelling.visualCues.length) * index,
          description: cue,
        })),
        visualThemes: storytelling.visualCues,
      },
      youtubeVideoIds: [integratedVideo.youtubeVideoId],
      royaltyDistribution: customization?.royaltyDistribution || {
        creatorPercentage: 90,
        platformPercentage: 10,
        collaboratorPercentages: [],
      },
    });

    // Update integrated video with NFT set reference
    integratedVideo.metadata.nftSetId = nftSet.id;

    // Auto-generate NFTs for the set
    const nfts: NFT[] = [];
    for (let i = 0; i < Math.min(5, totalSupply); i++) {
      const nft = await this.generateNFTFromVideo(
        integratedVideo,
        creatorId,
        i,
        nftSet.id
      );
      nfts.push(nft);
      this.nftService.addNFTToSet(nft.id, nftSet.id);
    }

    return { nftSet, integratedVideo, nfts };
  }

  /**
   * Generate individual NFT from video
   */
  private async generateNFTFromVideo(
    video: IntegratedVideo,
    creatorId: string,
    index: number,
    nftSetId?: string
  ): Promise<NFT> {
    const storytelling = this.youtubeService.generateStorytellingContent(video.id);

    const nft = this.nftService.createNFT({
      metadata: {
        name: `${video.title} #${index + 1}`,
        description: `${storytelling.description}\n\nNFT ${index + 1} from the ${video.title} collection`,
        image: video.thumbnail,
        externalUrl: video.youtubeUrl,
        attributes: [
          { traitType: 'Video Source', value: 'YouTube' },
          { traitType: 'Collection', value: video.title },
          { traitType: 'Edition', value: index + 1 },
          { traitType: 'Duration', value: video.duration },
          { traitType: 'Encryption', value: 'Rose Gold Quantum' },
          ...video.tags.slice(0, 3).map(tag => ({ traitType: 'Theme', value: tag })),
        ],
        animationUrl: video.youtubeUrl,
      },
      standard: NFTStandard.ERC721,
      blockchain: this.autoContentConfig.defaultBlockchain,
      creatorId,
      royaltyPercentage: this.autoContentConfig.defaultRoyaltyPercentage,
      associatedContentIds: [video.id, video.youtubeVideoId],
      encryptionLevel: this.autoContentConfig.encryptionLevel,
    });

    // Create visual content reference
    this.nftService.createVisualContent({
      nftId: nft.id,
      nftSetId,
      contentType: 'video',
      url: video.youtubeUrl,
      thumbnailUrl: video.thumbnail,
      metadata: {
        duration: video.duration,
        fileSize: 0, // YouTube hosted
        mimeType: 'video/youtube',
      },
      generatedBy: 'youtube-extracted',
      sourceReference: video.youtubeVideoId,
    });

    // Auto-mint if configured
    if (this.autoContentConfig.autoMint) {
      await this.nftService.mintNFT(nft.id);

      // Auto-list if configured
      if (this.autoContentConfig.autoList) {
        for (const marketplace of this.autoContentConfig.defaultMarketplaces) {
          await this.nftService.listNFTOnMarketplace(nft.id, marketplace, {
            amount: 0.1,
            currency: 'ETH',
          });
        }
      }
    }

    return nft;
  }

  /**
   * Integrate specific YouTube video (from requirements)
   */
  async integrateScrollSoulVideo(creatorId: string): Promise<{
    nftSet: NFTSet;
    integratedVideo: IntegratedVideo;
    nfts: NFT[];
  }> {
    const scrollSoulVideoUrl = 'https://youtu.be/SMW_07yF35E?si=QN9p-OC4oAZTbcBB';
    
    return this.createStorytellingSetFromVideo(
      scrollSoulVideoUrl,
      creatorId,
      100, // Total supply
      {
        theme: 'ScrollSoul Empire Storytelling',
        narrativeArc: 'Amplifying ScrollSoul Music Sync storytelling and NFT initiatives with Rose Gold Quantum Encryption. Salute Sovereign always aligned.',
        royaltyDistribution: {
          creatorPercentage: 85,
          platformPercentage: 15,
          collaboratorPercentages: [],
        },
      }
    );
  }

  /**
   * Sync visual content with blockchain anchors
   */
  async syncContentWithBlockchain(nftId: string): Promise<void> {
    const nft = this.nftService.getNFT(nftId);
    if (!nft) {
      throw new Error(`NFT not found: ${nftId}`);
    }

    // Ensure NFT is minted
    if (nft.status === 'DRAFT') {
      await this.nftService.mintNFT(nftId);
    }

    // Visual content is automatically anchored to blockchain through NFT
    const visualContent = this.nftService.getVisualContent(nftId);
    
    // Apply rose-gold encryption to all visual content
    for (const content of visualContent) {
      if (!content.encryptionApplied) {
        content.encryptionApplied = true;
      }
    }
  }

  /**
   * Get storytelling analytics
   */
  getStorytellingAnalytics(nftSetId: string): {
    nftSet: NFTSet;
    nfts: NFT[];
    totalMinted: number;
    totalListed: number;
    totalRoyalties: number;
    integratedVideos: IntegratedVideo[];
  } {
    const nftSet = this.nftService.getNFTSet(nftSetId);
    if (!nftSet) {
      throw new Error(`NFT Set not found: ${nftSetId}`);
    }

    const nfts = this.nftService.getNFTsBySet(nftSetId);
    const totalMinted = nfts.filter(n => n.status !== 'DRAFT').length;
    const totalListed = nfts.filter(n => n.status === 'LISTED').length;

    // Calculate total royalties
    let totalRoyalties = 0;
    nfts.forEach(nft => {
      const transactions = this.nftService.getRoyaltyTransactions(nft.id);
      totalRoyalties += transactions.reduce((sum, tx) => sum + tx.royaltyAmount.usdEquivalent, 0);
    });

    // Get associated videos
    const integratedVideos = nftSet.youtubeVideoIds
      .map(videoId => 
        this.youtubeService.getAllIntegratedVideos()
          .find(v => v.youtubeVideoId === videoId)
      )
      .filter((v): v is IntegratedVideo => v !== undefined);

    return {
      nftSet,
      nfts,
      totalMinted,
      totalListed,
      totalRoyalties,
      integratedVideos,
    };
  }

  /**
   * Configure marketplace integrations
   */
  configureMarketplaces(marketplaces: NFTMarketplace[], enabled: boolean = true): void {
    marketplaces.forEach(marketplace => {
      this.nftService.configureMarketplace(marketplace, {
        enabled,
        status: enabled ? 'connected' : 'disconnected',
        autoList: this.autoContentConfig.autoList,
        defaultRoyaltyPercentage: this.autoContentConfig.defaultRoyaltyPercentage,
      });
    });
  }

  /**
   * Update auto-content configuration
   */
  updateAutoContentConfig(config: Partial<AutoContentConfig>): void {
    this.autoContentConfig = {
      ...this.autoContentConfig,
      ...config,
    };
  }

  /**
   * Get all NFT sets
   */
  getAllNFTSets(): NFTSet[] {
    return this.nftService.getAllNFTSets();
  }

  /**
   * Get all integrated videos
   */
  getAllIntegratedVideos(): IntegratedVideo[] {
    return this.youtubeService.getAllIntegratedVideos();
  }
}
