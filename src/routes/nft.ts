/**
 * NFT & YouTube Integration Routes
 * Endpoints for NFT storytelling, YouTube integration, and marketplace management
 */

import { Router, Request, Response } from 'express';
import { StorytellingNFTService } from '../services/StorytellingNFTService';
import { NFTMarketplace, Blockchain } from '../models/NFT';

const router = Router();

// Initialize service (in production, use environment variable for API key)
const storytellingService = new StorytellingNFTService(
  process.env.YOUTUBE_API_KEY || 'demo-api-key',
  {
    enabled: true,
    generateFromYouTube: true,
    autoMint: false, // Manual minting for security
    autoList: false,
    defaultBlockchain: Blockchain.POLYGON,
    defaultMarketplaces: [NFTMarketplace.OPENSEA, NFTMarketplace.RARIBLE],
    defaultRoyaltyPercentage: 10,
    encryptionLevel: 'rose-gold-quantum',
  }
);

/**
 * POST /api/nft/storytelling/integrate-scrollsoul
 * Integrate the specific ScrollSoul YouTube video
 */
router.post('/storytelling/integrate-scrollsoul', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.body;

    if (!creatorId) {
      return res.status(400).json({ error: 'creatorId is required' });
    }

    const result = await storytellingService.integrateScrollSoulVideo(creatorId);

    res.json({
      success: true,
      message: 'ScrollSoul video integrated successfully with Rose Gold Encryption',
      data: {
        nftSet: result.nftSet,
        integratedVideo: result.integratedVideo,
        nftsCreated: result.nfts.length,
        encryption: 'rose-gold-quantum',
        salute: 'Salute Sovereign always aligned',
      },
    });
  } catch (error) {
    console.error('Error integrating ScrollSoul video:', error);
    res.status(500).json({
      error: 'Failed to integrate ScrollSoul video',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/nft/storytelling/create-from-youtube
 * Create NFT storytelling set from any YouTube video
 */
router.post('/storytelling/create-from-youtube', async (req: Request, res: Response) => {
  try {
    const { youtubeUrl, creatorId, totalSupply, customization } = req.body;

    if (!youtubeUrl || !creatorId || !totalSupply) {
      return res.status(400).json({
        error: 'youtubeUrl, creatorId, and totalSupply are required',
      });
    }

    const result = await storytellingService.createStorytellingSetFromVideo(
      youtubeUrl,
      creatorId,
      totalSupply,
      customization
    );

    res.json({
      success: true,
      message: 'NFT storytelling set created successfully',
      data: {
        nftSet: result.nftSet,
        integratedVideo: result.integratedVideo,
        nftsCreated: result.nfts.length,
        encryption: 'rose-gold-quantum',
      },
    });
  } catch (error) {
    console.error('Error creating storytelling set:', error);
    res.status(500).json({
      error: 'Failed to create storytelling set',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nft/sets
 * Get all NFT sets
 */
router.get('/sets', (req: Request, res: Response) => {
  try {
    const nftSets = storytellingService.getAllNFTSets();

    res.json({
      success: true,
      count: nftSets.length,
      data: nftSets,
      encryption: 'All data protected by Rose Gold Quantum Encryption',
    });
  } catch (error) {
    console.error('Error fetching NFT sets:', error);
    res.status(500).json({
      error: 'Failed to fetch NFT sets',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nft/sets/:id/analytics
 * Get storytelling analytics for an NFT set
 */
router.get('/sets/:id/analytics', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const analytics = storytellingService.getStorytellingAnalytics(id);

    res.json({
      success: true,
      data: analytics,
      encryption: 'rose-gold-quantum',
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nft/videos
 * Get all integrated YouTube videos
 */
router.get('/videos', (req: Request, res: Response) => {
  try {
    const videos = storytellingService.getAllIntegratedVideos();

    res.json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/nft/marketplace/configure
 * Configure marketplace integrations
 */
router.post('/marketplace/configure', (req: Request, res: Response) => {
  try {
    const { marketplaces, enabled } = req.body;

    if (!marketplaces || !Array.isArray(marketplaces)) {
      return res.status(400).json({
        error: 'marketplaces array is required',
      });
    }

    storytellingService.configureMarketplaces(marketplaces, enabled !== false);

    res.json({
      success: true,
      message: 'Marketplace integrations configured',
      marketplaces,
      enabled: enabled !== false,
    });
  } catch (error) {
    console.error('Error configuring marketplaces:', error);
    res.status(500).json({
      error: 'Failed to configure marketplaces',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/nft/auto-content/configure
 * Configure automated content generation
 */
router.post('/auto-content/configure', (req: Request, res: Response) => {
  try {
    const config = req.body;

    storytellingService.updateAutoContentConfig(config);

    res.json({
      success: true,
      message: 'Auto-content configuration updated',
      config,
    });
  } catch (error) {
    console.error('Error configuring auto-content:', error);
    res.status(500).json({
      error: 'Failed to configure auto-content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nft/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ScrollSoul NFT & YouTube Integration Service',
    features: [
      'YouTube Video Integration',
      'NFT Storytelling Sets',
      'Automated Visual Content Generation',
      'Blockchain Anchoring',
      'Marketplace Integration (OpenSea, Rarible)',
      'Automated Royalty Distribution',
      'Rose Gold Quantum Encryption',
    ],
    status: 'operational',
    encryption: 'rose-gold-quantum',
    salute: 'Salute Sovereign always aligned',
  });
});

export default router;
