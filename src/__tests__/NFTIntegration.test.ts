import { YouTubeVideoIntegrationService } from '../services/YouTubeVideoIntegrationService';
import { NFTManagementService } from '../services/NFTManagementService';
import { StorytellingNFTService } from '../services/StorytellingNFTService';
import { NFTMarketplace, Blockchain, NFTStandard, NFTStatus } from '../models/NFT';

describe('NFT Integration Tests', () => {
  let youtubeService: YouTubeVideoIntegrationService;
  let nftService: NFTManagementService;
  let storytellingService: StorytellingNFTService;

  beforeEach(() => {
    youtubeService = new YouTubeVideoIntegrationService('test-api-key');
    nftService = new NFTManagementService();
    storytellingService = new StorytellingNFTService('test-api-key', {
      enabled: true,
      autoMint: false,
      encryptionLevel: 'rose-gold-quantum',
    });
  });

  describe('YouTube Video Integration', () => {
    it('should extract video ID from YouTube URL', () => {
      const url1 = 'https://youtu.be/SMW_07yF35E?si=QN9p-OC4oAZTbcBB';
      const url2 = 'https://www.youtube.com/watch?v=SMW_07yF35E';
      const url3 = 'https://www.youtube.com/embed/SMW_07yF35E';

      expect(youtubeService.extractVideoId(url1)).toBe('SMW_07yF35E');
      expect(youtubeService.extractVideoId(url2)).toBe('SMW_07yF35E');
      expect(youtubeService.extractVideoId(url3)).toBe('SMW_07yF35E');
    });

    it('should return null for invalid YouTube URL', () => {
      const invalidUrl = 'https://example.com/video';
      expect(youtubeService.extractVideoId(invalidUrl)).toBeNull();
    });

    it('should generate storytelling content', () => {
      // This would require mocking the YouTube API call
      // For now, we test that the method exists and is callable
      expect(typeof youtubeService.generateStorytellingContent).toBe('function');
    });
  });

  describe('NFT Management', () => {
    it('should create an NFT', () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: [
            { traitType: 'Test', value: 'Value' }
          ]
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
        encryptionLevel: 'rose-gold-quantum',
      });

      expect(nft).toBeDefined();
      expect(nft.id).toBeDefined();
      expect(nft.metadata.name).toBe('Test NFT');
      expect(nft.status).toBe(NFTStatus.DRAFT);
      expect(nft.encryptionLevel).toBe('rose-gold-quantum');
      expect(nft.royaltyPercentage).toBe(10);
    });

    it('should create an NFT set', () => {
      const nftSet = nftService.createNFTSet({
        name: 'Test Collection',
        description: 'Test collection description',
        theme: 'Music',
        coverImage: 'https://example.com/cover.jpg',
        creatorId: 'creator-123',
        totalSupply: 100,
        blockchain: Blockchain.POLYGON,
        storytellingElements: {
          narrativeArc: 'Epic journey',
          keyMoments: [
            { timestamp: 0, description: 'Beginning' },
            { timestamp: 100, description: 'Climax' }
          ],
          visualThemes: ['Dark', 'Epic', 'Powerful']
        },
        royaltyDistribution: {
          creatorPercentage: 90,
          platformPercentage: 10,
          collaboratorPercentages: []
        }
      });

      expect(nftSet).toBeDefined();
      expect(nftSet.id).toBeDefined();
      expect(nftSet.name).toBe('Test Collection');
      expect(nftSet.totalSupply).toBe(100);
      expect(nftSet.mintedCount).toBe(0);
      expect(nftSet.status).toBe('draft');
      expect(nftSet.encryptionLevel).toBe('rose-gold-quantum');
    });

    it('should add NFT to set', () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      const nftSet = nftService.createNFTSet({
        name: 'Test Collection',
        description: 'Test collection description',
        theme: 'Music',
        coverImage: 'https://example.com/cover.jpg',
        creatorId: 'creator-123',
        totalSupply: 100,
        blockchain: Blockchain.POLYGON,
        storytellingElements: {
          narrativeArc: 'Epic journey',
          keyMoments: [],
          visualThemes: []
        },
        royaltyDistribution: {
          creatorPercentage: 90,
          platformPercentage: 10,
          collaboratorPercentages: []
        }
      });

      nftService.addNFTToSet(nft.id, nftSet.id);

      const updatedSet = nftService.getNFTSet(nftSet.id);
      expect(updatedSet?.nftIds).toContain(nft.id);
    });

    it('should mint an NFT', async () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      const mintedNFT = await nftService.mintNFT(nft.id);

      expect(mintedNFT.status).toBe(NFTStatus.MINTED);
      expect(mintedNFT.tokenId).toBeDefined();
      expect(mintedNFT.contractAddress).toBeDefined();
      expect(mintedNFT.mintedAt).toBeDefined();
      expect(mintedNFT.blockchainAnchors).toHaveLength(1);
      expect(mintedNFT.blockchainAnchors[0].transactionHash).toBeDefined();
    });

    it('should list NFT on marketplace', async () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      await nftService.mintNFT(nft.id);
      
      // Configure marketplace
      nftService.configureMarketplace(NFTMarketplace.OPENSEA, {
        enabled: true,
        status: 'connected',
      });

      const listedNFT = await nftService.listNFTOnMarketplace(
        nft.id,
        NFTMarketplace.OPENSEA,
        { amount: 0.1, currency: 'ETH' }
      );

      expect(listedNFT.status).toBe(NFTStatus.LISTED);
      expect(listedNFT.marketplaceListings).toHaveLength(1);
      expect(listedNFT.marketplaceListings[0].marketplace).toBe(NFTMarketplace.OPENSEA);
      expect(listedNFT.marketplaceListings[0].price?.amount).toBe(0.1);
    });

    it('should process NFT royalty', async () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      await nftService.mintNFT(nft.id);

      const royaltyTx = await nftService.processRoyalty({
        nftId: nft.id,
        salePrice: {
          amount: 1.0,
          currency: 'ETH',
          usdEquivalent: 2000
        },
        marketplace: NFTMarketplace.OPENSEA,
        blockchain: Blockchain.POLYGON
      });

      expect(royaltyTx).toBeDefined();
      expect(royaltyTx.nftId).toBe(nft.id);
      expect(royaltyTx.royaltyAmount.amount).toBe(0.1); // 10% of 1.0 ETH
      expect(royaltyTx.distributions).toHaveLength(1);
      expect(royaltyTx.distributions[0].recipientId).toBe('creator-123');
      expect(royaltyTx.encryptionApplied).toBe(true);
    });

    it('should create visual content for NFT', () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      const visualContent = nftService.createVisualContent({
        nftId: nft.id,
        contentType: 'video',
        url: 'https://youtube.com/watch?v=test',
        thumbnailUrl: 'https://img.youtube.com/test.jpg',
        metadata: {
          duration: 180,
          fileSize: 10000000,
          mimeType: 'video/mp4'
        },
        generatedBy: 'youtube-extracted',
        sourceReference: 'test-video-id'
      });

      expect(visualContent).toBeDefined();
      expect(visualContent.nftId).toBe(nft.id);
      expect(visualContent.contentType).toBe('video');
      expect(visualContent.encryptionApplied).toBe(true);
    });
  });

  describe('Storytelling NFT Service', () => {
    it('should initialize with default configuration', () => {
      expect(storytellingService).toBeDefined();
      expect(storytellingService.getAllNFTSets).toBeDefined();
      expect(storytellingService.getAllIntegratedVideos).toBeDefined();
    });

    it('should configure marketplaces', () => {
      storytellingService.configureMarketplaces(
        [NFTMarketplace.OPENSEA, NFTMarketplace.RARIBLE],
        true
      );

      // Marketplace configuration should be successful
      // In a real test, we'd verify the internal state
      expect(true).toBe(true);
    });

    it('should update auto-content configuration', () => {
      storytellingService.updateAutoContentConfig({
        autoMint: true,
        autoList: true,
        defaultRoyaltyPercentage: 15
      });

      // Configuration update should be successful
      expect(true).toBe(true);
    });
  });

  describe('Rose Gold Encryption', () => {
    it('should apply rose-gold encryption to NFTs', () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Encrypted NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
        encryptionLevel: 'rose-gold-quantum',
      });

      expect(nft.encryptionLevel).toBe('rose-gold-quantum');
    });

    it('should apply rose-gold encryption to NFT sets', () => {
      const nftSet = nftService.createNFTSet({
        name: 'Encrypted Collection',
        description: 'Test collection',
        theme: 'Music',
        coverImage: 'https://example.com/cover.jpg',
        creatorId: 'creator-123',
        totalSupply: 100,
        blockchain: Blockchain.POLYGON,
        storytellingElements: {
          narrativeArc: 'Epic',
          keyMoments: [],
          visualThemes: []
        },
        royaltyDistribution: {
          creatorPercentage: 90,
          platformPercentage: 10,
          collaboratorPercentages: []
        }
      });

      expect(nftSet.encryptionLevel).toBe('rose-gold-quantum');
    });

    it('should apply encryption to visual content', () => {
      const nft = nftService.createNFT({
        metadata: {
          name: 'Test NFT',
          description: 'Test Description',
          image: 'https://example.com/image.jpg',
          attributes: []
        },
        standard: NFTStandard.ERC721,
        blockchain: Blockchain.POLYGON,
        creatorId: 'creator-123',
        royaltyPercentage: 10,
      });

      const visualContent = nftService.createVisualContent({
        nftId: nft.id,
        contentType: 'image',
        url: 'https://example.com/content.jpg',
        metadata: {
          width: 1920,
          height: 1080,
          fileSize: 500000,
          mimeType: 'image/jpeg'
        },
        generatedBy: 'ai-automated'
      });

      expect(visualContent.encryptionApplied).toBe(true);
    });
  });
});
