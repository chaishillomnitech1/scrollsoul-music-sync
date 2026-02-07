import { v4 as uuidv4 } from 'uuid';
import {
  NFT,
  NFTSet,
  NFTStandard,
  Blockchain,
  NFTMarketplace,
  NFTStatus,
  NFTMetadata,
  NFTRoyaltyTransaction,
  NFTVisualContent,
  MarketplaceIntegration,
} from '../models/NFT';

/**
 * NFT Management Service
 * Handles NFT creation, minting, marketplace integration, and storytelling
 */
export class NFTManagementService {
  private nfts: Map<string, NFT> = new Map();
  private nftSets: Map<string, NFTSet> = new Map();
  private royaltyTransactions: Map<string, NFTRoyaltyTransaction> = new Map();
  private visualContent: Map<string, NFTVisualContent> = new Map();
  private marketplaceIntegrations: Map<NFTMarketplace, MarketplaceIntegration> = new Map();

  constructor() {
    // Initialize with default marketplace integrations
    this.initializeMarketplaceIntegrations();
  }

  /**
   * Initialize marketplace integrations
   */
  private initializeMarketplaceIntegrations(): void {
    const marketplaces: NFTMarketplace[] = [
      NFTMarketplace.OPENSEA,
      NFTMarketplace.RARIBLE,
      NFTMarketplace.MAGIC_EDEN,
      NFTMarketplace.FOUNDATION,
    ];

    marketplaces.forEach(marketplace => {
      this.marketplaceIntegrations.set(marketplace, {
        marketplace,
        enabled: false,
        status: 'disconnected',
        autoList: false,
        defaultRoyaltyPercentage: 10,
      });
    });
  }

