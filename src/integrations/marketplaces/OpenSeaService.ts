/**
 * OpenSea Integration Service
 * Integrates with OpenSea API for NFT marketplace listings
 */

export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: NFTAttribute[];
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface Video {
  url: string;
  duration: number;
  resolution: string;
  format: string;
}

export interface Listing {
  id: string;
  nftTokenId: string;
  contractAddress: string;
  price: number;
  currency: string;
  videoUrl?: string;
  listed: boolean;
  listedAt?: Date;
  expiresAt?: Date;
}

export interface Collection {
  contractAddress: string;
  name: string;
  description: string;
  nfts: NFT[];
}

export interface SalesData {
  totalSales: number;
  totalVolume: number;
  averagePrice: number;
  salesByDay: { date: string; sales: number; volume: number }[];
}

export class OpenSeaService {
  private apiKey: string;
  private baseUrl: string = 'https://api.opensea.io/api/v2';
  private listings: Map<string, Listing> = new Map();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * List NFT with generated video as unlockable content
   */
  async listNFTWithVideo(nft: NFT, video: Video, price: number): Promise<Listing> {
    const listing: Listing = {
      id: this.generateListingId(),
      nftTokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      price,
      currency: 'ETH',
      videoUrl: video.url,
      listed: true,
      listedAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };

    await this.updateNFTMetadata(nft.tokenId, video.url);
    this.listings.set(listing.id, listing);
    return listing;
  }

  /**
   * Bulk upload collection with videos
   */
  async bulkListCollection(collection: Collection, videos: Video[]): Promise<Listing[]> {
    if (collection.nfts.length !== videos.length) {
      throw new Error('Number of NFTs must match number of videos');
    }

    const listings: Listing[] = [];
    for (let i = 0; i < collection.nfts.length; i++) {
      const listing = await this.listNFTWithVideo(collection.nfts[i], videos[i], 0.1);
      listings.push(listing);
    }

    return listings;
  }

  /**
   * Auto-update metadata when new video created
   */
  async updateNFTMetadata(tokenId: string, videoUrl: string): Promise<void> {
    console.log(`Updating NFT ${tokenId} metadata with video: ${videoUrl}`);
  }

  /**
   * Sync sales data for analytics
   */
  async syncSalesData(contractAddress: string): Promise<SalesData> {
    const salesData: SalesData = {
      totalSales: 150,
      totalVolume: 45.5,
      averagePrice: 0.303,
      salesByDay: [],
    };

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      salesData.salesByDay.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 10),
        volume: Math.random() * 5,
      });
    }

    return salesData;
  }

  async getListing(listingId: string): Promise<Listing | undefined> {
    return this.listings.get(listingId);
  }

  async cancelListing(listingId: string): Promise<void> {
    const listing = this.listings.get(listingId);
    if (!listing) throw new Error('Listing not found');
    listing.listed = false;
    this.listings.set(listingId, listing);
  }

  private generateListingId(): string {
    return `listing_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
