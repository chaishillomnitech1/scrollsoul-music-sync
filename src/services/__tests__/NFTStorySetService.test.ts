/**
 * NFT Story Set Service Tests
 */

import { NFTStorySetService } from '../NFTStorySetService';
import { NFTAsset } from '../../types/nft';

describe('NFTStorySetService', () => {
  let service: NFTStorySetService;
  let mockNFTs: NFTAsset[];

  beforeEach(() => {
    service = new NFTStorySetService();
    
    mockNFTs = [
      {
        id: 'nft-1',
        tokenId: '123',
        contractAddress: '0xabc',
        chain: 'ethereum',
        owner: '0xowner',
        metadata: {
          name: 'Sovereign #1',
          description: 'First in the collection',
          attributes: [
            { trait_type: 'Rarity', value: 'Legendary' },
          ],
        },
        imageUrl: 'https://example.com/1.png',
        createdAt: new Date(),
      },
      {
        id: 'nft-2',
        tokenId: '124',
        contractAddress: '0xabc',
        chain: 'ethereum',
        owner: '0xowner',
        metadata: {
          name: 'Sovereign #2',
          description: 'Second in the collection',
          attributes: [
            { trait_type: 'Rarity', value: 'Rare' },
          ],
        },
        imageUrl: 'https://example.com/2.png',
        createdAt: new Date(),
      },
    ];
  });

  describe('createStorySet', () => {
    it('should create a new story set with default values', async () => {
      const storySet = await service.createStorySet({
        title: 'Test Collection',
        description: 'Test description',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      expect(storySet).toBeDefined();
      expect(storySet.id).toBeDefined();
      expect(storySet.title).toBe('Test Collection');
      expect(storySet.description).toBe('Test description');
      expect(storySet.nfts).toHaveLength(2);
      expect(storySet.status).toBe('draft');
      expect(storySet.visualStyle.colorPalette).toContain('#B76E79');
      expect(storySet.narrative.chapters).toHaveLength(2);
    });

    it('should create story set with custom visual style', async () => {
      const storySet = await service.createStorySet({
        title: 'Custom Style',
        description: 'Custom description',
        nfts: mockNFTs,
        createdBy: 'user-123',
        visualStyle: {
          cinematicStyle: 'anime',
          transitionStyle: 'dynamic',
        },
      });

      expect(storySet.visualStyle.cinematicStyle).toBe('anime');
      expect(storySet.visualStyle.transitionStyle).toBe('dynamic');
    });

    it('should include music track if provided', async () => {
      const musicTrack = {
        id: 'track-1',
        title: 'Test Track',
        artist: 'Test Artist',
        duration: 180,
        fileUrl: 'https://example.com/track.mp3',
      };

      const storySet = await service.createStorySet({
        title: 'With Music',
        description: 'Has music track',
        nfts: mockNFTs,
        createdBy: 'user-123',
        musicTrack,
      });

      expect(storySet.musicTrack).toBeDefined();
      expect(storySet.musicTrack?.title).toBe('Test Track');
    });
  });

  describe('getStorySet', () => {
    it('should retrieve a story set by ID', async () => {
      const created = await service.createStorySet({
        title: 'Test',
        description: 'Test',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const retrieved = await service.getStorySet(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test');
    });

    it('should return undefined for non-existent ID', async () => {
      const retrieved = await service.getStorySet('non-existent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('updateStorySet', () => {
    it('should update story set title and description', async () => {
      const created = await service.createStorySet({
        title: 'Original',
        description: 'Original description',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const updated = await service.updateStorySet(created.id, {
        title: 'Updated',
        description: 'Updated description',
      });

      expect(updated.title).toBe('Updated');
      expect(updated.description).toBe('Updated description');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.createdAt.getTime());
    });

    it('should throw error for non-existent story set', async () => {
      await expect(
        service.updateStorySet('non-existent', { title: 'New Title' })
      ).rejects.toThrow('Story set not found');
    });
  });

  describe('deleteStorySet', () => {
    it('should delete a story set', async () => {
      const created = await service.createStorySet({
        title: 'To Delete',
        description: 'Will be deleted',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const deleted = await service.deleteStorySet(created.id);
      expect(deleted).toBe(true);

      const retrieved = await service.getStorySet(created.id);
      expect(retrieved).toBeUndefined();
    });

    it('should return false for non-existent ID', async () => {
      const deleted = await service.deleteStorySet('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('listStorySets', () => {
    it('should list all story sets', async () => {
      await service.createStorySet({
        title: 'Set 1',
        description: 'First set',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      await service.createStorySet({
        title: 'Set 2',
        description: 'Second set',
        nfts: mockNFTs,
        createdBy: 'user-456',
      });

      const allSets = await service.listStorySets();
      expect(allSets).toHaveLength(2);
    });

    it('should filter by createdBy', async () => {
      await service.createStorySet({
        title: 'User 123 Set',
        description: 'For user 123',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      await service.createStorySet({
        title: 'User 456 Set',
        description: 'For user 456',
        nfts: mockNFTs,
        createdBy: 'user-456',
      });

      const user123Sets = await service.listStorySets('user-123');
      expect(user123Sets).toHaveLength(1);
      expect(user123Sets[0].createdBy).toBe('user-123');
    });
  });

  describe('addGeneratedVideo', () => {
    it('should add a generated video to story set', async () => {
      const storySet = await service.createStorySet({
        title: 'Test',
        description: 'Test',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const video = {
        id: 'video-1',
        url: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        duration: 60,
        resolution: '1080p' as const,
        format: 'mp4' as const,
        generatedBy: 'sora' as const,
        generatedAt: new Date(),
        fileSize: 1000000,
        status: 'completed' as const,
      };

      const updated = await service.addGeneratedVideo(storySet.id, video);

      expect(updated.generatedVideos).toHaveLength(1);
      expect(updated.generatedVideos[0].id).toBe('video-1');
      expect(updated.generatedVideos[0].generatedBy).toBe('sora');
    });
  });

  describe('updateNarrative', () => {
    it('should update story narrative', async () => {
      const storySet = await service.createStorySet({
        title: 'Test',
        description: 'Test',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const updated = await service.updateNarrative(storySet.id, {
        synopsis: 'New synopsis',
        voiceoverScript: 'New script',
      });

      expect(updated.narrative.synopsis).toBe('New synopsis');
      expect(updated.narrative.voiceoverScript).toBe('New script');
    });
  });

  describe('generateScriptFromNFTs', () => {
    it('should generate a script from NFT metadata', async () => {
      const script = await service.generateScriptFromNFTs(mockNFTs);

      expect(script).toContain('2 extraordinary NFTs');
      expect(script).toContain('Sovereign #1');
      expect(script).toContain('Sovereign #2');
      expect(script).toContain('Rarity: Legendary');
      expect(script).toContain('ScrollSoul Empire');
    });
  });

  describe('updateStatus', () => {
    it('should update story set status', async () => {
      const storySet = await service.createStorySet({
        title: 'Test',
        description: 'Test',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const updated = await service.updateStatus(storySet.id, 'processing');
      expect(updated.status).toBe('processing');

      const published = await service.updateStatus(storySet.id, 'published');
      expect(published.status).toBe('published');
    });
  });

  describe('getStorySetsByStatus', () => {
    it('should filter story sets by status', async () => {
      await service.createStorySet({
        title: 'Draft 1',
        description: 'Draft',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });

      const storySet2 = await service.createStorySet({
        title: 'Processing 1',
        description: 'Processing',
        nfts: mockNFTs,
        createdBy: 'user-123',
      });
      await service.updateStatus(storySet2.id, 'processing');

      const drafts = await service.getStorySetsByStatus('draft');
      expect(drafts).toHaveLength(1);
      expect(drafts[0].title).toBe('Draft 1');

      const processing = await service.getStorySetsByStatus('processing');
      expect(processing).toHaveLength(1);
      expect(processing[0].title).toBe('Processing 1');
    });
  });
});