  /**
   * Create a new NFT
   */
  createNFT(params: {
    metadata: NFTMetadata;
    standard: NFTStandard;
    blockchain: Blockchain;
    creatorId: string;
    royaltyPercentage: number;
    associatedContentIds?: string[];
    encryptionLevel?: 'standard' | 'rose-gold-quantum';
  }): NFT {
    const nft: NFT = {
      id: uuidv4(),
      standard: params.standard,
      blockchain: params.blockchain,
      metadata: params.metadata,
      status: NFTStatus.DRAFT,
      creatorId: params.creatorId,
      ownerId: params.creatorId,
      royaltyPercentage: params.royaltyPercentage,
      encryptionLevel: params.encryptionLevel || 'rose-gold-quantum',
      marketplaceListings: [],
      blockchainAnchors: [],
      associatedContentIds: params.associatedContentIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.nfts.set(nft.id, nft);
    return nft;
  }

  /**
   * Create an NFT set for storytelling
   */
  createNFTSet(params: {
    name: string;
    description: string;
    theme: string;
    coverImage: string;
    creatorId: string;
    totalSupply: number;
    blockchain: Blockchain;
    storytellingElements: NFTSet['storytellingElements'];
    youtubeVideoIds?: string[];
    royaltyDistribution: NFTSet['royaltyDistribution'];
  }): NFTSet {
    const nftSet: NFTSet = {
      id: uuidv4(),
      name: params.name,
      description: params.description,
      theme: params.theme,
      coverImage: params.coverImage,
      nftIds: [],
      creatorId: params.creatorId,
      totalSupply: params.totalSupply,
      mintedCount: 0,
      status: 'draft',
      storytellingElements: params.storytellingElements,
      youtubeVideoIds: params.youtubeVideoIds || [],
      blockchain: params.blockchain,
      encryptionLevel: 'rose-gold-quantum',
      royaltyDistribution: params.royaltyDistribution,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.nftSets.set(nftSet.id, nftSet);
    return nftSet;
  }

  /**
   * Add NFT to a set
   */
  addNFTToSet(nftId: string, nftSetId: string): void {
    const nft = this.nfts.get(nftId);
    const nftSet = this.nftSets.get(nftSetId);

    if (!nft) throw new Error(`NFT not found: ${nftId}`);
    if (!nftSet) throw new Error(`NFT Set not found: ${nftSetId}`);

    if (!nftSet.nftIds.includes(nftId)) {
      nftSet.nftIds.push(nftId);
      nftSet.updatedAt = new Date();
      this.nftSets.set(nftSetId, nftSet);
    }
  }

  /**
   * Mint NFT (simulate blockchain minting)
   */
  async mintNFT(nftId: string): Promise<NFT> {
    const nft = this.nfts.get(nftId);
    if (!nft) throw new Error(`NFT not found: ${nftId}`);

    // Simulate minting process
    nft.status = NFTStatus.MINTED;
    nft.tokenId = `TOKEN_${uuidv4().substring(0, 8)}`;
    nft.contractAddress = this.generateContractAddress(nft.blockchain);
    nft.mintedAt = new Date();

    // Create blockchain anchor
    nft.blockchainAnchors.push({
      transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: new Date(),
    });

    nft.updatedAt = new Date();
    this.nfts.set(nftId, nft);

    return nft;
  }

  /**
   * List NFT on marketplace
   */
  async listNFTOnMarketplace(
    nftId: string,
    marketplace: NFTMarketplace,
    price: { amount: number; currency: string }
  ): Promise<NFT> {
    const nft = this.nfts.get(nftId);
    if (!nft) throw new Error(`NFT not found: ${nftId}`);
    if (nft.status !== NFTStatus.MINTED) {
      throw new Error('NFT must be minted before listing');
    }

    const integration = this.marketplaceIntegrations.get(marketplace);
    if (!integration || !integration.enabled) {
      throw new Error(`Marketplace ${marketplace} is not enabled`);
    }

    // Simulate marketplace listing
    const listingUrl = this.generateMarketplaceUrl(marketplace, nft);
    
    nft.marketplaceListings.push({
      marketplace,
      listingUrl,
      price,
      listedAt: new Date(),
    });

    nft.status = NFTStatus.LISTED;
    nft.updatedAt = new Date();
    this.nfts.set(nftId, nft);

    return nft;
  }

  /**
   * Process NFT royalty on sale
   */
  async processRoyalty(params: {
    nftId: string;
    nftSetId?: string;
    salePrice: { amount: number; currency: string; usdEquivalent: number };
    marketplace: NFTMarketplace;
    blockchain: Blockchain;
  }): Promise<NFTRoyaltyTransaction> {
    const nft = this.nfts.get(params.nftId);
    if (!nft) throw new Error(`NFT not found: ${params.nftId}`);

    const royaltyAmount = params.salePrice.amount * (nft.royaltyPercentage / 100);

    const distributions: NFTRoyaltyTransaction['distributions'] = [];

    // If part of a set, use set's royalty distribution
    if (params.nftSetId) {
      const nftSet = this.nftSets.get(params.nftSetId);
      if (nftSet) {
        const creatorAmount = royaltyAmount * (nftSet.royaltyDistribution.creatorPercentage / 100);
        distributions.push({
          recipientId: nftSet.creatorId,
          recipientAddress: this.generateWalletAddress(params.blockchain),
          amount: creatorAmount,
          currency: params.salePrice.currency,
          status: 'processed',
          transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
        });

        // Add collaborator distributions
        nftSet.royaltyDistribution.collaboratorPercentages.forEach(collab => {
          const collabAmount = royaltyAmount * (collab.percentage / 100);
          distributions.push({
            recipientId: collab.userId,
            recipientAddress: this.generateWalletAddress(params.blockchain),
            amount: collabAmount,
            currency: params.salePrice.currency,
            status: 'processed',
            transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
          });
        });
      }
    } else {
      // Simple creator royalty
      distributions.push({
        recipientId: nft.creatorId,
        recipientAddress: this.generateWalletAddress(params.blockchain),
        amount: royaltyAmount,
        currency: params.salePrice.currency,
        status: 'processed',
        transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
      });
    }

    const transaction: NFTRoyaltyTransaction = {
      id: uuidv4(),
      nftId: params.nftId,
      nftSetId: params.nftSetId,
      transactionType: 'sale',
      salePrice: params.salePrice,
      royaltyAmount: {
        amount: royaltyAmount,
        currency: params.salePrice.currency,
        usdEquivalent: params.salePrice.usdEquivalent * (nft.royaltyPercentage / 100),
      },
      distributions,
      marketplace: params.marketplace,
      blockchain: params.blockchain,
      blockchainAnchor: {
        transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
        timestamp: new Date(),
      },
      encryptionApplied: nft.encryptionLevel === 'rose-gold-quantum',
      createdAt: new Date(),
      processedAt: new Date(),
    };

    this.royaltyTransactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Generate visual content for NFT from source
   */
  createVisualContent(params: {
    nftId: string;
    nftSetId?: string;
    contentType: NFTVisualContent['contentType'];
    url: string;
    thumbnailUrl?: string;
    metadata: NFTVisualContent['metadata'];
    generatedBy: NFTVisualContent['generatedBy'];
    sourceReference?: string;
  }): NFTVisualContent {
    const content: NFTVisualContent = {
      id: uuidv4(),
      nftId: params.nftId,
      nftSetId: params.nftSetId,
      contentType: params.contentType,
      url: params.url,
      thumbnailUrl: params.thumbnailUrl,
      metadata: params.metadata,
      generatedBy: params.generatedBy,
      sourceReference: params.sourceReference,
      encryptionApplied: true, // Always apply rose-gold encryption
      createdAt: new Date(),
    };

    this.visualContent.set(content.id, content);
    return content;
  }

  /**
   * Configure marketplace integration
   */
  configureMarketplace(
    marketplace: NFTMarketplace,
    config: Partial<MarketplaceIntegration>
  ): MarketplaceIntegration {
    const existing = this.marketplaceIntegrations.get(marketplace) || {
      marketplace,
      enabled: false,
      status: 'disconnected',
      autoList: false,
      defaultRoyaltyPercentage: 10,
    };

    const updated: MarketplaceIntegration = {
      ...existing,
      ...config,
      marketplace,
    };

    this.marketplaceIntegrations.set(marketplace, updated);
    return updated;
  }

  /**
   * Get all NFTs
   */
  getAllNFTs(): NFT[] {
    return Array.from(this.nfts.values());
  }

  /**
   * Get NFT by ID
   */
  getNFT(id: string): NFT | undefined {
    return this.nfts.get(id);
  }

  /**
   * Get all NFT sets
   */
  getAllNFTSets(): NFTSet[] {
    return Array.from(this.nftSets.values());
  }

  /**
   * Get NFT set by ID
   */
  getNFTSet(id: string): NFTSet | undefined {
    return this.nftSets.get(id);
  }

  /**
   * Get NFTs by set
   */
  getNFTsBySet(nftSetId: string): NFT[] {
    const nftSet = this.nftSets.get(nftSetId);
    if (!nftSet) return [];

    return nftSet.nftIds
      .map(id => this.nfts.get(id))
      .filter((nft): nft is NFT => nft !== undefined);
  }

  /**
   * Get royalty transactions for NFT
   */
  getRoyaltyTransactions(nftId: string): NFTRoyaltyTransaction[] {
    return Array.from(this.royaltyTransactions.values())
      .filter(tx => tx.nftId === nftId);
  }

  /**
   * Get visual content for NFT
   */
  getVisualContent(nftId: string): NFTVisualContent[] {
    return Array.from(this.visualContent.values())
      .filter(content => content.nftId === nftId);
  }

  // Helper methods

  private generateContractAddress(blockchain: Blockchain): string {
    const prefix = blockchain === Blockchain.ETHEREUM || blockchain === Blockchain.POLYGON 
      ? '0x' 
      : blockchain === Blockchain.SOLANA 
      ? '' 
      : '0x';
    
    return `${prefix}${uuidv4().replace(/-/g, '').substring(0, 40)}`;
  }

  private generateWalletAddress(blockchain: Blockchain): string {
    return this.generateContractAddress(blockchain);
  }

  private generateMarketplaceUrl(marketplace: NFTMarketplace, nft: NFT): string {
    const baseUrls: Record<NFTMarketplace, string> = {
      [NFTMarketplace.OPENSEA]: 'https://opensea.io/assets',
      [NFTMarketplace.RARIBLE]: 'https://rarible.com/token',
      [NFTMarketplace.MAGIC_EDEN]: 'https://magiceden.io/item-details',
      [NFTMarketplace.FOUNDATION]: 'https://foundation.app/collection',
    };

    const base = baseUrls[marketplace];
    return `${base}/${nft.contractAddress}/${nft.tokenId}`;
  }
}
